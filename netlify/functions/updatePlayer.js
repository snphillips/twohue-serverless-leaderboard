const pool = require('../../db/pool');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
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

  let player, score;
  try {
    const body = JSON.parse(event.body);
    player = body.player;
    score = body.score;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  if (!player || score === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'player and score are required' }),
    };
  }

  try {
    const results = await pool.query(
      'UPDATE twohueleaderboard SET player = $1, score = $2 WHERE id = $3',
      [player, score, id]
    );
    if (!results.rowCount) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Player with ID ${id} not found` }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Player modified with ID: ${id}` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};