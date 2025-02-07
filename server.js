// server.js (or a new file like ai-generator.js if you want to keep it modular)
const express = require('express');
const axios = require('axios'); // Ensure axios is installed
const app = express();
const port = 3030; // Or your preferred port for the backend

app.use(express.json());

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Hello from the Express server!');
});

// Endpoint to generate code/architecture using AI
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body; // Get the high-level requirement prompt
  try {
    // Call the AI API (example with OpenAI's API)
    // Adjust the URL, model, and headers based on your provider's current documentation.
    const aiResponse = await axios.post(
      'https://api.openai.com/v1/engines/code-davinci-002/completions',
      {
        prompt: `Generate code and architectural design for: ${prompt}`,
        max_tokens: 500,      // Adjust based on desired output length
        temperature: 0.7,     // Control creativity (0.0 to 1.0)
      },
      {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,  // Replace with your actual API key
          'Content-Type': 'application/json'
        }
      }
    );
    // Extract the generated output
    const generatedOutput = aiResponse.data.choices[0].text;
    res.json({ output: generatedOutput });
  } catch (error) {
    console.error('Error generating output:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'Failed to generate output' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
