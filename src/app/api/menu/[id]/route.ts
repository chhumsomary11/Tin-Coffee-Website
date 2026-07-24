import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { MenuCategory, MenuAddOn } from "@/types/data";
import MenuItem from "@/models/MenuItem";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface CreateMenuItemBody {
  itemId: string;
  name: string;
  category: MenuCategory;
  price: number;
  description?: string;
  available: boolean;
  imageUrl?: string;
  isNewMenuItem?: boolean;
  addOns?: MenuAddOn[];
  createdAt?: Date;
  updatedAt?: Date;
}

// GET /api/menu/:id - Get single menu item by itemId or ObjectId
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Try to find by itemId first (human-readable ID like "menu_001")
    let menuItem = await MenuItem.findOne({ itemId: id });

    // If not found and id is a valid ObjectId, try finding by _id
    if (!menuItem && mongoose.Types.ObjectId.isValid(id)) {
      menuItem = await MenuItem.findById(id);
    }

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: menuItem,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET menu item error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch menu item",
      },
      { status: 500 },
    );
  }
}

// PATCH /api/menu/:id
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Find by itemId first, then by ObjectId
    let menuItem = await MenuItem.findOne({ itemId: id });
    let queryId = id;

    if (!menuItem && mongoose.Types.ObjectId.isValid(id)) {
      menuItem = await MenuItem.findById(id);
      queryId = id; // Use ObjectId for update
    } else if (menuItem) {
      queryId = menuItem._id; // Use ObjectId for update
    }

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
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
        isNewMenuItem: body.isNewMenuItem,
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
          message: "Menu item not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Menu item updated successfully",
        data: updatedMenuItem,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH menu item error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update menu item",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/menu/:id
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Find by itemId first, then by ObjectId
    let menuItem = await MenuItem.findOne({ itemId: id });
    let queryId = id;

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
          message: "Menu item not found",
        },
        { status: 404 },
      );
    }

    const deletedMenuItem = await MenuItem.findByIdAndDelete(queryId);

    if (!deletedMenuItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 },
      );
    }

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
        message: "Failed to delete menu item",
      },
      { status: 500 },
    );
  }
}