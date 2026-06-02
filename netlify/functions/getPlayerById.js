const pool = require('../../db/pool');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const id = parseInt(event.queryStringParameters?.id, 10);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'id is required' }),
    };
  }

  try {
    const results = await pool.query('SELECT * FROM twohueleaderboard WHERE id = $1', [id]);
    if (!results.rows.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Player with ID ${id} not found` }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(results.rows[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};