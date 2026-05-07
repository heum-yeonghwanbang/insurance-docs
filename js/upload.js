// === File Upload via GitHub API ===
async function uploadFileToRepo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const base64 = reader.result.split(',')[1];
        const ext = file.name.split('.').pop();
        const fileName = 'uploads/' + genId() + '.' + ext;
        const res = await fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + fileName, {
          method: 'PUT',
          headers: { 'Authorization': 'token ' + GH_TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Upload ' + file.name, content: base64 })
        });
        if (!res.ok) throw new Error('Upload failed: HTTP ' + res.status);
        const pageUrl = 'https://heum-yeonghwanbang.github.io/insurance-docs/' + fileName;
        resolve({ url: pageUrl, name: file.name, size: file.size, type: file.type });
      } catch(e) { reject(e); }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isImageType(type) {
  return type && type.startsWith('image/');
}

async function handleImageUpload() {
  const input = document.getElementById('docImage');
  const preview = document.getElementById('imagePreview');
  if (!input.files.length) { preview.innerHTML = ''; return; }

  const file = input.files[0];
  if (file.size > 5 * 1024 * 1024) {
    alert('이미지는 5MB 이하만 가능합니다');
    input.value = '';
    preview.innerHTML = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function() {
    preview.innerHTML = '<img src="' + reader.result + '" style="max-width:100%;max-height:200px;border-radius:8px;margin-top:8px;">';
  };
  reader.readAsDataURL(file);
}

async function handleFileUpload() {
  const input = document.getElementById('docFile');
  const info = document.getElementById('fileInfo');
  if (!input.files.length) { info.textContent = ''; return; }

  const file = input.files[0];
  if (file.size > 10 * 1024 * 1024) {
    alert('파일은 10MB 이하만 가능합니다');
    input.value = '';
    info.textContent = '';
    return;
  }

  const sizeStr = file.size < 1024 ? file.size + 'B'
    : file.size < 1024*1024 ? (file.size/1024).toFixed(1) + 'KB'
    : (file.size/1024/1024).toFixed(1) + 'MB';
  info.textContent = file.name + ' (' + sizeStr + ')';
}
