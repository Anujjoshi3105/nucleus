import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();
	const { email, password } = body;

	if (!email || !password) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	const formatedEmail = email.toLowerCase();

	await mongoose.connect(process.env.MONGO_URI);

		const user = await User.findOne({ email: formatedEmail });


	if (!user) {
		throw new Error("Email does not exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await User.updateOne(
			{ email: formatedEmail },
			{
				password: hashedPassword,
				passwordResetToken: null,
				passwordResetTokenExp: null,
			}
		);

		return NextResponse.json("Password Updated", { status: 200 });
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
