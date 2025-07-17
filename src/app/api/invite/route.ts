import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Send invitation email
    await sendMail({
      to: email,
      subject: "You're invited to join the Chat App!",
      text: "Click the link to join our chat app.",
      html: "<b>Click the link to join our chat app.</b>",
    });

    return NextResponse.json({ message: "Invitation sent!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process invitation." }, { status: 500 });
  }
} 