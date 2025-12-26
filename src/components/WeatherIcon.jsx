import {
  WiDaySunny,
  WiNightClear,
  WiRain,
  WiDayRain,
  WiNightRain,
  WiThunderstorm,
  WiCloud,
  WiCloudy,
} from 'react-icons/wi';

export function WeatherIcon({ code, className = 'w-16 h-16' }) {
  const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;

  switch (code) {
    // Clear sky
    case 0:
      return isNight ? (
        <WiNightClear className={`${className} text-gray-300`} />
      ) : (
        <WiDaySunny className={`${className} text-yellow-500`} />
      );
    // Partly cloudy
    case 1:
    case 2:
      return <WiCloud className={`${className} text-gray-400`} />;
    // Overcast
    case 3:
      return <WiCloudy className={`${className} text-gray-500`} />;
    // Rain
    case 51:
    case 53:
    case 55:
      return isNight ? (
        <WiNightRain className={`${className} text-blue-500`} />
      ) : (
        <WiDayRain className={`${className} text-blue-500`} />
      );
    case 61:
    case 63:
    case 65:
      return <WiRain className={`${className} text-blue-600`} />;
    // Thunderstorm
    case 95:
      return <WiThunderstorm className={`${className} text-yellow-400`} />;
    default:
      return <WiCloud className={`${className} text-gray-400`} />;
  }
}
