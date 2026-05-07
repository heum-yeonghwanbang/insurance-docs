// === Tabs ===
function renderTabs() {
  const tabsEl = document.getElementById('tabs');
  const allCount = entries.length;
  let html = '<div class="tab ' + (activeTab === 'all' ? 'active' : '') + '" onclick="switchTab(\'all\')"><span class="tab-icon">\u{1F4CB}</span>전체<div class="tab-count">' + allCount + '</div></div>';
  CATEGORIES.forEach((c, i) => {
    const count = entries.filter(e => e.category === i).length;
    const isActive = activeTab === String(i);
    const style = isActive ? 'border-bottom-color:' + c.color + ';color:' + c.color : '';
    html += '<div class="tab ' + (isActive ? 'active' : '') + '" style="' + style + '" onclick="switchTab(\'' + i + '\')"><span class="tab-icon">' + c.icon + '</span>' + c.name + '<div class="tab-count">' + count + '</div></div>';
  });
  tabsEl.innerHTML = html;
}

function switchTab(t) {
  activeTab = t;
  renderTabs();
  renderDocs();
}

// === Document List ===
function renderDocs() {
  const container = document.getElementById('docList');
  let filtered = activeTab === 'all' ? entries : entries.filter(e => e.category === parseInt(activeTab));

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(e =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.body || '').toLowerCase().includes(q) ||
      (e.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-msg">자료가 없습니다.<br>"+ 새 자료 작성"을 눌러 추가하세요.</div>';
    return;
  }

  const me = getMyNickname();
  container.innerHTML = filtered.map(e => {
    const cat = CATEGORIES[e.category] || CATEGORIES[0];
    const isMe = e.author === me;
    const actions = isMe
      ? '<div class="doc-actions"><button onclick="editDoc(\'' + e.id + '\')">수정</button><button class="del" onclick="deleteDoc(\'' + e.id + '\')">삭제</button></div>'
      : '';
    const tags = (e.tags || []).map(t => '<span class="doc-tag">' + escHtml(t) + '</span>').join('');
    const imgHtml = (e.image && e.image.url) ? '<img src="' + escHtml(e.image.url) + '" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:8px;">' : '';
    const fileHtml = e.file ? '<a href="' + escHtml(e.file.url) + '" target="_blank" download style="display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#1565C0;font-weight:600;text-decoration:none;margin-top:6px;">&#x1F4CE; ' + escHtml(e.file.name) + '</a>' : '';
    return '<div class="doc-card" style="border-left-color:' + cat.color + '">' + actions +
      '<div class="doc-author">' + escHtml(e.author || '익명') + '</div>' +
      '<span class="category-badge" style="background:' + cat.color + '">' + cat.icon + ' ' + cat.name + '</span>' +
      '<div class="doc-date">' + formatDate(e.date) + '</div>' +
      imgHtml +
      '<div class="doc-title">' + escHtml(e.title) + '</div>' +
      '<div class="doc-body">' + escHtml(e.body) + '</div>' +
      (tags ? '<div class="doc-tags">' + tags + '</div>' : '') +
      fileHtml +
      '</div>';
  }).join('');
}

function onSearch() {
  searchQuery = document.getElementById('searchInput').value.trim();
  renderDocs();
}

// === Write / Edit / Delete ===
function openWriteModal() {
  if (!getMyNickname()) { alert('닉네임을 먼저 설정해주세요'); return; }
  editingId = null;
  document.getElementById('modalTitle').textContent = '새 자료 작성';
  document.getElementById('docCat').innerHTML = CATEGORIES.map((c, i) =>
    '<option value="' + i + '">' + c.icon + ' ' + c.name + '</option>'
  ).join('');
  if (activeTab !== 'all') document.getElementById('docCat').value = activeTab;
  document.getElementById('docTitle').value = '';
  document.getElementById('docBody').value = '';
  document.getElementById('docTags').value = '';
  document.getElementById('writeModal').classList.add('show');
}

function closeWriteModal() {
  document.getElementById('writeModal').classList.remove('show');
}

async function saveDoc() {
  const title = document.getElementById('docTitle').value.trim();
  const body = document.getElementById('docBody').value.trim();
  if (!title) { alert('제목을 입력해주세요'); return; }

  const catIdx = parseInt(document.getElementById('docCat').value);
  const tagsStr = document.getElementById('docTags').value.trim();
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

  // Handle image upload
  let imageData = null;
  const imgInput = document.getElementById('docImage');
  if (imgInput && imgInput.files.length) {
    try {
      setSync('loading');
      imageData = await uploadFileToRepo(imgInput.files[0]);
    } catch(e) { alert('이미지 업로드 실패: ' + e.message); }
  }

  // Handle file upload
  let fileData = null;
  const fileInput = document.getElementById('docFile');
  if (fileInput && fileInput.files.length) {
    try {
      setSync('loading');
      fileData = await uploadFileToRepo(fileInput.files[0]);
    } catch(e) { alert('파일 업로드 실패: ' + e.message); }
  }

  if (editingId) {
    const entry = entries.find(e => e.id === editingId);
    if (entry) {
      entry.title = title;
      entry.body = body;
      entry.category = catIdx;
      entry.tags = tags;
      if (imageData) entry.image = imageData;
      if (fileData) entry.file = fileData;
    }
  } else {
    const newEntry = {
      id: genId(),
      author: getMyNickname(),
      category: catIdx,
      title: title,
      body: body,
      tags: tags,
      date: new Date().toISOString()
    };
    if (imageData) newEntry.image = imageData;
    if (fileData) newEntry.file = fileData;
    entries.push(newEntry);
  }

  await saveData();
  closeWriteModal();
  renderTabs();
  renderDocs();
  if (activePage === 'gallery') renderGallery();
}

function editDoc(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '자료 수정';
  document.getElementById('docCat').innerHTML = CATEGORIES.map((c, i) =>
    '<option value="' + i + '" ' + (i === entry.category ? 'selected' : '') + '>' + c.icon + ' ' + c.name + '</option>'
  ).join('');
  document.getElementById('docTitle').value = entry.title;
  document.getElementById('docBody').value = entry.body;
  document.getElementById('docTags').value = (entry.tags || []).join(', ');
  document.getElementById('writeModal').classList.add('show');
}

async function deleteDoc(id) {
  if (!confirm('이 자료를 삭제하시겠습니까?')) return;
  entries = entries.filter(e => e.id !== id);
  await saveData();
  renderTabs();
  renderDocs();
}
