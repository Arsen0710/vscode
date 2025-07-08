const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // для HTTP-запросов

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Отправляем запрос к локальному DeepSeek API
    const response = await axios.post('http://localhost:5000/generate', {
      prompt: message,
    });

    const reply = response.data.text; // может быть по-другому в твоём API

    res.json({ reply });
  } catch (error) {
    console.error('Ошибка DeepSeek:', error.message);
    res.status(500).json({ error: 'Ошибка генерации ответа DeepSeek' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
