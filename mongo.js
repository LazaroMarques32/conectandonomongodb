const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Conectar ao MongoDB
const uri = "mongodb+srv://lazarodourado2007:lazarodourado2008@cluster0.zftyrs9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB Atlas!'))
    .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Middleware para ler JSON
app.use(express.json());

// Definir o modelo do histórico do chatbot
const chatHistorySchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  botResponse: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// Endpoint para salvar o histórico de bate-papo
app.post('/api/save-chat', async (req, res) => {
  const { userMessage, botResponse } = req.body;

  if (!userMessage || !botResponse) {
      return res.status(400).json({ error: 'As mensagens do usuário e do bot são obrigatórias' });
  }

  try {
      const newChat = new ChatHistory({ userMessage, botResponse });
      await newChat.save();
      res.status(201).json(newChat);
  } catch (err) {
      res.status(500).json({ error: 'Erro ao salvar o histórico de bate-papo' });
  }
});

async function saveChatHistory(userMessage, botResponse) {
  try {
      const response = await fetch('http://localhost:3000/api/save-chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userMessage, botResponse }),
      });

      if (!response.ok) {
          throw new Error('Erro ao salvar o histórico de bate-papo');
      }

      const data = await response.json();
      console.log('Histórico salvo com sucesso:', data);
  } catch (error) {
      console.error(error.message);
  }
}
