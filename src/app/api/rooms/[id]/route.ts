import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import type { RoomType } from "@/types/data";
import Room from "@/models/Room";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateRoomRequest {
  name?: string;
  type?: RoomType;
  capacity?: number;
  price?: number;
  description?: string;
  imageUrl?: string;
  available?: boolean;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const room = await Room.findById(id).lean();

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

    return NextResponse.json(
      {
        success: true,
        data: room,
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
            message: "Invalid room ID",
          },
        },
        { status: 400 },
      );
    }

    const body: UpdateRoomRequest = await request.json();

    const updatedRoom = await Room.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedRoom) {
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

    return NextResponse.json(
      {
        success: true,
        data: updatedRoom,
        message: "Room updated successfully",
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
            message: "Invalid room ID",
          },
        },
        { status: 400 },
      );
    }

    const room = await Room.findByIdAndDelete(id);

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

    return NextResponse.json(
      {
        success: true,
        message: "Room deleted successfully",
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