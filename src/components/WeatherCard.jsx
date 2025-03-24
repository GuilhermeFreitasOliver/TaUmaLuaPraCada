import { WiDaySunny, WiNightClear, WiRain, WiDayRain, WiNightRain, 
         WiThunderstorm, WiCloud, WiCloudy } from 'react-icons/wi'

export function WeatherCard({ weather, isCelsius, toggleUnit }) {
  const convertTemp = (temp) => {
    if (!isCelsius) {
      return (temp * 9/5) + 32
    }
    return temp
  }

  const getWeatherIcon = (weatherCode) => {
    const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;
    
    switch (weatherCode) {
      // Clear sky
      case 0:
        return isNight 
          ? <WiNightClear className="w-16 h-16 text-gray-300" />
          : <WiDaySunny className="w-16 h-16 text-yellow-500" />
      // Partly cloudy
      case 1:
      case 2:
        return <WiCloud className="w-16 h-16 text-gray-400" />
      // Overcast
      case 3:
        return <WiCloudy className="w-16 h-16 text-gray-500" />
      // Rain
      case 51:
      case 53:
      case 55:
        return isNight
          ? <WiNightRain className="w-16 h-16 text-blue-500" />
          : <WiDayRain className="w-16 h-16 text-blue-500" />
      case 61:
      case 63:
      case 65:
        return <WiRain className="w-16 h-16 text-blue-600" />
      // Thunderstorm
      case 95:
        return <WiThunderstorm className="w-16 h-16 text-yellow-400" />
      default:
        return <WiCloud className="w-16 h-16 text-gray-400" />
    }
  }

  return (
    <div className="text-center backdrop-blur-sm bg-white/30 dark:bg-black/30 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white drop-shadow-lg">
        {weather.name}
        {weather.state && `, ${weather.state}`}
      </h2>
      <div className="flex justify-center mb-4">
        {getWeatherIcon(weather.weather[0].id)}
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
  )
}