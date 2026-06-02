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

  const id = parseInt(event.queryStringParameters?.id, 10);

  if (!id) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'id is required' }),
    };
  }

  try {
    const results = await pool.query('SELECT * FROM twohueleaderboard WHERE id = $1', [id]);
    if (!results.rows.length) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: `Player with ID ${id} not found` }),
      };
    }
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(results.rows[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};