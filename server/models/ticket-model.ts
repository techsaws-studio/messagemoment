import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

import { ITicket } from "../interfaces/models-interface.js";
import { TicketTopicEnum } from "../enums/ticket-enum.js";

const TicketSchema: Schema<ITicket> = new Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      default: () => `TKT-${nanoid(10).toUpperCase()}`,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    topic: {
      type: String,
      required: true,
      enum: Object.values(TicketTopicEnum),
      index: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1500, "Query cannot exceed 1500 characters"],
    },
    userIp: {
      type: String,
      required: true,
    },
    userLocation: {
      longitude: { type: Number },
      latitude: { type: Number },
      city: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
    collection: "tickets",
  }
);

TicketSchema.index({ topic: 1, createdAt: -1 });
TicketSchema.index({ emailAddress: 1, createdAt: -1 });

const TicketModel = mongoose.model<ITicket>("Ticket", TicketSchema);
export default TicketModel;
