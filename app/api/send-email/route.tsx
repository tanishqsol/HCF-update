import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }


    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "HCF Contact Form <onboarding@resend.dev>", // Change to your verified domain
      to: ["tanishqsolanki7@gmail.com"], // Your email address
    //   cc: ["tanishqsolanki904@gmail.com"],
    //   bcc: ["sjatiani@gmail.com"],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              ${message.replace(/\n/g, "<br>")}
            </p>
          </div>
          <p style="color: #666; font-size: 12px;">
            This email was sent from the HCF of Greater Boston contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[send-email] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, id: data?.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[send-email] Error sending email:", err);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
