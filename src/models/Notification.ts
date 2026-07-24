import mongoose, { Schema, Document } from "mongoose";
import { NotificationChannel, NotificationType, NotificationRecipient } from "@/types/data";

export interface INotification extends Document {
  type: NotificationType;
  recipient: NotificationRecipient;
  channel: NotificationChannel;
  payload: Record<string, unknown>;
  sent: boolean;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: ["order_created", "booking_created", "status_changed"],
        message: "{VALUE} is not a valid notification type",
      },
    },
    recipient: {
      type: String,
      required: [true, "Recipient is required"],
      enum: {
        values: ["admin", "customer"],
        message: "{VALUE} is not a valid recipient",
      },
    },
    channel: {
      type: String,
      required: [true, "Channel is required"],
      enum: {
        values: ["telegram", "email"],
        message: "{VALUE} is not a valid channel",
      },
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    sent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

NotificationSchema.index({ type: 1, sent: 1 });
NotificationSchema.index({ recipient: 1, channel: 1, sent: 1 });
NotificationSchema.index({ createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;