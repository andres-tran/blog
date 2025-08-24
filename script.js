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

const apiKey =
  (typeof process !== 'undefined' && process.env.OPENAI_API_KEY) ||
  (typeof window !== 'undefined' && window.OPENAI_API_KEY) ||
  '';

async function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  if (!apiKey) {
    searchResults.textContent = 'API key not configured.';
    return;
  }
  searchResults.textContent = 'Searching...';
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You help users search a playful blog with concise answers.' },
          { role: 'user', content: query },
        ],
      }),
    });
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();
    searchResults.textContent = answer || 'No results found.';
  } catch (err) {
    console.error(err);
    searchResults.textContent = 'Error fetching results.';
  }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch();
});
