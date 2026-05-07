// === Document Jar (Visualization) ===
function renderJar() {
  const container = document.getElementById('jarBalls');
  let sorted = [...entries];

  if (jarSort === 'date') {
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (jarSort === 'category') {
    sorted.sort((a, b) => a.category - b.category);
  } else if (jarSort === 'frequency') {
    // Group by category, most frequent category first
    const catCounts = {};
    entries.forEach(e => { catCounts[e.category] = (catCounts[e.category] || 0) + 1; });
    sorted.sort((a, b) => (catCounts[b.category] || 0) - (catCounts[a.category] || 0));
  } else if (jarSort === 'length') {
    sorted.sort((a, b) => ((b.title || '').length + (b.body || '').length) - ((a.title || '').length + (a.body || '').length));
  }

  document.getElementById('jarCount').textContent = sorted.length + '개의 자료가 담겨있어요';

  container.innerHTML = sorted.map(e => {
    const cat = CATEGORIES[e.category] || CATEGORIES[0];
    const textLen = (e.title || '').length + (e.body || '').length;
    const size = Math.min(Math.max(20, 20 + Math.floor(textLen / 20) * 2), 44);
    return '<div class="jar-ball" style="width:' + size + 'px;height:' + size + 'px;background:' + cat.color +
      ';box-shadow:inset -3px -3px 6px rgba(0,0,0,0.15),inset 2px 2px 4px rgba(255,255,255,0.2);" onclick="showBallDetail(\'' + e.id + '\')" title="' +
      escHtml(cat.name + ' · ' + e.title) + '"></div>';
  }).join('');

  document.getElementById('jarLegend').innerHTML = CATEGORIES.map(c => {
    const count = entries.filter(e => CATEGORIES[e.category] && CATEGORIES[e.category].name === c.name).length;
    return '<div class="jar-legend-item"><div class="jar-legend-dot" style="background:' + c.color + '"></div>' + c.icon + ' ' + c.name + ' (' + count + ')</div>';
  }).join('');

  // Update sort buttons
  document.querySelectorAll('.jar-sort button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === jarSort);
  });
}

function setJarSort(sort) {
  jarSort = sort;
  renderJar();
}

function showBallDetail(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  const cat = CATEGORIES[entry.category] || CATEGORIES[0];
  document.getElementById('popupDot').style.background = cat.color;
  document.getElementById('popupCat').textContent = cat.icon + ' ' + cat.name + (entry.author ? ' \u00B7 ' + entry.author : '');
  document.getElementById('popupDate').textContent = formatDate(entry.date);
  document.getElementById('popupTitle').textContent = entry.title;
  document.getElementById('popupBody').textContent = entry.body;
  document.getElementById('ballPopup').classList.add('show');
}

function closeBallPopup() {
  document.getElementById('ballPopup').classList.remove('show');
}
