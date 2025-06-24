import { useState, useEffect, useCallback, useRef } from "react";

import { ApiRequest } from "@/utils/api-request";

export const useServerHealth = (options = {}) => {
  const {
    checkInterval = 60000,
    enableAutoCheck = true,
    adaptiveInterval = true,
  } = options;

  const [isServerDown, setIsServerDown] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef();
  const abortControllerRef = useRef();
  const consecutiveFailures = useRef(0);
  const lastCheckTime = useRef(0);

  const getCheckInterval = useCallback(() => {
    if (!adaptiveInterval) return checkInterval;

    if (isServerDown) {
      return Math.min(15000, checkInterval / 2);
    }

    if (consecutiveFailures.current > 0) {
      return Math.min(30000, checkInterval / 2);
    }

    return checkInterval;
  }, [checkInterval, isServerDown, adaptiveInterval]);

  const checkHealth = useCallback(async () => {
    const now = Date.now();
    if (now - lastCheckTime.current < 5000) {
      return !isServerDown;
    }
    lastCheckTime.current = now;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!navigator.onLine) {
      return false;
    }

    try {
      const data = await ApiRequest("/server-status", "GET");
      consecutiveFailures.current = 0;
      return data.status !== "DOWN";
    } catch (error) {
      consecutiveFailures.current++;
      return false;
    }
  }, [isServerDown]);

  const executeHealthCheck = useCallback(async () => {
    if (isChecking) return;

    setIsChecking(true);

    try {
      const isHealthy = await checkHealth();
      const wasDown = isServerDown;
      setIsServerDown(!isHealthy);

      if (wasDown !== !isHealthy) {
        console.log(`Server status changed: ${isHealthy ? "UP" : "DOWN"}`);
      }
    } catch (error) {
      console.error("Health check failed:", error);
      setIsServerDown(true);
    } finally {
      setIsChecking(false);
    }
  }, [checkHealth, isChecking, isServerDown]);

  const refreshHealth = useCallback(() => {
    executeHealthCheck();
  }, [executeHealthCheck]);

  useEffect(() => {
    if (!enableAutoCheck) return;

    executeHealthCheck();

    const scheduleNextCheck = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const currentInterval = getCheckInterval();
      intervalRef.current = setInterval(() => {
        executeHealthCheck().then(() => {
          scheduleNextCheck();
        });
      }, currentInterval);
    };

    scheduleNextCheck();

    const handleOnline = () => {
      console.log("Network online - checking server");
      executeHealthCheck();
    };

    const handleOffline = () => {
      console.log("Network offline");
      setIsServerDown(true);
      consecutiveFailures.current = 0;
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && Date.now() - lastCheckTime.current > 30000) {
        executeHealthCheck();
      }
    };

    window.addEventListener("online", handleOnline, { passive: true });
    window.addEventListener("offline", handleOffline, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: true,
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [executeHealthCheck, enableAutoCheck, getCheckInterval]);

  return {
    isServerDown,
    isChecking,
    refreshHealth,
    ...(process.env.NODE_ENV === "development" && {
      consecutiveFailures: consecutiveFailures.current,
      currentInterval: getCheckInterval(),
    }),
  };
};
