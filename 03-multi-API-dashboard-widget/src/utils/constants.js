export const API_ENDPOINTS = {
  WEATHER: import.meta.env.VITE_OPENWEATHER_API_URL,
  CRYPTO: import.meta.env.VITE_COINGECKO_API_URL,
  FACTS: import.meta.env.VITE_FACTS_API_URL,
};

export const API_KEYS = {
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
};

export const DEFAULT_SETTINGS = {
  CITY: import.meta.env.VITE_DEFAULT_CITY || "London",
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  CRYPTO_COINS: ["bitcoin", "ethereum", "cardano"],
};
