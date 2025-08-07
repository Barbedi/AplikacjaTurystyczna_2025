import { useEffect, useState } from "react";
import { CurrentWeather, ForecastItem } from "../../../assets/Data";
import { formatDate, formatTime } from "../../../utils/format";
import { weatherTranslation } from "../../../utils/weatherTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun,faCalendar } from "@fortawesome/free-solid-svg-icons";

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
        const preferredHours = [18, 12, 6];

        const uniqueDates = new Map<string, ForecastItem>();

        dataForecast.list.forEach((entry: ForecastItem) => {
          const entryDate = new Date(entry.dt_txt);
          const dateKey = entryDate.toISOString().split("T")[0];
          const entryHour = entryDate.getHours();
          if (entryDate.getDate() === today) return;

          if (uniqueDates.has(dateKey)) return;

          for (const hour of preferredHours) {
            if (entryHour === hour && hour <= currentHour) {
              uniqueDates.set(dateKey, entry);
              break;
            }
          }
        });

        const forecastArray = Array.from(uniqueDates.values())
          .sort((a, b) => new Date(a.dt_txt).getTime() - new Date(b.dt_txt).getTime())
          .slice(0, 3); 

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
    <div className="w-full p-6 rounded-2xl text-white bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              Pogoda w {currentWeather?.name}
            </h2>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCloudSun} className="text-xl text-white" />
            </div>
          </div>
          
          {currentWeather ? (
            <div className="  rounded-xl p-4 ">
              <p className="text-lg text-gray-200 mb-4">
                {formatDate(new Date().toISOString())}
              </p>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                    alt={currentWeather.weather[0].description}
                    width={80}
                    height={80}
                    className="drop-shadow-lg"
                  />
                  <div>
                    <p className="text-5xl font-bold">{Math.round(currentWeather.main.temp)}°</p>
                    <p className="text-sm text-gray-300 capitalize">
                      {currentWeather.weather[0].description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-gray-300 mb-1">Aktualizacja</p>
                  <p className="font-semibold">{formatTime(currentWeather.dt)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-gray-300 mb-1">Wschód słońca</p>
                  <p className="font-semibold">{formatTime(currentWeather.sys.sunrise)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-gray-300 mb-1">Zachód słońca</p>
                  <p className="font-semibold">{formatTime(currentWeather.sys.sunset)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <p className="text-gray-300">Brak danych</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-2xl font-bold">Prognoza</h3>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendar} className="text-sm text-white" />
            </div>
          </div>
          
          <div className="  rounded-xl p-4 ">
            <div className="grid grid-cols-1 gap-3">
              {forecast.map((item, index) => (
                <div 
                  key={item.dt} 
                  className={`p-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                    index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                        width={40}
                        height={40}
                        className="flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {formatDate(item.dt_txt)}
                        </p>
                        <p className="text-sm text-gray-300 capitalize">
                          {weatherTranslation[item.weather[0].main] ?? item.weather[0].main}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {Math.round(item.main.temp)}°C
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
