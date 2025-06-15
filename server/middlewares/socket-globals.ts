import { Server } from "socket.io";
import { MessageReceived } from "../events/message-received.js";

let isMessageReceiverInitialized = false;

export const GlobalSocketListeners = (io: Server): void => {
  io.engine.on("connection_error", (err) => {
    console.error("🔌 Socket connection error:", err);
  });

  if (!isMessageReceiverInitialized) {
    MessageReceived();
    isMessageReceiverInitialized = true;
    console.info("🧠 Global listener 'MessageReceived' initialized once");
  }
};
