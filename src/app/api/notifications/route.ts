import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import type { NotificationType, NotificationChannel, NotificationRecipient } from "@/types/data";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const channel = searchParams.get("channel");
    const recipient = searchParams.get("recipient");
    const sent = searchParams.get("sent");

    const filter: {
      type?: NotificationType;
      channel?: NotificationChannel;
      recipient?: NotificationRecipient;
      sent?: boolean;
    } = {};

    if (type) {
      const validTypes: NotificationType[] = ["order_created", "booking_created", "status_changed"];
      if (!validTypes.includes(type as NotificationType)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: `${type} is not a valid notification type`,
            },
          },
          { status: 400 },
        );
      }
      filter.type = type as NotificationType;
    }

    if (channel) {
      const validChannels: NotificationChannel[] = ["telegram", "email"];
      if (!validChannels.includes(channel as NotificationChannel)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: `${channel} is not a valid notification channel`,
            },
          },
          { status: 400 },
        );
      }
      filter.channel = channel as NotificationChannel;
    }

    if (recipient) {
      const validRecipients: NotificationRecipient[] = ["admin", "customer"];
      if (!validRecipients.includes(recipient as NotificationRecipient)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: `${recipient} is not a valid notification recipient`,
            },
          },
          { status: 400 },
        );
      }
      filter.recipient = recipient as NotificationRecipient;
    }

    if (sent !== null) {
      if (sent !== "true" && sent !== "false") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Sent must be either true or false",
            },
          },
          { status: 400 },
        );
      }
      filter.sent = sent === "true";
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: notifications,
        count: notifications.length,
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