const { Pool } = require('pg');
const pool = new Pool({
  user: 'kave0009',
  host: 'localhost',
  database: 'ecommerce',
  password: '@Rtin1382',
  port: 5432,
});

module.exports = pool;

