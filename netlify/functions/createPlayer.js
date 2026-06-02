const pool = require('../../db/pool');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
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
      'INSERT INTO twohueleaderboard (player, score) VALUES ($1, $2) RETURNING id',
      [player, score]
    );
    return {
      statusCode: 201,
      body: JSON.stringify({ message: `Player added with ID: ${results.rows[0].id}` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};