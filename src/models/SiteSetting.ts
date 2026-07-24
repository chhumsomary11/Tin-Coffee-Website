import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSetting extends Document {
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    key: {
      type: String,
      required: [true, "Setting key is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Key cannot exceed 100 characters"],
    },
    value: {
      type: String,
      required: [true, "Setting value is required"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);

SiteSettingSchema.index({ key: 1 }, { unique: true });

const SiteSetting =
  mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);

export default SiteSetting;