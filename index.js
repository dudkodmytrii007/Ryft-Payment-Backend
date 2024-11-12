const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const { seedDatabase } = require('./seed.js');

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connection to PostgreSQL successful:', result.rows);
  });
});

app.get('/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.send('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
    res.status(500).send('Error seeding the database');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, Express with PostgreSQL!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
