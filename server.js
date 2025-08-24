const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching results' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
