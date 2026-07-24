import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import type { MenuAddOn, MenuCategory } from "@/types/data";

const VALID_CATEGORIES: MenuCategory[] = [
  "COFFEE",
  "SIGNATURE",
  "BAKERY",
  "FOOD",
];

interface menuItemPayload {
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

//Function to get all the menu items
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    const filter: { category?: MenuCategory; available?: boolean } = {};

    //Condition 1
    if (category) {
      if (!VALID_CATEGORIES.includes(category as MenuCategory)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_CATEGORY",
              message: `${category} is not a valid menu category.`,
            },
          },
          { status: 400 },
        );
      }

      filter.category = category as MenuCategory;
    }

    //Condition 2
    if (available !== null) {
      if (available !== "true" && available !== "false") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_AVAILABLE_VALUE",
              message: "Available must be either true or false.",
            },
          },
          { status: 400 },
        );
      }

      filter.available = available === "true";
    }

    const menuItems = await MenuItem.find(filter)
      .sort({
        category: 1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: menuItems,
        count: menuItems.length,
        message: "MongoDB connected successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

// Function to create a new menu item
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the data sent by the frontend

    let body: menuItemPayload = await request.json();

    // Create the menu item in MongoDB
    const newMenuItem = await MenuItem.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newMenuItem,
        message: "Menu item created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create menu item",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
