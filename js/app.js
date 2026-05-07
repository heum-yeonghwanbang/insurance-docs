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
  if (page === 'gallery') renderGallery();
  if (page === 'stats') renderStats();
  if (page === 'list') loadData();
}

// === Init ===
loadData();
