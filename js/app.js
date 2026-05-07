// === Page Navigation ===
function switchPage(page) {
  activePage = page;
  ['List', 'Jar', 'Stats'].forEach(p => {
    const key = p.toLowerCase();
    const el = document.getElementById('page' + p);
    const nav = document.getElementById('nav' + p);
    if (el) el.classList.toggle('active', page === key);
    if (nav) nav.classList.toggle('active', page === key);
  });
  if (page === 'jar') renderJar();
  if (page === 'stats') renderStats();
  if (page === 'list') loadData();
}

// === Lock Screen ===
function checkPw() {
  const pw = document.getElementById('lockPw').value;
  if (pw === '5221') {
    document.getElementById('lockScreen').style.display = 'none';
    sessionStorage.setItem('ins_unlocked', '1');
  } else {
    document.getElementById('lockErr').style.display = 'block';
    document.getElementById('lockPw').value = '';
    document.getElementById('lockPw').focus();
  }
}
if (sessionStorage.getItem('ins_unlocked') === '1') {
  document.getElementById('lockScreen').style.display = 'none';
}

// === Init ===
loadData();
