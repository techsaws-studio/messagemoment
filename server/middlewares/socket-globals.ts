import { Server } from "socket.io";

import { MessageReceived } from "../events/message-received.js";
import { MessageExpiredReceived } from "../events/message-expired-received.js";

let isMessageReceiverInitialized = false;
let isMessageExpiredInitialized = false;

export const GlobalSocketListeners = (io: Server): void => {
  io.engine.on("connection_error", (err) => {
    console.error("🔌 Socket connection error:", err);
  });

  if (!isMessageReceiverInitialized) {
    MessageReceived();
    isMessageReceiverInitialized = true;
    console.info("🧠 Global listener 'MessageReceived' initialized once");
  }

  if (!isMessageExpiredInitialized) {
    MessageExpiredReceived();
    isMessageExpiredInitialized = true;
    console.info(
      "🧠 Global listener 'MessageExpiredReceived' initialized once"
    );
  }
};
