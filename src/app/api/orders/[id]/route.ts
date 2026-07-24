import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/orders/:id
 * Get one order (admin only)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid order ID",
          },
        },
        { status: 400 },
      );
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ORDER_NOT_FOUND",
            message: "Order not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
      },
      { status: 500 },
    );
  }
}