import mongoose, { Schema } from "mongoose";

import { IParticipant } from "../interfaces/models-interface.js";

const ParticipantSchema: Schema = new Schema(
  {
    sessionId: {
      type: String,
      ref: "Session",
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    participantIp: {
      type: String,
    },
    telcomProvider: { type: String },
    participantLocation: {
      longitude: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    device: { type: String },
    browser: { type: String },
    sessionDuration: { type: Number, default: 0 },
    sessionCount: { type: Number, default: 1 },
    assignedColor: {
      type: Number,
    },
    hasLockedSession: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    hasLeftSession: { type: Boolean, default: false },
    fingerprint: { type: String },
  },
  { timestamps: true }
);

const ParticipantModel = mongoose.model<IParticipant>(
  "Participant",
  ParticipantSchema
);
export default ParticipantModel;
