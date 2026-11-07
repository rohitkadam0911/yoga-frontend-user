import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // In future this can integrate with an email service or backend
    console.log("Contact form submission:", { name, email, phone, subject, message });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We will get back to you shortly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process contact request." },
      { status: 500 }
    );
  }
}
