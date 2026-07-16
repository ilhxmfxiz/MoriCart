import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service';

dotenv.config();

const sampleServices = [
  {
    title: 'Home Cleaning',
    description: 'Professional home cleaning service. We clean every corner of your home.',
    price: 2500,
    duration: 120,
    category: 'cleaning',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    capacityPerSlot: 3,
  },
  {
    title: 'Plumbing Repair',
    description: 'Fix leaks, pipes, and any plumbing issues at your home.',
    price: 1500,
    duration: 60,
    category: 'repairs',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
    capacityPerSlot: 2,
  },
  {
    title: 'Math Tutoring',
    description: 'One-on-one math tutoring for school and university students.',
    price: 1000,
    duration: 90,
    category: 'tutoring',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
    capacityPerSlot: 1,
  },
  {
    title: 'Beauty & Makeup',
    description: 'Professional makeup and beauty services for any occasion.',
    price: 3000,
    duration: 90,
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    capacityPerSlot: 2,
  },
  {
    title: 'Electrical Repair',
    description: 'Fixing electrical issues, wiring, and installations safely.',
    price: 2000,
    duration: 75,
    category: 'repairs',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    capacityPerSlot: 2,
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log(' Connected to MongoDB');

    // clear existing services first
    await Service.deleteMany({});
    console.log(' Cleared old services');

    await Service.insertMany(sampleServices);
    console.log(' Sample services added!');

    process.exit(0);
  } catch (err) {
    console.error(' Seeder error:', err);
    process.exit(1);
  }
};

seedServices();
