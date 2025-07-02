import {
  API_ENDPOINTS,
  API_KEYS,
  DEFAULT_SETTINGS,
} from "@/utils/constants.js";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const fetchWeatherData = async (city = DEFAULT_SETTINGS.CITY) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.WEATHER}/weather?q=${city}&appid=${API_KEYS.OPENWEATHER}&units=metric`
    );

    if (!response.ok) {
      throw new ApiError(
        `Weather API error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to fetch weather data", 500);
  }
};

export const fetchCryptoData = async (
  coins = DEFAULT_SETTINGS.CRYPTO_COINS
) => {
  try {
    const coinIds = coins.join(",");
    const response = await fetch(
      `${API_ENDPOINTS.CRYPTO}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );

    if (!response.ok) {
      throw new ApiError(
        `Crypto API error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return Object.entries(data).map(([id, info]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: info.usd,
      change24h: info.usd_24h_change,
      marketCap: info.usd_market_cap,
    }));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to fetch cryptocurrency data", 500);
  }
};

export const fetchFactData = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.FACTS);

    if (!response.ok) {
      throw new ApiError(
        `Facts API error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return {
      text: data.text,
      source: data.source,
      language: data.language,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to fetch fact data", 500);
  }
};

export const fetchAllWidgetData = async () => {
  try {
    const [weather, crypto, fact] = await Promise.allSettled([
      fetchWeatherData(),
      fetchCryptoData(),
      fetchFactData(),
    ]);

    return {
      weather: weather.status === "fulfilled" ? weather.value : null,
      crypto: crypto.status === "fulfilled" ? crypto.value : null,
      fact: fact.status === "fulfilled" ? fact.value : null,
      errors: {
        weather: weather.status === "rejected" ? weather.reason : null,
        crypto: crypto.status === "rejected" ? crypto.reason : null,
        fact: fact.status === "rejected" ? fact.reason : null,
      },
    };
  } catch {
    throw new ApiError("Failed to fetch dashboard data", 500);
  }
};
