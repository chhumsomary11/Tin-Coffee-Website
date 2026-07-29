import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import type { BookingStatus } from "@/types/data";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body: UpdateBookingStatusRequest = await request.json();

    const validStatuses: BookingStatus[] = ["pending", "confirmed", "rejected"];

    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid booking status",
          },
        },
        { status: 400 },
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BOOKING_NOT_FOUND",
            message: "Booking was not found",
          },
        },
        { status: 404 },
      );
    }

    booking.status = body.status;
    await booking.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: booking._id,
          status: booking.status,
        },
        message: "Booking status updated successfully",
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