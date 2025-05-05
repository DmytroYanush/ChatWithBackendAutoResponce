process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const axios = require('axios');

async function getRandomQuote() {
  try {
    const res = await axios.get('https://api.quotable.io/random');
  return res.data.content;
  } catch (err) {
    console.error('Failed to fetch quote:', err.message);
    return "Sorry, no quote available.";
  }
}

module.exports = { getRandomQuote };
