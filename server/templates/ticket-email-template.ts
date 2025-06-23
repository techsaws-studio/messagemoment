import { ITicket } from "interfaces/models-interface.js";

export const TicketEmailTemplate = (ticket: ITicket): string => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }
            .content { background: white; padding: 20px; border-radius: 8px; }
            .info-row { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; }
            .query-box { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2196f3; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 New Support Ticket</h1>
              <p>Ticket ID: ${ticket.ticketId}</p>
            </div>
            <div class="content">
              <div class="info-row">
                <strong>Customer:</strong> ${ticket.firstName} ${
    ticket.lastName
  }
              </div>
              <div class="info-row">
                <strong>Email:</strong> ${ticket.emailAddress}
              </div>
              <div class="info-row">
                <strong>Topic:</strong> ${ticket.topic}
              </div>
              <div class="info-row">
                <strong>Submitted:</strong> ${ticket.createdAt.toLocaleString()}
              </div>
              <div class="info-row">
                <strong>Location:</strong> ${
                  ticket.userLocation?.city || "Unknown"
                }, ${ticket.userLocation?.country || "Unknown"}
              </div>
              <div class="info-row">
                <strong>IP Address:</strong> ${ticket.userIp}
              </div>
              
              <div class="query-box">
                <h3>💬 Customer Query:</h3>
                <p style="font-style: italic;">"${ticket.query}"</p>
              </div>
            </div>
            <div class="footer">
              <p>This ticket was automatically generated from MessageMoment contact form.</p>
              <p>Please respond within 24-48 hours.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

export const TicketEmailTemplateText = (ticket: ITicket): string => {
  return `
      New Support Ticket: ${ticket.ticketId}
      
      Customer Information:
      - Name: ${ticket.firstName} ${ticket.lastName}
      - Email: ${ticket.emailAddress}
      - Topic: ${ticket.topic}
      - Submitted: ${ticket.createdAt.toLocaleString()}
      - Location: ${ticket.userLocation?.city || "Unknown"}, ${
    ticket.userLocation?.country || "Unknown"
  }
      - IP Address: ${ticket.userIp}
      
      Customer Query:
      "${ticket.query}"
      
      ---
      This ticket was automatically generated from MessageMoment contact form.
      Please respond within 24-48 hours.
    `;
};
