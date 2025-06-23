import { NextFunction, Request, Response } from "express";

import { CreateTicketRequest } from "interfaces/controllers-interface.js";

import TicketModel from "../models/ticket-model.js";

import { GetGeoLocation } from "../utils/geo-location.js";
import { CatchAsyncErrors } from "../utils/catch-async-errors.js";
import { ErrorHandler } from "../utils/error-handler.js";
import { SendEmail } from "utils/send-mail.js";

import {
  SanitizeTicketData,
  ValidateTicketData,
} from "validations/ticket-validators.js";

export const SubmitTicketFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestData: CreateTicketRequest = req.body;

      const validation = ValidateTicketData(requestData);
      if (!validation.isValid) {
        return next(new ErrorHandler(validation.errors.join(". "), 400));
      }

      const sanitizedData = SanitizeTicketData(requestData);

      const userIp =
        req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        req.socket.remoteAddress ||
        req.ip ||
        "Unknown";

      const userLocation = await GetGeoLocation(userIp);

      const newTicket = new TicketModel({
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        emailAddress: sanitizedData.emailAddress,
        topic: sanitizedData.topic,
        query: sanitizedData.query,
        userIp,
        userLocation: userLocation || {
          longitude: 0,
          latitude: 0,
          city: "Unknown",
          country: "Unknown",
        },
      });

      const savedTicket = await newTicket.save();

      SendEmail(savedTicket).catch((err) =>
        console.error("Failed to send ticket email:", err)
      );

      console.info(
        `✅ Ticket submitted successfully: ${savedTicket.ticketId} by ${sanitizedData.firstName} ${sanitizedData.lastName}`
      );

      return res.status(201).json({
        success: true,
        message:
          "Ticket submitted successfully. We will respond within 24-48 hours.",
        data: {
          ticketId: savedTicket.ticketId,
          submittedAt: savedTicket.createdAt,
        },
      });
    } catch (error: any) {
      console.error("❌ Error submitting ticket:", error);

      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(
          (val: any) => val.message
        );
        return next(new ErrorHandler(messages.join(". "), 400));
      }

      if (error.code === 11000) {
        return next(
          new ErrorHandler("A ticket with this information already exists", 400)
        );
      }

      const message = error.message || "Failed to submit ticket";
      return next(new ErrorHandler(message, 500));
    }
  }
);
