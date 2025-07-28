import { useEffect, useState } from "react";
import { CurrentWeather, ForecastItem } from "../../../assets/Data";
import { formatDate, formatTime } from "../../../utils/format";
import { weatherTranslation } from "../../../utils/weatherTranslation";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CITY = import.meta.env.VITE_WEATHER_CITY;

const WeatherWidget = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null,
  );
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const resCurrent = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=pl`,
        );
        if (!resCurrent.ok)
          throw new Error("Nie udało się pobrać danych o bieżącej pogodzie.");

        const dataCurrent = await resCurrent.json();
        setCurrentWeather(dataCurrent);

        const resForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric&lang=pl`,
        );
        if (!resForecast.ok)
          throw new Error("Nie udało się pobrać danych o prognozie pogody.");

        const dataForecast = await resForecast.json();

        const now = new Date();
        const today = now.getDate();
        const currentHour = now.getHours();

        // Preferowane godziny, od najpóźniejszej do najwcześniejszej
        const preferredHours = [18, 12, 6];

        // Mapa na unikalne dni z najlepszą godziną
        const uniqueDates = new Map<string, ForecastItem>();

        dataForecast.list.forEach((entry: ForecastItem) => {
          const entryDate = new Date(entry.dt_txt);
          const dateKey = entryDate.toISOString().split("T")[0];
          const entryHour = entryDate.getHours();

          // Pomijamy dzisiejszy dzień, bo dzisiejszą pogodę mamy w currentWeather
          if (entryDate.getDate() === today) return;

          if (uniqueDates.has(dateKey)) return;

          for (const hour of preferredHours) {
            if (entryHour === hour && hour <= currentHour) {
              uniqueDates.set(dateKey, entry);
              break;
            }
          }
        });

        const forecastArray = Array.from(uniqueDates.values()).sort(
          (a, b) => new Date(a.dt_txt).getTime() - new Date(b.dt_txt).getTime(),
        );

        setForecast(forecastArray);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p>Ładowanie pogody...</p>;
  if (error) return <p className="text-red-500">Błąd: {error}</p>;

  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1 p-3 rounded-lg w-full text-white border-4 border-accent bg-accent/60 shadow-2xl">
      <div className="mb-2">
        <h2 className="text-2xl font-bold mb-2">
          Pogoda w {currentWeather?.name}
        </h2>
        {currentWeather ? (
          <div className="flex items-center ">
            <div className="flex flex-col items-start mx-0">
              <p className="text-lg text-gray-200 mb-0 ml-2">
                {formatDate(new Date().toISOString())}
              </p>
              <div className="flex items-center m-0 p-0">
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                  alt={currentWeather.weather[0].description}
                  width={60}
                  height={60}
                  className="flex-shrink-0"
                />
                <p className="text-2xl ml-0.5">{currentWeather.main.temp}°C</p>
              </div>
              <p className="text-xs text-left text-gray-200 mb-0">
                {currentWeather.weather[0].description}
              </p>
            </div>
            <div className="flex flex-col items-start mx-0 text-left">
              <p className="text-sm text-gray-400 mb-1 ml-2">
                Aktualizacja: {formatTime(currentWeather.dt)}
              </p>
              <p className="text-sm text-gray-400 mb-1 ml-2">
                Wschód słońca: {formatTime(currentWeather.sys.sunrise)}
              </p>
              <p className="text-sm text-gray-400 mb-1 ml-2">
                Zachód słońca: {formatTime(currentWeather.sys.sunset)}
              </p>
            </div>
          </div>
        ) : (
          <p>Brak danych</p>
        )}
      </div>
      <div>
        <h3 className="text-xl font-lora mb-4">Prognoza na najbliższe dni</h3>
        <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
          {forecast.map((item) => (
            <div key={item.dt} className="p-2 rounded flex items-center gap-2 ">
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <div>
                <span className="block font-sans font-bold 2xl:text-nowrap">
                  {formatDate(item.dt_txt)}
                </span>
                <span className="block">
                  {item.main.temp.toFixed(1)}°C,{" "}
                  {weatherTranslation[item.weather[0].main] ??
                    item.weather[0].main}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
