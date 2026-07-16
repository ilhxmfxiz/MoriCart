import mongoose, { Document, Schema } from 'mongoose';

// Possible states a booking can be in - keeps things predictable
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed';

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;      // Who made the booking
  service: mongoose.Types.ObjectId;       // Which service they booked
  selectedDate: string;                   // YYYY-MM-DD format hopefully
  selectedTime: string;                   // Like "14:30"
  quantity: number;                       // How many units/seats/etc
  totalPrice: number;                     // quantity * service price
  status: BookingStatus;                  // Where we're at in the workflow
  paymentMethod: 'cash' | 'pay_on_arrival' | 'online';
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  cancelledAt?: Date;                     // When they (or we) pulled the plug
  statusHistory: {                        // Keep track of all status changes
    status: BookingStatus;
    changedAt: Date;
    reason?: string;                      // Optional - why did it change?
  }[];
}

const BookingSchema = new Schema<IBooking>({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  selectedDate: { 
    type: String, 
    required: true 
  },
  selectedTime: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    choices: ['pending', 'confirmed', 'completed', 'cancelled', 'failed'],
    default: 'pending'                     // New bookings start here
  },
  paymentMethod: {
    type: String,
    options: ['cash', 'pay_on_arrival', 'online'],
    default: 'cash'                        // Cash is king for now
  },
  paymentStatus: {
    type: String,
    validTypes: ['unpaid', 'paid', 'failed'],
    default: 'unpaid'                      // Gotta get that money
  },
  cancelledAt: { 
    type: Date 
  },
  // audit log - every status change recorded here
  statusHistory: [
    {
      status: { 
        type: String, 
        required: true 
      },
      changedAt: { 
        type: Date, 
        default: Date.now 
      },
      reason: { 
        type: String 
      },
    }
  ]
}, { 
  timestamps: true                         // Gives us createdAt and updatedAt automatically
});

export default mongoose.model<IBooking>('Booking', BookingSchema);