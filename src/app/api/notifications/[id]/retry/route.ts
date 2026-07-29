import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid notification ID",
          },
        },
        { status: 400 },
      );
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOTIFICATION_NOT_FOUND",
            message: "Notification was not found",
          },
        },
        { status: 404 },
      );
    }

    notification.sent = true;
    notification.sentAt = new Date();
    await notification.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: notification._id,
          sent: notification.sent,
          sentAt: notification.sentAt,
        },
        message: "Notification sent successfully",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        },
      },
      { status: 500 },
    );
  }
}