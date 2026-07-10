import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ServiceRequest from "@/models/ServiceRequest";
import Notification from "@/models/Notification";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Helper to verify token and get user
async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded;
  } catch {
    return null;
  }
}

// GET - Get single service request
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const request = await ServiceRequest.findById(id)
      .populate("studentId", "name regNo email mobile course branch fatherName dob session semester year motherName admissionDate expectedCompletionYear")
      .populate("approvedBy", "name email");

    if (!request) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Students can only view their own requests
    if (auth.role === "student" && request.studentId._id.toString() !== auth.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ request }, { status: 200 });
  } catch (error: any) {
    console.error("Get Single Request Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update service request status (academics only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (auth.role !== "academics") {
      return NextResponse.json(
        { message: "Only academics staff can update service requests" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { action, rejectionReason } = await req.json();

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "Valid action (approve/reject) is required" },
        { status: 400 }
      );
    }

    if (action === "reject" && !rejectionReason) {
      return NextResponse.json(
        { message: "Rejection reason is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const request = await ServiceRequest.findById(id).populate(
      "studentId",
      "name regNo email mobile course branch fatherName dob session semester year motherName admissionDate expectedCompletionYear"
    );

    if (!request) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    if (request.status !== "Pending") {
      return NextResponse.json(
        { message: "This request has already been processed" },
        { status: 400 }
      );
    }

    const now = new Date();

    if (action === "approve") {
      // Update request status
      request.status = "Approved";
      request.approvedBy = auth.userId;
      request.approvedAt = now;
      
      // Note: PDF generation is handled on the client side
      // The documentUrl will be set if server-side PDF storage is implemented later
      
      await request.save();

      // Create notification for student
      await Notification.create({
        userId: request.studentId._id,
        title: "Request Approved",
        message: `Your ${request.serviceType} request has been approved. You can now download the document.`,
        type: "approval",
        relatedRequestId: request._id,
      });

      return NextResponse.json(
        { 
          message: "Request approved successfully", 
          request,
          studentData: request.studentId // Send student data for PDF generation
        },
        { status: 200 }
      );
    } else {
      // Reject action
      request.status = "Rejected";
      request.rejectionReason = rejectionReason;
      request.rejectedAt = now;
      await request.save();

      // Create notification for student
      await Notification.create({
        userId: request.studentId._id,
        title: "Request Rejected",
        message: `Your ${request.serviceType} request has been rejected. Reason: ${rejectionReason}`,
        type: "rejection",
        relatedRequestId: request._id,
      });

      return NextResponse.json(
        { message: "Request rejected successfully", request },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Update Service Request Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
