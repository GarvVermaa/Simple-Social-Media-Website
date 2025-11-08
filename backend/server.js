import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js'


dotenv.config();
const app = express();



//MiddleWares

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:8000'],
  credentials: true
}));
app.use(express.json());


//Routes

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'LinkedIn API is RUnning' });
});

//Connecting to MOngoDB

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected To MONGODB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });

}).catch((err) => {
  console.error('MongoDB not connected: ', err);

});