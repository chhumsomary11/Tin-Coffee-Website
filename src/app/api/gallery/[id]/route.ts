import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import GalleryPhoto from "@/models/GalleryPhoto";
import type { GalleryCategory } from "@/types/data";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateGalleryImageRequest {
  url?: string;
  caption?: string;
  category?: GalleryCategory;
  displayOrder?: number;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const image = await GalleryPhoto.findById(id).lean();

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "GALLERY_IMAGE_NOT_FOUND",
            message: "Gallery image was not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: image,
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
            message: "Invalid gallery image ID",
          },
        },
        { status: 400 },
      );
    }

    const body: UpdateGalleryImageRequest = await request.json();

    if (body.category !== undefined) {
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
    }

    const updatedImage = await GalleryPhoto.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedImage) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "GALLERY_IMAGE_NOT_FOUND",
            message: "Gallery image was not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedImage,
        message: "Gallery image updated successfully",
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
            message: "Invalid gallery image ID",
          },
        },
        { status: 400 },
      );
    }

    const image = await GalleryPhoto.findByIdAndDelete(id);

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "GALLERY_IMAGE_NOT_FOUND",
            message: "Gallery image was not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gallery image deleted successfully",
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