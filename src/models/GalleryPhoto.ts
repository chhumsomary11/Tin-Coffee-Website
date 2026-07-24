import mongoose, { Schema, Document } from "mongoose";
import { GalleryCategory } from "@/types/data";

export interface IGalleryPhoto extends Document {
  url: string;
  caption?: string;
  category: GalleryCategory;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryPhotoSchema = new Schema<IGalleryPhoto>(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    caption: {
      type: String,
      default: "",
      maxlength: [200, "Caption cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["interior", "exterior", "menu", "events"],
        message: "{VALUE} is not a valid gallery category",
      },
    },
    displayOrder: {
      type: Number,
      required: [true, "Display order is required"],
      min: [0, "Display order must be >= 0"],
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

GalleryPhotoSchema.index({ category: 1, displayOrder: 1 });
GalleryPhotoSchema.index({ displayOrder: 1 });

const GalleryPhoto =
  mongoose.models.GalleryPhoto ||
  mongoose.model<IGalleryPhoto>("GalleryPhoto", GalleryPhotoSchema);

export default GalleryPhoto;