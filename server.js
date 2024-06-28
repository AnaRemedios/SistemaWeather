const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000; 

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para buscar dados da previsão do tempo
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;  // Pega a latitude e longitude da query string
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,humidity_2m,windspeed_10m&current_weather=true`);
        if (response.status === 200) {
            const data = await response.json();
            res.json(data);  // Envia os dados da previsão do tempo como resposta
        } else {
            res.status(response.status).json({ error: `Erro ao buscar dados da previsão do tempo: ${response.status}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados da previsão do tempo.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
