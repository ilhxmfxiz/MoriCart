import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import servicesRouter from './routes/services';
import cartRouter from './routes/cart';
import bookingsRouter from './routes/bookings';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRouter);
app.use('/services', servicesRouter);
app.use('/cart', cartRouter);
app.use('/bookings', bookingsRouter);

// health check
app.get('/', (req, res) => {
  res.json({ message: 'MenteCart API running ' });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(PORT, () => console.log(` Server on port ${PORT}`));
  })
  .catch((error) => console.error(' MongoDB error:', error));

export default app;