import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

import { ITimerChange } from "interfaces/models-interface.js";

const TimerChangeSchema = new Schema<ITimerChange>(
  {
    changeId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    sessionId: { type: String, required: true, index: true },
    timestamp: { type: Number, required: true },
    setBy: { type: String, required: true },
    newTimerValue: { type: Number, required: true },
    previousTimerValue: { type: Number, required: true },
  },
  { timestamps: true }
);

TimerChangeSchema.index({ sessionId: 1, timestamp: 1 });

const TimerChangeModel = mongoose.model<ITimerChange>(
  "TimerChange",
  TimerChangeSchema
);
export default TimerChangeModel;
