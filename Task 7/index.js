const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const { getUser, getUserToken } = require('./githubService');
const config = require('./config');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

app.get('/auth/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&scope=read:user`;
  res.redirect(githubAuthUrl);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const token = await getUserToken(code);
    req.session.githubToken = token; 
    res.redirect('/');
  } catch (error) {
    console.error('Error during OAuth callback:', error.message);
    res.status(500).send('Authentication failed');
  }
});

app.get('/user/:username', async (req, res) => {
  const username = req.params.username;
  const token = req.session.githubToken;

  if (!token) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const userData = await getUser(username, token);
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'User not found or other error' });
  }
});

app.listen(config.port, () => {
  console.log(`GitHub User Finder is running on port ${config.port}`);
});
