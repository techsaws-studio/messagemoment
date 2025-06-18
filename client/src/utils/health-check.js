export class HealthMonitor {
  constructor() {
    this.isHealthy = true;
    this.consecutiveFailures = 0;
    this.maxFailures = 3;
    this.checkInterval = 30000; // 30 seconds
    this.quickCheckInterval = 10000; // 10 seconds
    this.timeoutDuration = 15000; // 15 seconds
    this.listeners = [];
    this.monitoringInterval = null;
    this.lastHealthData = null;
    this.correctEndpoint = null;
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

  async detectEndpoint() {
    if (this.correctEndpoint) {
      return this.correctEndpoint;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const possiblePaths = ["/api/v1/website-health"];

    console.log("🔍 Auto-detecting correct health endpoint...");

    for (const path of possiblePaths) {
      try {
        const testUrl = `${baseUrl}${path}`;
        console.log(`🧪 Testing: ${testUrl}`);

        const response = await fetch(testUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "omit",
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success !== undefined) {
            this.correctEndpoint = path;
            console.log(`✅ Found correct endpoint: ${testUrl}`);
            return path;
          }
        }
      } catch (error) {
        console.log(`❌ Failed ${path}: ${error.message}`);
        continue;
      }
    }

    // If no endpoint works, default to the most common one
    console.error(
      "🚨 No working endpoint found, defaulting to /website-health"
    );
    this.correctEndpoint = "/website-health";
    return this.correctEndpoint;
  }

  async checkHealth() {
    try {
      const endpoint = await this.detectEndpoint();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const fullUrl = `${baseUrl}${endpoint}`;

      console.log(`🔍 Health check: ${fullUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.timeoutDuration
      );

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📊 Response: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log("📋 Health data:", data);

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
      } else if (response.status === 404) {
        console.error("🚨 Health endpoint not found - trying to re-detect...");
        this.correctEndpoint = null;
        throw new Error("Health endpoint not found");
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

        // Customize message based on error type
        if (error.name === "AbortError") {
          errorMessage =
            "Server response timeout. Please check your connection.";
        } else if (
          error.message.includes("fetch") ||
          error.message.includes("CORS")
        ) {
          errorMessage = "Unable to connect to server. Please try again later.";
        } else if (error.message.includes("not found")) {
          errorMessage = "Server configuration error. Please contact support.";
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

    console.log("🏥 Starting health monitoring...");
    console.log(`📡 Backend URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`);

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
      correctEndpoint: this.correctEndpoint,
    };
  }

  async manualCheck() {
    console.log("🔄 Manual health check initiated...");
    const result = await this.checkHealth();
    return result;
  }

  async debugEndpoints() {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const paths = ["/api/v1/website-health"];

    console.log("🐛 Debug: Testing all possible endpoints...");

    for (const path of paths) {
      try {
        const testUrl = `${baseUrl}${path}`;
        const response = await fetch(testUrl, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
        });

        console.log(
          `${response.ok ? "✅" : "❌"} ${testUrl} → ${response.status} ${
            response.statusText
          }`
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`📋 Response data:`, data);
        }
      } catch (error) {
        console.log(`❌ ${baseUrl}${path} → Error: ${error.message}`);
      }
    }
  }
}

export const healthMonitor = new HealthMonitor();
