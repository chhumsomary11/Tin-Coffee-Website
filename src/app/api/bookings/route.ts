//Purpose: Backend Route Handler

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import type { BookingStatus } from "@/types/data";

interface CreateBookingRequest {
  roomId: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  partySize: number;
  note?: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const roomId = searchParams.get("roomId");
    const phone = searchParams.get("phone");

    const filter: {
      status?: BookingStatus;
      date?: string;
      roomId?: string;
      phone?: string;
    } = {};

    if (status) {
      const validStatuses: BookingStatus[] = [
        "pending",
        "confirmed",
        "rejected",
      ];
      if (!validStatuses.includes(status as BookingStatus)) {
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
      filter.status = status as BookingStatus;
    }

    if (date) {
      filter.date = date;
    }

    if (roomId) {
      filter.roomId = roomId;
    }

    if (phone) {
      filter.phone = phone;
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: bookings,
        count: bookings.length,
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: CreateBookingRequest = await request.json();

    if (
      !body.roomId ||
      !body.customerName ||
      !body.phone ||
      !body.date ||
      !body.time ||
      !body.duration ||
      !body.partySize
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Required fields missing",
          },
        },
        { status: 400 },
      );
    }

    const room = await Room.findById(body.roomId);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ROOM_NOT_FOUND",
            message: "Room was not found",
          },
        },
        { status: 404 },
      );
    }

    if (!room.available) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ROOM_UNAVAILABLE",
            message: "Room is not available",
          },
        },
        { status: 400 },
      );
    }

    if (body.partySize > room.capacity) {
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

    const conflictingBooking = await Booking.findOne({
      roomId: body.roomId,
      date: body.date,
      time: body.time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflictingBooking) {
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

    const newBooking = await Booking.create({
      roomId: body.roomId,
      customerName: body.customerName,
      phone: body.phone,
      date: body.date,
      time: body.time,
      duration: body.duration,
      partySize: body.partySize,
      note: body.note || "",
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        data: newBooking,
        message: "Booking created successfully",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create booking",
        },
      },
      { status: 500 },
    );
  }
}
