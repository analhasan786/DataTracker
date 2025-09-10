import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import entryRoutes from './routes/entries.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, 
  credentials: true 
}));

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));
app.use('/api/auth', authRoutes);
app.use('/api/wallet', entryRoutes);


const start = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
};

start();
