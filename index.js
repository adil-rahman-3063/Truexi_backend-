const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
app.use(cors());

// Global browser instance
let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: "new"
    });
  }
  return browser;
}

async function fetchWithPuppeteer(url) {
  const b = await getBrowser();
  const page = await b.newPage();
  
  try {
    // Randomize user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Get the JSON content from the pre tag (Chrome often wraps JSON in <pre>)
    const content = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    return JSON.parse(content);
  } finally {
    await page.close();
  }
}

// Health check
app.get('/', (req, res) => res.send('Fotmob Puppeteer Proxy is running'));

app.get('/api/matches', async (req, res) => {
  const { date, timezone } = req.query;
  const url = `https://www.fotmob.com/api/data/matches?date=${date}&timezone=${timezone}&ccode3=IND&includeNextDayLateNight=false`;
  try {
    const data = await fetchWithPuppeteer(url);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/matchDetails', async (req, res) => {
  const { matchId } = req.query;
  const url = `https://www.fotmob.com/api/data/matchDetails?matchId=${matchId}`;
  try {
    const data = await fetchWithPuppeteer(url);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/teams', async (req, res) => {
  const { leagueId } = req.query;
  const url = `https://www.fotmob.com/api/data/tltable?leagueId=${leagueId}`;
  try {
    const data = await fetchWithPuppeteer(url);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/teamFixtures', async (req, res) => {
  const { id } = req.query;
  const url = `https://www.fotmob.com/api/data/teams?id=${id}`;
  try {
    const data = await fetchWithPuppeteer(url);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
