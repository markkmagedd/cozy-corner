// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and AVIF allowed" },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop();
    const key = `${folder}/${uuidv4()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToR2(buffer, key, file.type);

    return NextResponse.json({
      success: true,
      url,          // Store in ProductImage.url
      key,          // Store in ProductImage.storagePath
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

// For deleting images
export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "No key provided" },
        { status: 400 }
      );
    }

    await deleteFromR2(key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}