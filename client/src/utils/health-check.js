export class HealthMonitor {
  constructor() {
    this.isHealthy = true;
    this.consecutiveFailures = 0;
    this.maxFailures = 3;
    this.checkInterval = 30000;
    this.quickCheckInterval = 10000;
    this.timeoutDuration = 15000;
    this.listeners = [];
    this.monitoringInterval = null;
    this.lastHealthData = null;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  notifyListeners(status) {
    this.listeners.forEach((callback) => callback(status));
  }

  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.timeoutDuration
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/website-health`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.status === "healthy") {
          if (!this.isHealthy) {
            console.log("✅ Backend fully recovered!");
            this.notifyListeners({
              isHealthy: true,
              message: "All systems operational! 🎉",
              status: "healthy",
              recoveryTime: new Date().toISOString(),
            });
          }

          this.isHealthy = true;
          this.consecutiveFailures = 0;
          this.lastHealthData = data;
          return { healthy: true, data: data };
        } else if (data.status === "degraded") {
          console.warn("⚠️ System degraded:", data.issues);

          if (this.isHealthy) {
            this.notifyListeners({
              isHealthy: false,
              message:
                "System performance degraded. Some features may be slow.",
              status: "degraded",
              issues: data.issues || [],
            });
          }

          this.isHealthy = false;
          this.consecutiveFailures++;
          return { healthy: false, degraded: true, data: data };
        } else {
          throw new Error(data.message || "System unhealthy");
        }
      } else if (response.status === 429) {
        console.warn("⏰ Health check rate limited, skipping...");
        return { healthy: this.isHealthy, rateLimited: true };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.consecutiveFailures++;

      console.warn(
        `🔥 Health check failed (${this.consecutiveFailures}/${this.maxFailures}):`,
        error.message
      );

      if (this.consecutiveFailures >= this.maxFailures && this.isHealthy) {
        console.error("🚨 Backend considered DOWN after multiple failures");
        this.isHealthy = false;

        let errorMessage =
          "Server currently unavailable. Please try again later!";

        if (error.name === "AbortError") {
          errorMessage =
            "Server response timeout. Please check your connection.";
        } else if (error.message.includes("fetch")) {
          errorMessage = "Unable to connect to server. Please try again later.";
        }

        this.notifyListeners({
          isHealthy: false,
          message: errorMessage,
          status: "unhealthy",
          error: error.message,
          consecutiveFailures: this.consecutiveFailures,
        });
      }

      return {
        healthy: false,
        error: error.message,
        consecutiveFailures: this.consecutiveFailures,
      };
    }
  }

  startMonitoring() {
    if (this.monitoringInterval) return;

    this.checkHealth();

    this.monitoringInterval = setInterval(
      () => {
        this.checkHealth();
      },
      this.isHealthy ? this.checkInterval : this.quickCheckInterval
    );

    console.log("🏥 Health monitoring started");
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log("🏥 Health monitoring stopped");
    }
  }

  getStatus() {
    return {
      isHealthy: this.isHealthy,
      consecutiveFailures: this.consecutiveFailures,
      lastHealthData: this.lastHealthData,
    };
  }

  async manualCheck() {
    console.log("🔄 Manual health check initiated...");
    const result = await this.checkHealth();
    return result;
  }
}

export const healthMonitor = new HealthMonitor();
