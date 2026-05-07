// === GitHub API Storage ===
async function loadData() {
  if (!getMyNickname()) {
    document.getElementById('nicknameSetup').style.display = 'block';
    return;
  }
  document.getElementById('nicknameSetup').style.display = 'none';
  setSync('loading');
  try {
    const res = await fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + GH_FILE, {
      headers: { 'Authorization': 'token ' + GH_TOKEN, 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-store'
    });
    if (res.status === 404) {
      // First time: create the file
      entries = [];
      fileSha = null;
      await saveData();
      setSync('online');
    } else if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    } else {
      const file = await res.json();
      fileSha = file.sha;
      const data = JSON.parse(base64ToUtf8(file.content));
      entries = data.entries || [];
      setSync('online');
    }
  } catch(e) {
    setSync('error', e.message);
    entries = [];
  }
  renderTabs();
  renderDocs();
  if (activePage === 'jar') renderJar();
  if (activePage === 'stats') renderStats();
}

async function saveData() {
  setSync('loading');
  try {
    const payload = JSON.stringify({
      entries: entries,
      updated_at: new Date().toISOString()
    }, null, 2);
    const body = { message: 'Update insurance docs', content: utf8ToBase64(payload) };
    if (fileSha) body.sha = fileSha;
    const res = await fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + GH_FILE, {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + GH_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const result = await res.json();
    fileSha = result.content.sha;
    setSync('online');
  } catch(e) {
    setSync('error', e.message);
    alert('저장 실패: ' + e.message);
  }
}
