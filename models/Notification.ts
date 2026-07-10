import mongoose, { Schema, model, models, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "approval" | "rejection" | "info";
  read: boolean;
  relatedRequestId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    type: {
      type: String,
      enum: ["approval", "rejection", "info"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedRequestId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
    },
  },
  { timestamps: true }
);

// Index for efficient notification queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = models.Notification || model<INotification>("Notification", NotificationSchema);

export default Notification;
