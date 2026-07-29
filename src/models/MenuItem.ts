import mongoose, { Schema, Document, Model, Types } from "mongoose";

import { MenuCategory } from "@/types/menu";

const MENU_CATEGORIES: MenuCategory[] = [
  "COFFEE",
  "SIGNATURE",
  "BAKERY",
  "FOOD",
];

export interface IMenuAddOn {
  _id: Types.ObjectId;
  name: string;
  price: number;
  available: boolean;
}

export interface IMenuItem extends Document {
  _id: Types.ObjectId;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
  isNewMenuItem: boolean;
  addOns: IMenuAddOn[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuAddOnSchema = new Schema<IMenuAddOn>(
  {
    name: {
      type: String,
      required: [true, "Add-on name is required"],
      trim: true,
      maxlength: [100, "Add-on name cannot exceed 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Add-on price is required"],
      min: [0, "Add-on price cannot be negative"],
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
    // itemCode: {
    //   type: String,
    //   required: [true, "Item code is required"],
    //   unique: true,
    //   trim: true,
    //   uppercase: true,
    //   maxlength: [50, "Item code cannot exceed 50 characters"],
    // },

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
        values: MENU_CATEGORIES,
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
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
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

MenuItemSchema.index({
  category: 1,
  available: 1,
});

MenuItemSchema.index({
  isNewMenuItem: 1,
});

const MenuItem: Model<IMenuItem> =
  (mongoose.models.MenuItem as Model<IMenuItem>) ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;
