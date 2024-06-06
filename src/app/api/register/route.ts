import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from '@/models/User';

export async function POST(request: any) {
  const body = await request.json();
  const { name, email, password } = body;

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Validation: Check for missing fields
    if (!name || !email || !password) {
      return NextResponse.json("Missing Fields", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json("User already exists!", { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json("User created successfully!", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  } 
}


