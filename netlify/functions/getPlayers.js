const pool = require('../../db/pool');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const results = await pool.query('SELECT * FROM twohueleaderboard ORDER BY score DESC LIMIT 10');
    return {
      statusCode: 200,
      body: JSON.stringify(results.rows),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};