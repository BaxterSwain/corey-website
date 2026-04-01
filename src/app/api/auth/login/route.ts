import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { signJWT } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Login attempt for:", email);

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("User found, columns:", Object.keys(user));
    console.log("passwordHash type:", typeof user.passwordHash);
    console.log("password type:", typeof password);

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJWT({ userId: user.id, email: user.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set('corey-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}