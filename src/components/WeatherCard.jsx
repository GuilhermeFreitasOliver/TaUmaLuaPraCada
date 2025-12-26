import { WeatherIcon } from './WeatherIcon';

export function WeatherCard({ weather, isCelsius, toggleUnit }) {
  const convertTemp = (temp) => {
    if (!isCelsius) {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  return (
    <div className="text-center backdrop-blur-sm bg-white/30 dark:bg-black/30 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white drop-shadow-lg">
        {weather.name}
        {weather.state && `, ${weather.state}`}
      </h2>
      <div className="flex justify-center mb-4">
        <WeatherIcon code={weather.weather[0].id} />
      </div>
      <div className="text-6xl font-bold mb-4 flex items-center justify-center gap-2 text-slate-900 dark:text-white drop-shadow-lg">
        {Math.round(convertTemp(weather.main.temp))}°
        <button
          onClick={toggleUnit}
          className="text-sm px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isCelsius ? 'C' : 'F'}
        </button>
      </div>
      <p className="text-xl mb-4 capitalize text-slate-900 dark:text-white drop-shadow-lg">
        {weather.weather[0].description}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-slate-900 dark:text-white font-medium">Umidade</p>
          <p className="font-bold text-slate-900 dark:text-white">{weather.main.humidity}%</p>
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-medium">Vento</p>
          <p className="font-bold text-slate-900 dark:text-white">{weather.wind.speed} km/h</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-slate-900 dark:text-white font-medium">Sensação</p>
        <p className="font-bold text-slate-900 dark:text-white">
          {Math.round(convertTemp(weather.main.feels_like))}°{isCelsius ? 'C' : 'F'}
        </p>
      </div>
    </div>
  );
}
