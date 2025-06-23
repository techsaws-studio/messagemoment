import "dotenv/config";

import { ITicket } from "interfaces/models-interface.js";

import { isConfigured, transporter } from "services/email-service.js";

import {
  TicketEmailTemplate,
  TicketEmailTemplateText,
} from "templates/ticket-email-template.js";

export const SendEmail = async (ticket: ITicket): Promise<boolean> => {
  console.log("🔍 SendEmail called with ticket:", ticket.ticketId);
  console.log("🔍 isConfigured:", isConfigured);
  console.log("🔍 transporter exists:", !!transporter);

  if (!isConfigured || !transporter) {
    console.warn(
      "⚠️ Email service not configured - skipping email notification"
    );
    return false;
  }

  try {
    // const supportEmail = process.env.EMAIL_SUPPORT || "info@messagemoment.com";
    const supportEmail =
      process.env.EMAIL_SUPPORT || "techsawsdevelopment@gmail.com";
    const fromEmail = process.env.EMAIL_FROM || "noreply@messagemoment.com";

    console.log("📧 Sending email to:", supportEmail);
    console.log("📧 From:", fromEmail);

    await transporter.sendMail({
      from: `"MessageMoment System" <${fromEmail}>`,
      to: supportEmail,
      subject: `🎫 New Ticket: ${ticket.topic} - ${ticket.ticketId}`,
      html: TicketEmailTemplate(ticket),
      text: TicketEmailTemplateText(ticket),
      headers: {
        "X-Ticket-ID": ticket.ticketId,
        "X-Customer-Email": ticket.emailAddress,
      },
    });

    console.info(`✅ Ticket email sent successfully: ${ticket.ticketId}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to send ticket email for ${ticket.ticketId}:`,
      error
    );
    return false;
  }
};
