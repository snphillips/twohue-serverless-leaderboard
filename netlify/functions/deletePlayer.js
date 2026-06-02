const pool = require('../../db/pool');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
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
    const results = await pool.query('DELETE FROM twohueleaderboard WHERE id = $1', [id]);
    if (!results.rowCount) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Player with ID ${id} not found` }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Player deleted with ID: ${id}` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};