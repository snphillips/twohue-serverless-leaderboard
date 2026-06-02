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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let player, score;
  try {
    const body = JSON.parse(event.body);
    player = body.player;
    score = body.score;
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  if (!player || score === undefined) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'player and score are required' }),
    };
  }

  try {
    const results = await pool.query(
      'INSERT INTO twohueleaderboard (player, score) VALUES ($1, $2) RETURNING id',
      [player, score]
    );
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ message: `Player added with ID: ${results.rows[0].id}` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};