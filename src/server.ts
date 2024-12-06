import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import problemRoutes from './routes/problemRoutes';
import swaggerRoute from './routes/swaggerRoute';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
// Add Swagger route
app.use(swaggerRoute);
// Routes
app.use('/api/problems', problemRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || '';
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error: any) => console.error('Error connecting to MongoDB:', error));
}

// Export app for testing
export default app;
