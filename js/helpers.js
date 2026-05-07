// === Utility Functions ===
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.getFullYear() + '.' +
    String(d.getMonth()+1).padStart(2,'0') + '.' +
    String(d.getDate()).padStart(2,'0') + ' ' +
    String(d.getHours()).padStart(2,'0') + ':' +
    String(d.getMinutes()).padStart(2,'0');
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(b64) {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))));
}

function setSync(state, msg) {
  const dot = document.getElementById('syncDot');
  const text = document.getElementById('syncText');
  if (state === 'online') { dot.style.background = '#4CAF50'; text.textContent = '연결됨'; }
  else if (state === 'loading') { dot.style.background = '#FF9800'; text.textContent = '동기화 중...'; }
  else { dot.style.background = '#F44336'; text.textContent = '오류: ' + (msg || ''); }
}

function getMyNickname() {
  return localStorage.getItem('ins_nickname') || '';
}

function saveNickname() {
  const name = document.getElementById('nicknameInput').value.trim();
  if (!name) return;
  localStorage.setItem('ins_nickname', name);
  document.getElementById('nicknameSetup').style.display = 'none';
  loadData();
}
