export const ApiRequest = async (endpoint, method = "GET", body) => {
  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`🌐 API Request: ${method} ${fullUrl}`);
    }

    const response = await fetch(fullUrl, {
      method,
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.message || `HTTP ${response.status}: ${response.statusText}`
      );
      error.status = response.status;
      error.statusText = response.statusText;
      error.endpoint = endpoint;
      error.responseData = data;

      if (response.status === 404) {
        console.warn(`🔍 Route not found: ${endpoint}`);
      } else if (response.status >= 500) {
        console.error(`🚨 Server error: ${error.message}`);
      } else {
        console.warn(`⚠️ Client error: ${error.message}`);
      }

      throw error;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Success: ${method} ${endpoint}`);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error(`🌐 Network Error: Unable to reach ${endpoint}`);
      const networkError = new Error(`Network error: Unable to reach server`);
      networkError.type = "NETWORK_ERROR";
      networkError.endpoint = endpoint;
      throw networkError;
    }

    throw error;
  }
};
