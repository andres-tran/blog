const toggleBtn = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const root = document.documentElement;

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
root.setAttribute('data-theme', savedTheme);
toggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';

prefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const newTheme = e.matches ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    toggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
  }
});

toggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  toggleBtn.textContent = next === 'light' ? '🌙' : '☀️';
});

async function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  searchResults.textContent = 'Searching...';
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error fetching results.');
    }
    const answer = data.answer?.trim();
    searchResults.textContent = answer || 'No results found.';
  } catch (err) {
    console.error(err);
    searchResults.textContent = err.message || 'Error fetching results.';
  }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch();
});
