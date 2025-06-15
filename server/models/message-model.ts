import mongoose, { Schema } from "mongoose";

import { IMessage } from "../interfaces/models-interface.js";

const MessageSchema: Schema<IMessage> = new Schema(
  {
    sessionId: { type: String, required: true, index: true },

    username: { type: String, required: true },

    message: { type: String, required: true },

    timestamp: { type: Number, required: true },

    displayExpiresAt: { type: Date },

    isSystemMessage: { type: Boolean, default: false },

    isAIMessage: { type: Boolean, default: false },

    isPermanent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ sessionId: 1, timestamp: 1 });
MessageSchema.index({ displayExpiresAt: 1 }, { expireAfterSeconds: 86400 });

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
export default MessageModel;
