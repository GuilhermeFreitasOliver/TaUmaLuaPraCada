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
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">
        {weather.name}
        {weather.state && `, ${weather.state}`}
      </h2>
      <div className="flex justify-center mb-4">
        {getWeatherIcon(weather.weather[0].id)}
      </div>
      <div className="text-6xl font-bold text-blue-600 mb-4 flex items-center justify-center gap-2">
        {Math.round(convertTemp(weather.main.temp))}°
        <button 
          onClick={toggleUnit}
          className="text-sm bg-blue-100 px-2 py-1 rounded"
        >
          {isCelsius ? 'C' : 'F'}
        </button>
      </div>
      <p className="text-xl mb-4 capitalize">{weather.weather[0].description}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-gray-500">Umidade</p>
          <p className="font-bold">{weather.main.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-500">Vento</p>
          <p className="font-bold">{weather.wind.speed} km/h</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-gray-500">Sensação</p>
        <p className="font-bold">{Math.round(convertTemp(weather.main.feels_like))}°{isCelsius ? 'C' : 'F'}</p>
      </div>
    </div>
  )
}