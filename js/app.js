// === Page Navigation ===
function switchPage(page) {
  activePage = page;
  ['List', 'Gallery', 'Stats'].forEach(p => {
    const key = p.toLowerCase();
    const el = document.getElementById('page' + p);
    const nav = document.getElementById('nav' + p);
    if (el) el.classList.toggle('active', page === key);
    if (nav) nav.classList.toggle('active', page === key);
  });
  if (page === 'gallery') renderAnalysis();
  if (page === 'stats') renderStats();
  if (page === 'list') loadData();
}

// === Admin ===
function toggleAdmin() {
  if (isAdmin) {
    isAdmin = false;
    sessionStorage.removeItem('ins_admin');
    updateAdminUI();
    renderDocs();
    return;
  }
  const pw = prompt('관리자 비밀번호를 입력하세요');
  if (pw === ADMIN_PW) {
    isAdmin = true;
    sessionStorage.setItem('ins_admin', '1');
    updateAdminUI();
    renderDocs();
  } else if (pw !== null) {
    alert('비밀번호가 틀렸습니다');
  }
}

function updateAdminUI() {
  const btn = document.getElementById('adminBtn');
  if (isAdmin) {
    btn.innerHTML = '&#x1F513; ' + ADMIN_NAME;
    btn.style.background = 'rgba(255,255,255,0.35)';
  } else {
    btn.innerHTML = '&#x1F512; 관리자';
    btn.style.background = '';
  }
  // Show/hide write button
  var writeBtn = document.querySelector('.write-btn');
  if (writeBtn) writeBtn.style.display = isAdmin ? '' : 'none';
}

// === Init ===
loadData();
updateAdminUI();
