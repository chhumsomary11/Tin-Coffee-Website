import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import type { OrderStatus } from "@/types/order";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Order ID is required",
          },
        },
        { status: 400 },
      );
    }

    const body: UpdateOrderStatusRequest = await request.json();

    const validStatuses: OrderStatus[] = [
      "pending",
      "preparing",
      "ready",
      "completed",
    ];

    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid order status",
          },
        },
        { status: 400 },
      );
    }

    const order = await Order.findById(id);

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

    order.status = body.status;
    await order.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: order._id,
          status: order.status,
        },
        message: "Order status updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH order status error:", error);

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