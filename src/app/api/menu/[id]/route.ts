import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    let menuItem = await MenuItem.findOne({ itemId: id });

    if (!menuItem && mongoose.Types.ObjectId.isValid(id)) {
      menuItem = await MenuItem.findById(id);
    }

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MENU_ITEM_NOT_FOUND",
            message: "Menu item was not found",
          },
        },
        { status: 404 },
      );
    }

    const item = menuItem.toObject();
    item.isNew = item.isNewMenuItem ?? false;

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET menu item error:", error);

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

    let menuItem = await MenuItem.findOne({ itemId: id });
    let queryId: mongoose.Types.ObjectId | string = id;

    if (!menuItem && mongoose.Types.ObjectId.isValid(id)) {
      menuItem = await MenuItem.findById(id);
      queryId = id;
    } else if (menuItem) {
      queryId = menuItem._id;
    }

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MENU_ITEM_NOT_FOUND",
            message: "Menu item was not found",
          },
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      queryId,
      {
        name: body.name,
        category: body.category,
        price: body.price,
        description: body.description,
        imageUrl: body.imageUrl,
        available: body.available,
        isNewMenuItem: body.isNew,
        addOns: body.addOns,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedMenuItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MENU_ITEM_NOT_FOUND",
            message: "Menu item was not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedMenuItem,
        message: "Menu item updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH menu item error:", error);

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

    let menuItem = await MenuItem.findOne({ itemId: id });
    let queryId: mongoose.Types.ObjectId | string = id;

    if (!menuItem && mongoose.Types.ObjectId.isValid(id)) {
      menuItem = await MenuItem.findById(id);
      queryId = id;
    } else if (menuItem) {
      queryId = menuItem._id;
    }

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MENU_ITEM_NOT_FOUND",
            message: "Menu item was not found",
          },
        },
        { status: 404 },
      );
    }

    await MenuItem.findByIdAndDelete(queryId);

    return NextResponse.json(
      {
        success: true,
        message: "Menu item deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE menu item error:", error);

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
