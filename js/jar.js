// === Analysis Page ===
let analysisFilter = 'all';

function renderAnalysis() {
  let filtered = analysisFilter === 'all' ? entries : entries.filter(e => e.category === parseInt(analysisFilter));
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  document.getElementById('analysisCount').textContent = filtered.length + '개 자료';

  document.querySelectorAll('.gallery-filter button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === analysisFilter);
  });

  const container = document.getElementById('analysisList');
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-msg">자료가 없습니다.</div>';
    return;
  }

  container.innerHTML = filtered.map(e => {
    const cat = CATEGORIES[e.category] || CATEGORIES[0];
    const hasAnalysis = e.analysis && e.analysis.trim();
    const analysisHtml = hasAnalysis
      ? '<div class="analysis-content">' + escHtml(e.analysis) + '</div>'
      : '<div class="analysis-empty">아직 분석이 작성되지 않았습니다.</div>';
    const editBtn = isAdmin
      ? '<button class="analysis-edit-btn" onclick="openAnalysisModal(\'' + e.id + '\')">' + (hasAnalysis ? '분석 수정' : '+ 분석 작성') + '</button>'
      : '';
    const tags = (e.tags || []).map(t => '<span class="doc-tag">' + escHtml(t) + '</span>').join('');

    return '<div class="analysis-card">' +
      '<div class="analysis-header">' +
        '<span class="category-badge" style="background:' + cat.color + '">' + cat.icon + ' ' + cat.name + '</span>' +
        '<span class="analysis-date">' + formatDate(e.date) + '</span>' +
      '</div>' +
      '<div class="analysis-title">' + escHtml(e.title) + '</div>' +
      '<div class="analysis-body">' + escHtml(e.body) + '</div>' +
      (tags ? '<div class="doc-tags" style="margin:8px 0;">' + tags + '</div>' : '') +
      '<div class="analysis-divider"></div>' +
      '<div class="analysis-label">' + (hasAnalysis ? '&#x1F4DD; 분석 내용' : '&#x1F4AD; 분석') + '</div>' +
      analysisHtml +
      editBtn +
    '</div>';
  }).join('');
}

function setAnalysisFilter(f) {
  analysisFilter = f;
  renderAnalysis();
}

// === Analysis Modal ===
let analysisTargetId = null;

function openAnalysisModal(id) {
  if (!isAdmin) { alert('관리자만 분석을 작성할 수 있습니다'); return; }
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  analysisTargetId = id;
  document.getElementById('analysisModalTitle').textContent = entry.title;
  document.getElementById('analysisModalBody').textContent = entry.body;
  document.getElementById('analysisText').value = entry.analysis || '';
  document.getElementById('analysisModal').classList.add('show');
}

function closeAnalysisModal() {
  document.getElementById('analysisModal').classList.remove('show');
}

async function saveAnalysis() {
  const text = document.getElementById('analysisText').value.trim();
  const entry = entries.find(e => e.id === analysisTargetId);
  if (!entry) return;
  entry.analysis = text;
  await saveData();
  closeAnalysisModal();
  renderAnalysis();
}
