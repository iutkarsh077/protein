import nodemailer from "nodemailer";

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const createTransport = () => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    throw new Error("SMTP_EMAIL and SMTP_PASSWORD must be configured.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
};

export const sendMail = async ({ to, name, subject, body }) => {
  const transport = createTransport();
  const safeName = escapeHtml(name);
  const safeBody = escapeHtml(body);

  return transport.sendMail({
    from: `"VL3" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html: `
      <div style="max-width: 560px; margin: 0 auto; padding: 32px; font-family: Arial, sans-serif; color: #171717;">
        <h1 style="margin: 0 0 16px; font-size: 24px;">Hello, ${safeName}</h1>
        <p style="margin: 0 0 24px; color: #525252; line-height: 1.6;">
          Use this verification code to complete your VL3 registration:
        </p>
        <div style="margin: 24px 0; padding: 20px; border-radius: 10px; background: #f5f5f5; text-align: center;">
          <strong style="font-size: 32px; letter-spacing: 8px;">${safeBody}</strong>
        </div>
        <p style="margin: 24px 0 0; color: #737373; font-size: 14px; line-height: 1.6;">
          This code expires in 10 minutes. If you did not request it, you can ignore this email.
        </p>
      </div>
    `,
  });
};
