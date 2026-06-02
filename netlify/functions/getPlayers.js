const pool = require('../../db/pool');
const { getCorsHeaders, isAllowedOrigin } = require('./utils/cors');

exports.handler = async (event, context) => {
  const origin = event.headers.origin || '';
  const corsHeaders = getCorsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (!isAllowedOrigin(origin)) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Origin not allowed' }),
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const results = await pool.query('SELECT * FROM twohueleaderboard ORDER BY score DESC LIMIT 10');
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(results.rows),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};