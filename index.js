const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Health check
app.get('/', (req, res) => {
  res.send('Fotmob Proxy is running');
});

// Proxy for matches by date
app.get('/api/matches', async (req, res) => {
  const { date, timezone } = req.query;
  const url = `https://www.fotmob.com/api/data/matches?date=${date}&timezone=${timezone}&ccode3=IND&includeNextDayLateNight=false`;
  console.log(`Fetching matches: ${url}`);
  
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching matches:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed' });
  }
});

// Proxy for match details
app.get('/api/matchDetails', async (req, res) => {
  const { matchId } = req.query;
  const url = `https://www.fotmob.com/api/data/matchDetails?matchId=${matchId}`;
  console.log(`Fetching match details: ${url}`);
  
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching match details:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
