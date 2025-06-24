export function GetConnectionState(state: number): string {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[state as keyof typeof states] || "unknown";
}
