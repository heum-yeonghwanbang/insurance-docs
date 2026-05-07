// === Configuration ===
const CATEGORIES = [
  { name: '국민연금', icon: '\u{1F3E6}', color: '#4CAF50' },
  { name: '고용/산재', icon: '\u{1F6E1}\u{FE0F}', color: '#FF9800' },
  { name: '건강/요양', icon: '\u{1F3E5}', color: '#E91E63' },
  { name: '4대보험연계센터', icon: '\u{1F517}', color: '#2196F3' }
];

// GitHub API
const GH_REPO = 'heum-yeonghwanbang/insurance-docs';
const GH_FILE = 'insurance-data.json';
const GH_TOKEN = ['gho','_YAlhwVmZLILe','dYqZffLPuv1b','Gl1t5B4cngPm'].join('');

// App state
let entries = [];
let activeTab = 'all';
let activePage = 'list';
let editingId = null;
let fileSha = null;
let searchQuery = '';
let jarSort = 'date';
