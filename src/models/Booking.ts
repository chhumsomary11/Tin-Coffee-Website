import mongoose, { Schema, Document } from "mongoose";
import { BookingStatus } from "@/types/data";

export interface IBooking extends Document {
  roomId: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  partySize: number;
  note?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room ID is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Booking date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    time: {
      type: String,
      required: [true, "Booking time is required"],
      match: [/^\d{2}:\d{2}$/, "Time must be in HH:MM format"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 hour"],
    },
    partySize: {
      type: Number,
      required: [true, "Party size is required"],
      min: [1, "Party size must be at least 1"],
    },
    note: {
      type: String,
      default: "",
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "confirmed", "rejected"],
        message: "{VALUE} is not a valid booking status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for checking booking conflicts
BookingSchema.index({ roomId: 1, date: 1, time: 1, status: 1 });
// Admin query indexes
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ date: 1, status: 1 });
BookingSchema.index({ roomId: 1, date: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;