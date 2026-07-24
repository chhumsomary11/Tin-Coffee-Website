// Run on the server side to connect to MongoDB and handle GET requests for testing the connection.

import mongoose, { Schema, Document, Types } from "mongoose";
import { MenuCategory, MenuAddOn } from "@/types/data";

export interface IMenuItem extends Document {
  _id: Types.ObjectId;
  itemId: string; // Human-readable ID like "menu_001"
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl?: string;
  available: boolean;
  isNewMenuItem: boolean;
  addOns?: IMenuAddOn[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMenuAddOn extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  available: boolean;
}

const MenuAddOnSchema = new Schema<IMenuAddOn>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: false,
  },
);

const MenuItemSchema = new Schema<IMenuItem>(
  {
    itemId: {
      type: String,
      required: [true, "Item ID is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Item ID cannot exceed 50 characters"],
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["COFFEE", "SIGNATURE", "BAKERY", "FOOD"],
        message: "{VALUE} is not a valid category",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
    isNewMenuItem: {
      type: Boolean,
      default: false,
    },
    addOns: {
      type: [MenuAddOnSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

MenuItemSchema.index({ category: 1, available: 1 });
MenuItemSchema.index({ isNewMenuItem: 1 });
MenuItemSchema.index({ itemId: 1 }, { unique: true });

// Check if the model already exists to avoid OverwriteModelError,
// (mongoose.modesl.MenuItem) if the model exist, it uses the existing model,
// (.mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);) otherwise it creates a new one.
const MenuItem =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;
