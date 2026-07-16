import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  image: string;
  capacityPerSlot: number;
  isActive: boolean;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  // how many people can book the same slot
  capacityPerSlot: { type: Number, required: true, default: 5 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
