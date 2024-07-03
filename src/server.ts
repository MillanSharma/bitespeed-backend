import process from 'node:process';
import cors from 'cors';
import express from 'express';
import './utils/env';
import routes from './routes/routes';

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cors());

// utility route
app.get('/status', (_req, res) => {
  res.json({
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use('/', routes)


app.listen(PORT, () => {
  console.info(`Server running at http://localhost:${PORT}`);
});
