import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import { WiDaySunny, WiMoonAltWaxingCrescent4 } from 'react-icons/wi';
import { SearchForm } from './components/SearchForm';
import { RecentSearches } from './components/RecentSearches';
import { WeatherCard } from './components/WeatherCard';
import { Footer } from './components/Footer';
import weatherBg from './assets/weather-bg.jpg';

const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Céu limpo', 1: 'Parcialmente nublado', 2: 'Nublado', 3: 'Encoberto',
    45: 'Neblina', 48: 'Nevoeiro', 51: 'Garoa leve', 53: 'Garoa moderada',
    55: 'Garoa forte', 61: 'Chuva fraca', 63: 'Chuva moderada', 65: 'Chuva forte',
    80: 'Pancadas de chuva leve', 81: 'Pancadas de chuva moderada', 82: 'Pancadas de chuva forte',
    95: 'Tempestade'
  };
  return descriptions[code] || 'Desconhecido';
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem('recentSearches') || '[]'));
  const [isCelsius, setIsCelsius] = useState(true);
  const [isDark, setIsDark] = useState(() => JSON.parse(localStorage.getItem('theme') || 'false'));

  // Efeito para gerir o tema
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  const debouncedFetchWeather = useCallback(debounce((searchCity) => {
    if (searchCity.trim().length > 2) fetchWeather(searchCity);
  }, 500), []);

  const addToRecentSearches = (cityName) => {
    setRecentSearches(prev => {
      const newSearches = [cityName, ...prev.filter(city => city !== cityName)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

  const fetchWeather = async (searchCity) => {
    setLoading(true);
    setError(null);
    try {
      const geoResponse = await axios.get(GEOCODING_API_URL, { params: { name: searchCity, count: 1, language: 'pt', format: 'json' } });
      if (!geoResponse.data.results?.[0]) throw new Error('Localização não encontrada.');
      const location = geoResponse.data.results[0];
      const weatherResponse = await axios.get(WEATHER_API_URL, { params: { latitude: location.latitude, longitude: location.longitude, current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature', timezone: 'America/Sao_Paulo', language: 'pt' } });
      setWeather({
        name: location.name, state: location.admin1 || '',
        main: { temp: weatherResponse.data.current.temperature_2m, humidity: weatherResponse.data.current.relative_humidity_2m, feels_like: weatherResponse.data.current.apparent_temperature },
        wind: { speed: weatherResponse.data.current.wind_speed_10m },
        weather: [{ id: weatherResponse.data.current.weather_code, description: getWeatherDescription(weatherResponse.data.current.weather_code) }]
      });
      addToRecentSearches(location.name);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return setError('Geolocalização não suportada.');
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geoResponse = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', { params: { latitude, longitude, localityLanguage: 'pt' } });
          const cityName = geoResponse.data.city || geoResponse.data.locality || 'Localização atual';
          fetchWeather(cityName);
        } catch (err) {
          setError('Erro ao obter dados da localização.');
          setLoading(false);
        }
      },
      () => {
        setError('Permissão de localização negada.');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    document.title = weather ? `Clima em ${weather.name}` : 'Previsão do Tempo';
  }, [weather]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed py-6 flex flex-col justify-center sm:py-12"
      style={{ backgroundImage: `linear-gradient(to bottom, ${isDark ? 'rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.4), rgba(219, 234, 254, 0.5)'}), url(${weatherBg})` }}>
      <button onClick={() => setIsDark(!isDark)} className="fixed top-4 right-4 p-2 rounded-full bg-opacity-50 backdrop-blur-sm transition-all hover:scale-110 z-50" aria-label="Toggle theme">
        {isDark ? <WiDaySunny className="w-8 h-8 text-yellow-300" /> : <WiMoonAltWaxingCrescent4 className="w-8 h-8 text-gray-800" />}
      </button>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 mx-8 md:mx-0 shadow rounded-3xl sm:p-10 bg-white/95 dark:bg-slate-800/90">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-900 dark:text-white sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-700 dark:text-blue-400">Previsão do Tempo</h1>
                <SearchForm city={city} setCity={setCity} loading={loading} handleSubmit={handleSubmit} debouncedFetchWeather={debouncedFetchWeather} getCurrentLocation={getCurrentLocation} />
                <RecentSearches searches={recentSearches} onClear={clearRecentSearches} onSelect={fetchWeather} />
                {error && <div className="text-red-500 text-center">{error}</div>}
                {weather && <WeatherCard weather={weather} isCelsius={isCelsius} toggleUnit={() => setIsCelsius(!isCelsius)} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;