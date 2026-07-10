import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, mobile, dob, fatherName, role, regNo, rollNo, password, course, branch, semester, session } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    if (role === 'student' && (!course || !branch || !semester || !session)) {
        return NextResponse.json(
          { message: "Missing required student fields (Course, Branch, Semester, Academic Year)" },
          { status: 400 }
        );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Check regNo if student
    if(role === 'student' && regNo){
        const existingReg = await User.findOne({ regNo });
        if(existingReg){
            return NextResponse.json(
                { message: "User with this Registration Number already exists" },
                { status: 400 }
            );
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      mobile,
      dob: new Date(dob),
      fatherName,
      role,
      regNo,
      rollNo,
      // Additional student fields
      course,
      branch,
      semester,
      session,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
