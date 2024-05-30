const axios = require('axios');
const config = require('./config');

async function getUserToken(code) {
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code: code
    }, {
      headers: {
        accept: 'application/json'
      }
    });

    return response.data.access_token;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

async function getUser(username, token) {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

function handleApiError(error) {
  if (error.response) {
    console.error('Error response from API:', error.response.data);
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Error setting up request:', error.message);
  }
}

module.exports = {
  getUser,
  getUserToken
};
