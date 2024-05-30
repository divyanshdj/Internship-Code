require('dotenv').config();

const config = {
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  port: process.env.PORT || 3000
};

module.exports = config;
