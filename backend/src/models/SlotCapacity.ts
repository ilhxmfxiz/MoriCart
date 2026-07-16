import mongoose, { Document, Schema } from 'mongoose';

// Tracks how many spots are taken for a specific service slot
// Helps prevent overbooking - nobody likes showing up to a packed house
export interface ISlotCapacity extends Document {
  service: mongoose.Types.ObjectId;    // Which service this slot belongs to
  date: string;                         // YYYY-MM-DD
  time: string;                        
  bookedCount: number;                  // How many people have booked so far
  maxCapacity: number;                  // Absolute limit - can't go over this
}

const SlotCapacitySchema = new Schema<ISlotCapacity>({
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  bookedCount: { 
    type: Number, 
    default: 0,                         // Fresh slot starts empty
    min: 0                              // Can't have negative bookings (obviously)
  },
  maxCapacity: { 
    type: Number, 
    required: true,
    min: 1                              // At least 1 spot, otherwise what's the point?
  },
});

// Make sure we don't accidentally create two capacity records for the same slot
// Each (service, date, time) combination should be unique
SlotCapacitySchema.index(
  { service: 1, date: 1, time: 1 }, 
  { unique: true }                      // Prevents duplicate slot entries
);

export default mongoose.model<ISlotCapacity>('SlotCapacity', SlotCapacitySchema);