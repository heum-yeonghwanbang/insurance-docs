// === Statistics ===
function renderStats() {
  const container = document.getElementById('statsContent');
  const total = entries.length;
  const catCounts = CATEGORIES.map((_, i) => entries.filter(e => e.category === i).length);
  const maxCount = Math.max(...catCounts, 1);

  // Recent activity
  const now = new Date();
  const thisMonth = entries.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  // Most used tags
  const tagMap = {};
  entries.forEach(e => (e.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; }));
  const topTags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Per-author counts
  const authorMap = {};
  entries.forEach(e => { const a = e.author || '익명'; authorMap[a] = (authorMap[a] || 0) + 1; });

  container.innerHTML =
    '<div class="stats-card"><div class="stats-total"><div class="big-num">' + total + '</div><div class="big-label">총 자료 수</div></div></div>' +

    '<div class="stats-card"><div class="stats-total"><div class="big-num" style="font-size:36px;">' + thisMonth + '</div><div class="big-label">이번 달 작성</div></div></div>' +

    '<div class="stats-card"><h3>카테고리별 자료</h3>' +
    CATEGORIES.map((c, i) =>
      '<div class="stats-row"><span class="sr-icon">' + c.icon + '</span><span class="sr-name">' + c.name + '</span><span class="sr-count">' + catCounts[i] + '건</span>' +
      '<div class="sr-bar-wrap"><div class="sr-bar" style="width:' + (catCounts[i] / maxCount * 100) + '%;background:' + c.color + ';"></div></div></div>'
    ).join('') + '</div>' +

    '<div class="stats-card"><h3>작성자별</h3>' +
    Object.entries(authorMap).map(([name, count]) =>
      '<div class="stats-row"><span class="sr-icon">\u{1F464}</span><span class="sr-name">' + escHtml(name) + '</span><span class="sr-count">' + count + '건</span></div>'
    ).join('') + '</div>' +

    (topTags.length > 0 ?
      '<div class="stats-card"><h3>자주 쓰는 태그</h3>' +
      topTags.map(([tag, count]) =>
        '<div class="stats-row"><span class="sr-icon">\u{1F3F7}\u{FE0F}</span><span class="sr-name">' + escHtml(tag) + '</span><span class="sr-count">' + count + '회</span></div>'
      ).join('') + '</div>' : '');
}
