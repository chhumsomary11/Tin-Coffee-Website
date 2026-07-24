import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import type {
  OrderStatus,
  Temperature,
  SugarLevel,
  IceLevel,
} from "@/types/data";

interface CreateOrderAddOnRequest {
  addOnId: string;
}

interface CreateOrderItemRequest {
  itemId?: string;
  menuItemId?: string;
  quantity: number;
  temperature?: Temperature;
  sugarLevel?: SugarLevel;
  iceLevel?: IceLevel;
  addOns?: CreateOrderAddOnRequest[];
  note?: string;
}

interface CreateOrderRequest {
  customerName: string;
  phone: string;
  items: CreateOrderItemRequest[];
  pickupTime: string;
  specialNote?: string;
}

/**
 * GET /api/orders
 * Get all orders (admin only)
 * Query params: status, date, phone
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const phone = searchParams.get("phone");

    const filter: {
      status?: OrderStatus;
      phone?: string;
      createdAt?: { $gte: Date; $lt: Date };
    } = {};

    if (status) {
      const validStatuses: OrderStatus[] = [
        "pending",
        "preparing",
        "ready",
        "completed",
      ];
      if (!validStatuses.includes(status as OrderStatus)) {
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
      filter.status = status as OrderStatus;
    }

    if (phone) {
      filter.phone = phone;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: orders,
        count: orders.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/orders
 * Create a new order (public)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.customerName || !body.phone || !body.items || !body.pickupTime) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields",
          },
        },
        { status: 400 },
      );
    }

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

    // Validate and calculate total from database prices
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of body.items) {
      // Accept both itemId (new) and menuItemId (legacy) for backward compatibility
      const itemId = item.itemId || item.menuItemId;

      if (!itemId || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid item data: itemId/menuItemId and quantity are required",
            },
          },
          { status: 400 },
        );
      }

      // Fetch menu item from database to get current price
      // Query by itemId (human-readable like "menu_001") first, then fallback to ObjectId
      let menuItem = await MenuItem.findOne({ itemId });
      if (!menuItem && mongoose.Types.ObjectId.isValid(itemId)) {
        menuItem = await MenuItem.findById(itemId);
      }
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

      // Calculate base price
      let itemPrice = menuItem.price * item.quantity;

      // Process add-ons if any
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
        itemId: menuItem.itemId,
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

    // Create the order
    const newOrder = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      items: orderItems,
      pickupTime: body.pickupTime,
      totalAmount,
      status: "pending",
      specialNote: body.specialNote || "",
    });

    // Create notification for admin (order_created)
    const Notification = (await import("@/models/Notification")).default;
    await Notification.create({
      type: "order_created",
      recipient: "admin",
      channel: "telegram",
      payload: {
        orderId: newOrder._id.toString(),
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        totalAmount,
        itemCount: newOrder.items.length,
      },
      sent: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
        message: "Order created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST orders error:", error);
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
        message: "Failed to create order",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
