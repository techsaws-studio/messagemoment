import "dotenv/config";

import nodemailer from "nodemailer";

import { EmailConfig } from "interfaces/services-interface.js";

export let transporter: nodemailer.Transporter | null = null;
export let isConfigured = false;

export const EmailService = (): void => {
  try {
    const emailConfig: EmailConfig = {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
      },
    };

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn(
        "⚠️ Email service not configured - missing EMAIL_USER or EMAIL_PASS"
      );
      return;
    }

    transporter = nodemailer.createTransport(emailConfig);
    isConfigured = true;

    console.info("✅ Email service initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize email service:", error);
    isConfigured = false;
  }
};

export const VerifyEmailConnection = async (): Promise<boolean> => {
  if (!isConfigured || !transporter) return false;

  try {
    await transporter.verify();
    console.info("✅ Email service connection verified");
    return true;
  } catch (error) {
    console.error("❌ Email service connection failed:", error);
    return false;
  }
};
