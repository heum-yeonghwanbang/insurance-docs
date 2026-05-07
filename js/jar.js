// === Gallery View (replaces jar) ===
let galleryFilter = 'all';

function renderGallery() {
  let filtered = galleryFilter === 'all' ? entries : entries.filter(e => e.category === parseInt(galleryFilter));
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  document.getElementById('galleryCount').textContent = filtered.length + '개 자료';

  // Filter buttons
  document.querySelectorAll('.gallery-filter button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === galleryFilter);
  });

  const grid = document.getElementById('galleryGrid');
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-msg" style="grid-column:1/-1;">자료가 없습니다.</div>';
    return;
  }

  grid.innerHTML = filtered.map(e => {
    const cat = CATEGORIES[e.category] || CATEGORIES[0];
    const hasImg = e.image && e.image.url;
    const imgHtml = hasImg
      ? '<div class="gc-img"><img src="' + escHtml(e.image.url) + '" alt=""></div>'
      : '<div class="gc-img">' + cat.icon + '</div>';
    const fileHtml = e.file ? '<div class="gc-file">&#x1F4CE; 첨부파일</div>' : '';
    return '<div class="gallery-card" onclick="showDetail(\'' + e.id + '\')">' +
      imgHtml +
      '<div class="gc-body">' +
        '<span class="gc-cat" style="background:' + cat.color + '">' + cat.name + '</span>' +
        '<div class="gc-title">' + escHtml(e.title) + '</div>' +
        '<div class="gc-meta">' + escHtml(e.author || '') + ' · ' + formatDate(e.date) + '</div>' +
        fileHtml +
      '</div></div>';
  }).join('');
}

function setGalleryFilter(f) {
  galleryFilter = f;
  renderGallery();
}

function showDetail(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  const cat = CATEGORIES[entry.category] || CATEGORIES[0];

  let html = '';
  if (entry.image && entry.image.url) {
    html += '<img class="dc-img" src="' + escHtml(entry.image.url) + '">';
  }
  html += '<span class="dc-cat" style="background:' + cat.color + '">' + cat.icon + ' ' + cat.name + '</span>';
  html += '<div class="dc-title">' + escHtml(entry.title) + '</div>';
  html += '<div class="dc-meta">' + escHtml(entry.author || '익명') + ' · ' + formatDate(entry.date) + '</div>';
  html += '<div class="dc-body">' + escHtml(entry.body) + '</div>';

  if (entry.file) {
    html += '<a class="dc-file" href="' + escHtml(entry.file.url) + '" target="_blank" download>&#x1F4CE; ' + escHtml(entry.file.name) + '</a>';
  }

  if (entry.tags && entry.tags.length) {
    html += '<div class="dc-tags">' + entry.tags.map(t => '<span class="dc-tag">' + escHtml(t) + '</span>').join('') + '</div>';
  }

  html += '<button class="detail-close" onclick="closeDetail()">닫기</button>';

  document.getElementById('detailContent').innerHTML = html;
  document.getElementById('detailPopup').classList.add('show');
}

function closeDetail() {
  document.getElementById('detailPopup').classList.remove('show');
}
