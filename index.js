const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes.js');

const { seedDatabase } = require('./seed.js');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.get('/seed', async (req, res) => {
  try {
    await seedDatabase().catch((error) => {
      console.log('error');
      console.log(error);
    });
    res.send('Database seeded successfully!');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/', (req, res) => {
  res.send('Hello, Express with PostgreSQL and Prisma!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
