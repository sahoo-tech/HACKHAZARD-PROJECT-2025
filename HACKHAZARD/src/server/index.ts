import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { contentRoutes } from './routes/contentRoutes';
import { portfolioRoutes } from './routes/portfolioRoutes';
import { storeRoutes } from './routes/storeRoutes';
import { galleryRoutes } from './routes/galleryRoutes';
import { blogRoutes } from './routes/blogRoutes';
import { licenseRoutes } from './routes/licenseRoutes';
import { daoRoutes } from './routes/daoRoutes';
import { podcastRoutes } from './routes/podcastRoutes';
import { earningsRoutes } from './routes/earningsRoutes';
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackhazard')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/license', licenseRoutes);
app.use('/api/dao', daoRoutes);
app.use('/api/podcast', podcastRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});