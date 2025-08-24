const toggleBtn = document.getElementById('theme-toggle');
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
