import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { fetchWeatherData } from "../../utils/api";
import { DEFAULT_SETTINGS } from "../../utils/constants";
import LoadingSkeleton from "../common/LoadingSkeleton";
import Widget from "../common/Widget";

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const cityRef = useRef(DEFAULT_SETTINGS.CITY);
  const [isPending, startTransition] = useTransition();

  const [state, submitAction] = useActionState(
    async (previousState, formDataOrCity) => {
      let city;
      if (formDataOrCity instanceof FormData) {
        city = formDataOrCity.get("city");
      } else if (typeof formDataOrCity === "string") {
        city = formDataOrCity;
      } else {
        city = cityRef.current;
      }

      if (!city || city.trim() === "") {
        city = cityRef.current;
      }

      cityRef.current = city;

      try {
        const data = await fetchWeatherData(city);
        setWeatherData(data);
        return { success: true, data, error: null };
      } catch (err) {
        console.error("Weather fetch error:", err);
        return { success: false, data: null, error: err };
      }
    },
    { success: null, data: null, error: null }
  );

  useEffect(() => {
    const loadInitialData = () => {
      startTransition(() => {
        submitAction(cityRef.current);
      });
    };

    loadInitialData();

    const interval = setInterval(() => {
      startTransition(() => {
        submitAction(cityRef.current);
      });
    }, DEFAULT_SETTINGS.REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [submitAction]);

  const handleRefresh = () => {
    startTransition(() => {
      submitAction(cityRef.current);
    });
  };

  const renderWeatherContent = () => {
    if (isPending) {
      return <LoadingSkeleton type="weather" />;
    }

    if (!weatherData) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <form action={submitAction} className="flex-grow mr-4">
            <input
              type="text"
              name="city"
              placeholder={`${weatherData.city}, ${weatherData.country}`}
              defaultValue={weatherData.city}
              className="bg-transparent border-none text-lg font-semibold text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
            />
          </form>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
            alt={weatherData.description}
            className="w-16 h-16"
          />
        </div>

        <div className="text-4xl font-bold text-foreground">
          {weatherData.temperature}°C
        </div>

        <p className="text-foreground/60 text-lg capitalize">
          {weatherData.description}
        </p>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-lg">
            <span className="text-foreground/60 text-sm">Feels like</span>
            <span className="font-semibold text-foreground">
              {weatherData.feelsLike}°C
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-lg">
            <span className="text-foreground/60 text-sm">Humidity</span>
            <span className="font-semibold text-foreground">
              {weatherData.humidity}%
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-lg">
            <span className="text-foreground/60 text-sm">Wind</span>
            <span className="font-semibold text-foreground">
              {weatherData.windSpeed} m/s
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Widget
      title="Weather"
      onRefresh={handleRefresh}
      isLoading={isPending}
      error={state.error}
      colorScheme="blue"
    >
      {renderWeatherContent()}
    </Widget>
  );
};

export default WeatherWidget;
