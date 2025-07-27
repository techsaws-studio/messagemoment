export function handleAIResearchCompanionError(
  error: any,
  io: any,
  sessionId: string
) {
  console.error("[AI Research Companion] Error:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    response: error.response?.data,
  });

  io.to(sessionId).emit("receiveMessage", {
    sender: "System",
    message: `AI Research Companion Error: ${
      error.response?.data?.error?.message || error.message
    }`,
    timestamp: Date.now(),
  });
}

export function generateSimulatedResponse(message: string): string {
  const responses = [
    `I've analyzed your message: "${message}". Here's a simulated response.`,
    `Regarding "${message}", my simulated analysis suggests...`,
    `Simulated response to: "${message}" - This appears to be an important topic.`,
    `If this weren't a simulation, I'd provide a thoughtful response to: "${message}"`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
