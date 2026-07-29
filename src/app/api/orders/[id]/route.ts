import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import type { OrderStatus } from "@/types/order";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateOrderItemRequest {
  itemId?: string;
  menuItemId?: string;
  quantity: number;
  temperature?: string;
  sugarLevel?: string;
  iceLevel?: string;
  addOns?: { addOnId: string }[];
  note?: string;
}

interface UpdateOrderRequest {
  customerName?: string;
  phone?: string;
  items?: UpdateOrderItemRequest[];
  pickupTime?: string;
  totalAmount?: number;
  status?: OrderStatus;
  specialNote?: string;
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

/**
 * PATCH /api/orders/:id
 * Update an order (admin only)
 */
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
            message: "Invalid order ID",
          },
        },
        { status: 400 },
      );
    }

    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
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

    const body: UpdateOrderRequest = await request.json();

    const update: Record<string, unknown> = {};

    if (body.customerName !== undefined) {
      update.customerName = body.customerName;
    }

    if (body.phone !== undefined) {
      update.phone = body.phone;
    }

    if (body.pickupTime !== undefined) {
      update.pickupTime = body.pickupTime;
    }

    if (body.specialNote !== undefined) {
      update.specialNote = body.specialNote;
    }

    if (body.status !== undefined) {
      const validStatuses: OrderStatus[] = [
        "pending",
        "preparing",
        "ready",
        "completed",
      ];
      if (!validStatuses.includes(body.status)) {
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
      update.status = body.status;
    }

    if (body.items !== undefined) {
      if (!Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Order must have at least one item",
            },
          },
          { status: 400 },
        );
      }

      let totalAmount = 0;
      const orderItems: any[] = [];

      for (const item of body.items) {
        const itemId = item.itemId || item.menuItemId;

        if (!itemId || !item.quantity || item.quantity < 1) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message:
                  "Invalid item data: itemId/menuItemId and quantity are required",
              },
            },
            { status: 400 },
          );
        }

        const menuItem = await MenuItem.findById(itemId);
        if (!menuItem) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "MENU_ITEM_NOT_FOUND",
                message: `Menu item with ID ${itemId} not found`,
              },
            },
            { status: 404 },
          );
        }

        if (!menuItem.available) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "MENU_ITEM_UNAVAILABLE",
                message: `Menu item ${menuItem.name} is not available`,
              },
            },
            { status: 400 },
          );
        }

        let itemPrice = menuItem.price * item.quantity;
        const processedAddOns: any[] = [];

        if (item.addOns && item.addOns.length > 0) {
          for (const addOnReq of item.addOns) {
            const addOn = menuItem.addOns?.find(
              (a: { _id: { toString: () => string } }) =>
                a._id.toString() === addOnReq.addOnId,
            );
            if (!addOn) {
              return NextResponse.json(
                {
                  success: false,
                  error: {
                    code: "ADD_ON_NOT_FOUND",
                    message: `Add-on ${addOnReq.addOnId} not found for this item`,
                  },
                },
                { status: 404 },
              );
            }
            if (!addOn.available) {
              return NextResponse.json(
                {
                  success: false,
                  error: {
                    code: "ADD_ON_UNAVAILABLE",
                    message: `Add-on ${addOn.name} is not available`,
                  },
                },
                { status: 400 },
              );
            }
            itemPrice += addOn.price * item.quantity;
            processedAddOns.push({
              addOnId: addOn._id.toString(),
              name: addOn.name,
              price: addOn.price,
            });
          }
        }

        totalAmount += itemPrice;

        orderItems.push({
          itemId: menuItem._id.toString(),
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          temperature: item.temperature || "hot",
          sugarLevel: item.sugarLevel || "regular",
          iceLevel: item.iceLevel || "regular",
          addOns: processedAddOns,
          note: item.note || "",
        });
      }

      update.items = orderItems;
      update.totalAmount = totalAmount;
    } else if (body.totalAmount !== undefined) {
      update.totalAmount = body.totalAmount;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json(
      {
        success: true,
        data: updatedOrder,
        message: "Order updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH order error:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: error.message,
          },
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/orders/:id
 * Delete an order (admin only)
 */
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
            message: "Invalid order ID",
          },
        },
        { status: 400 },
      );
    }

    const order = await Order.findByIdAndDelete(id);

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
        message: "Order deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete order",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
