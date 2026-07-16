import mongoose, { Document, Schema } from 'mongoose';

// each item inside the cart


export interface ICart extends Document {
  owner: mongoose.Types.ObjectId;
  items: ICartItem[];
  expiresAt: Date;
}
export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  selectedDate: string;
  selectedTime: string;
  quantity: number;
  priceAtAdding: number;
}

const CartItemSchema = new Schema<ICartItem>({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  priceAtAdding: { type: Number, required: true },
});

const CartSchema = new Schema<ICart>({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  // cart expires after 15 minutes of inactivity
  expiresAt: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) },
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema);