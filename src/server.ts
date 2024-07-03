import process from 'node:process';
import cors from 'cors';
import express from 'express';
import './utils/env';

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cors());

// utility route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API!',
  });
});

// utility route
app.get('/status', (_req, res) => {
  res.json({
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});


app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}`);
});
