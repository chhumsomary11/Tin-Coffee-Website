import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus, Temperature, SugarLevel, IceLevel } from "../types/order";

// OrderItem is embedded inside Order
// It does NOT get its own collection
// because you always read items together
// with their parent order — never separately
interface IOrderItemAddOn {
  addOnId: string;
  name?: string;
  price?: number;
}

interface IOrderItem {
  itemId: string;
  name: string; // snapshot at time of order
  price: number; // snapshot at time of order
  quantity: number;
  temperature: Temperature;
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
  addOns: IOrderItemAddOn[];
  note: string;
}

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  items: IOrderItem[];
  pickupTime: string;
  totalAmount: number;
  status: OrderStatus;
  specialNote: string;
  createdAt: Date;
}

// Embedded schema for one item inside an order
const OrderItemAddOnSchema = new Schema<IOrderItemAddOn>(
  {
    addOnId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    temperature: {
      type: String,
      enum: ["hot", "iced"],
      default: "hot",
    },
    sugarLevel: {
      type: String,
      enum: ["none", "less", "regular", "extra"],
      default: "regular",
    },
    iceLevel: {
      type: String,
      enum: ["less", "regular", "extra"],
      default: "regular",
    },
    addOns: {
      type: [OrderItemAddOnSchema],
      default: [],
    },
    note: { type: String, default: "" },
  },
  { _id: false }, // embedded docs don't need their own _id
);

const OrderSchema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    pickupTime: {
      type: String,
      required: [true, "Pickup time is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed"],
      default: "pending",
    },
    specialNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Index for fast admin queries
// Most common: filter by status, sort by newest
OrderSchema.index({ status: 1, createdAt: -1 });

const orderItems =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default orderItems;
