// server.js
require('dotenv').config(); // Load environment variables from .env

// Log the API key to verify it's loaded (for debugging purposes)
console.log("API Key:", process.env.OPENAI_API_KEY);

const express = require('express');
const axios = require('axios');
const app = express();

// Set the port to 3030 (or whichever you want to use)
const port = 3030;

app.use(express.json());

// Test route to verify the server is running
app.get('/', (req, res) => {
  res.send('Hello from Express on port 3030!');
});

// Endpoint to generate code/architecture using OpenAI's API
app.post('/api/generate', async (req, res) => {
  const { projectDescription, features, constraints } = req.body;
  
  // Construct a detailed prompt for the AI
  const aiPrompt = `You are a software architect. Based on the following requirements:
  
Project Description: ${projectDescription}
Desired Features: ${features}
Constraints: ${constraints}

Generate a detailed architectural design and code scaffold for this project.`;

  try {
    const aiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4", // Change this to "gpt-3.5-turbo" if needed
        messages: [
          { role: "user", content: aiPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const generatedOutput = aiResponse.data.choices[0].message.content;
    res.json({ output: generatedOutput });
  } catch (error) {
    console.error('Error generating output:', error.response ? JSON.stringify(error.response.data) : error.message);
    res.status(500).json({ error: 'Failed to generate output' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
