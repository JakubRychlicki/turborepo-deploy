import nodemailer from "nodemailer";
import { generateVerificationEmail } from "./emails/verification.js";

export async function sendTestEmail() {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const html = await generateVerificationEmail({
    token: "123456",
    user: { email: "test@example.com", name: "Jan" },
  });

  const info = await transporter.sendMail({
    from: '"Tester" <test@example.com>',
    to: "recipient@example.com",
    subject: "Hello from Ethereal",
    html,
  });

  console.log("✅ Test mail wysłany!");
  console.log("🔗 Podgląd:", nodemailer.getTestMessageUrl(info));

  return info;
}
