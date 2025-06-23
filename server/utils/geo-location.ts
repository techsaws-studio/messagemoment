import "dotenv/config";

import axios from "axios";

export const GetGeoLocation = async (ip: string) => {
  try {
    if (ip === "127.0.0.1" || ip.startsWith("::1")) {
      return {
        longitude: 0,
        latitude: 0,
        city: "Localhost",
        country: "Development",
      };
    }

    const apiKey = process.env.IP_INFO_ACCESS_KEY;
    if (!apiKey) throw new Error("Missing IP geolocation API key");

    const response = await axios.get<{
      loc: string;
      city: string;
      country: string;
      org: string;
    }>(`https://ipinfo.io/${ip}/json`, {
      params: { token: apiKey },
      headers: { Accept: "application/json" },
    });

    if (!response.data || !response.data.loc)
      throw new Error("Invalid location data");

    const [latitude, longitude] = response.data.loc.split(",").map(Number);

    return {
      longitude,
      latitude,
      city: response.data.city,
      country: response.data.country,
      telcomProvider: response.data.org,
    };
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
};
