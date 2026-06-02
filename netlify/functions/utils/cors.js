const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://twohue.netlify.app',
  'https://twohue.surge.sh/'
];

const getCorsHeaders = (origin) => {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : null;

  return {
    'Access-Control-Allow-Origin': allowedOrigin || '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
};

const isAllowedOrigin = (origin) => ALLOWED_ORIGINS.includes(origin);

module.exports = { getCorsHeaders, isAllowedOrigin };