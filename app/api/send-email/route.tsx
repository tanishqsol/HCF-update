import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = "hcfgreaterboston@gmail.com";
const DEFAULT_FROM_EMAIL = "HCF <onboarding@resend.dev>";

export async function POST(request: Request) {
  try {
    const { name, email, message, subject, isWelcome, isNotification } = await request.json();
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;

    console.log("Email API called with:", {
      name,
      email,
      subject,
      isWelcome,
      isNotification,
      messageLength: message?.length,
    });

    // Validate input
    if (!name || !email || !message) {
      console.log("Missing required fields:", { name: !!name, email: !!email, message: !!message });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    console.log("Resend API key exists:", !!apiKey);

    if (!apiKey) {
      console.error("RESEND_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    let emailSubject, emailRecipient, emailHtml;

    if (isWelcome) {
      // Welcome email to the new user
      emailSubject = subject || "Welcome to HCF!";
      emailRecipient = [email];
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #2d5a7c); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to HCF!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Hindi Christian Fellowship of Greater Boston</p>
          </div>
          <div style="padding: 40px 30px; background-color: white;">
            <h2 style="color: #1e3a5f; margin-bottom: 20px;">Congratulations ${name}!</h2>
            <div style="line-height: 1.6; color: #333;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Questions?</strong> Feel free to reach out to us at <a href="mailto:${CONTACT_EMAIL}" style="color: #1e3a5f;">${CONTACT_EMAIL}</a>
              </p>
            </div>
          </div>
          <div style="background-color: #1e3a5f; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Hindi Christian Fellowship of Greater Boston</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Building bridges between faith in Christ and God-ordained culture</p>
          </div>
        </div>
      `;
    } else if (isNotification) {
      emailSubject = subject || `New Event Notification Request from ${name}`;
      emailRecipient = [CONTACT_EMAIL];
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f;">New Event Notification Request</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Request:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              ${message.replace(/\n/g, "<br>")}
            </p>
          </div>
          <p style="color: #666; font-size: 12px;">
            This request was submitted from the HCF of Greater Boston event notifications button.
          </p>
        </div>
      `;
    } else {
      // Contact form email to admin
      emailSubject = subject || `New Contact Form Submission from ${name}`;
      emailRecipient = [CONTACT_EMAIL];
      emailHtml = `
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
      `;
    }

    // Send email via Resend
    console.log("[send-email] Sending email", {
      fromEmail,
      to: emailRecipient,
      subject: emailSubject,
      isWelcome: !!isWelcome,
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: emailRecipient,
      replyTo: isWelcome ? CONTACT_EMAIL : email,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("[send-email] Resend error:", error);
      console.error("[send-email] Full error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to send email", details: error },
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
