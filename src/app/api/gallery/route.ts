import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryPhoto from "@/models/GalleryPhoto";
import type { GalleryCategory } from "@/types/data";

interface CreateGalleryImageRequest {
  url: string;
  caption?: string;
  category: GalleryCategory;
  displayOrder?: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    const filter: { category?: GalleryCategory } = {};

    if (category) {
      const validCategories: GalleryCategory[] = ["interior", "exterior", "menu", "events"];
      if (!validCategories.includes(category as GalleryCategory)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: `${category} is not a valid gallery category`,
            },
          },
          { status: 400 },
        );
      }
      filter.category = category as GalleryCategory;
    }

    const images = await GalleryPhoto.find(filter).sort({ displayOrder: 1, createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: images,
        count: images.length,
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

    const body: CreateGalleryImageRequest = await request.json();

    if (!body.url || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "URL and category are required",
          },
        },
        { status: 400 },
      );
    }

    const validCategories: GalleryCategory[] = ["interior", "exterior", "menu", "events"];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: `${body.category} is not a valid gallery category`,
          },
        },
        { status: 400 },
      );
    }

    const newImage = await GalleryPhoto.create({
      url: body.url,
      caption: body.caption || "",
      category: body.category,
      displayOrder: body.displayOrder ?? 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: newImage,
        message: "Gallery image created successfully",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create gallery image",
        },
      },
      { status: 500 },
    );
  }
}