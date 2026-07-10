import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { photo } = await req.json();

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { photo },
      { new: true, lean: true, includeResultMetadata: true }
    );

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { photo: null },
      { new: true, lean: true, includeResultMetadata: true }
    );

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to remove photo" },
      { status: 500 }
    );
  }
}
