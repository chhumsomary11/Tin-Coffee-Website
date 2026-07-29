import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import type { BookingStatus } from "@/types/data";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateBookingRequest {
  roomId?: string;
  customerName?: string;
  phone?: string;
  date?: string;
  time?: string;
  duration?: number;
  partySize?: number;
  note?: string;
  status?: BookingStatus;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const booking = await Booking.findById(id).lean();

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

    return NextResponse.json(
      {
        success: true,
        data: booking,
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid booking ID",
          },
        },
        { status: 400 },
      );
    }

    const body: UpdateBookingRequest = await request.json();

    if (body.roomId !== undefined || body.date !== undefined || body.time !== undefined) {
      const checkRoomId = body.roomId;
      const checkDate = body.date;
      const checkTime = body.time;

      const conflictFilter: { roomId: string; date: string; time: string; status: { $in: string[] }; _id: { $ne: string } } = {
        roomId: checkRoomId || (await Booking.findById(id)).roomId,
        date: checkDate || (await Booking.findById(id)).date,
        time: checkTime || (await Booking.findById(id)).time,
        status: { $in: ["pending", "confirmed"] },
        _id: { $ne: id },
      };

      const conflicting = await Booking.findOne(conflictFilter);

      if (conflicting) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "BOOKING_TIME_CONFLICT",
              message: "The selected room is already booked for this time",
            },
          },
          { status: 409 },
        );
      }
    }

    if (body.partySize !== undefined && body.roomId) {
      const room = await Room.findById(body.roomId);
      if (room && body.partySize > room.capacity) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PARTY_SIZE_EXCEEDS_CAPACITY",
              message: "Party size exceeds room capacity",
            },
          },
          { status: 400 },
        );
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedBooking) {
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

    return NextResponse.json(
      {
        success: true,
        data: updatedBooking,
        message: "Booking updated successfully",
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

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid booking ID",
          },
        },
        { status: 400 },
      );
    }

    const booking = await Booking.findByIdAndDelete(id);

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

    return NextResponse.json(
      {
        success: true,
        message: "Booking deleted successfully",
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