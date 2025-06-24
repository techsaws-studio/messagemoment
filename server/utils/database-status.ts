export function DatabaseStatus(
  mongoStatus: "UP" | "DOWN" | "DEGRADED",
  redisStatus: "UP" | "DOWN" | "DEGRADED"
): "UP" | "DOWN" | "DEGRADED" {
  if (mongoStatus === "DOWN") {
    return "DOWN";
  }

  if (redisStatus === "DOWN") {
    return "DEGRADED";
  }

  if (mongoStatus === "DEGRADED" || redisStatus === "DEGRADED") {
    return "DEGRADED";
  }

  return "UP";
}
