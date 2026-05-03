const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Global Axios defaults for Fotmob App emulation
const fotmobClient = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'FotMob/4.0.0 (com.fotmob.android; build:1; Android 13)',
    'Accept': 'application/json',
    'X-Fotmob-App-Id': 'com.fotmob.android',
  }
});

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
    const response = await fotmobClient.get(url);
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
    const response = await fotmobClient.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching match details:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed' });
  }
});

// Proxy for league tables/teams
app.get('/api/teams', async (req, res) => {
  const { leagueId } = req.query;
  const url = `https://www.fotmob.com/api/data/tltable?leagueId=${leagueId}`;
  console.log(`Fetching teams for league: ${leagueId}`);
  
  try {
    const response = await fotmobClient.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching league teams:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed' });
  }
});

// Proxy for team fixtures/details
app.get('/api/teamFixtures', async (req, res) => {
  const { id } = req.query;
  const url = `https://www.fotmob.com/api/data/teams?id=${id}`;
  console.log(`Fetching fixtures for team: ${id}`);
  
  try {
    const response = await fotmobClient.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching team fixtures:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
