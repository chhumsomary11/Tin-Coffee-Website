import mongoose, { Schema, Document } from "mongoose";
import { RoomType } from "@/types/data";

export interface IRoom extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: RoomType;
  capacity: number;
  price: number;
  description?: string;
  imageUrl?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Room type is required"],
      enum: {
        values: ["SMALL", "CONFERENCE"],
        message: "{VALUE} is not a valid room type",
      },
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

RoomSchema.index({ type: 1, available: 1 });

const Room = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
