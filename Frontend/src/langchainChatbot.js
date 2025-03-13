// ...existing code...
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    prompt: 'Translate the following English text to French: "Hello, how are you?"',
    max_tokens: 60
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
// ...existing code...
