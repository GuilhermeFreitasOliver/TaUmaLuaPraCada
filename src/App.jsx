import { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'
import axios from 'axios'
import { WiDaySunny, WiNightClear, WiRain, WiDayRain, WiNightRain, 
         WiThunderstorm, WiCloud, WiCloudy, WiMoonAltWaxingCrescent4 } from 'react-icons/wi'
import { LoadingSpinner } from './components/LoadingSpinner'
import { SearchForm } from './components/SearchForm'
import { RecentSearches } from './components/RecentSearches'
import { WeatherCard } from './components/WeatherCard'
// import { useWeather } from './hooks/useWeather' // Comment this out for now
import { Footer } from './components/Footer'
import weatherBg from './assets/weather-bg.jpg'
import weatherDayBg from './assets/weather-bg.jpg'
import weatherNightBg from './assets/weather-bg.jpg'

// Remove this duplicate import
// import weatherBg from './assets/weather-bg.jpg'

// Move this helper function before App
const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Céu limpo',
    1: 'Parcialmente nublado',
    2: 'Nublado',
    3: 'Encoberto',
    45: 'Neblina',
    48: 'Nevoeiro',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa forte',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    80: 'Pancadas de chuva leve',
    81: 'Pancadas de chuva moderada',
    82: 'Pancadas de chuva forte',
    95: 'Tempestade'
  }
  return descriptions[code] || 'Desconhecido'
}

// Remove the duplicate import line below
// import { WiMoonAltWaxingCrescent4, WiDaySunny } from 'react-icons/wi'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches')
    return saved ? JSON.parse(saved) : []
  })
  // Add missing isCelsius state
  const [isCelsius, setIsCelsius] = useState(true)
  const [isNight, setIsNight] = useState(false)  // Add this line

  // Implement debounced search
  const debouncedFetchWeather = useCallback(
    debounce((searchCity) => {
      if (searchCity.trim().length > 2) {
        fetchWeather(searchCity)
      }
    }, 500),
    []
  )

  const addToRecentSearches = (cityName) => {
    setRecentSearches(prev => {
      const newSearches = [cityName, ...prev.filter(city => city !== cityName)]
      const result = newSearches.slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(result))
      return result
    })
  }

  // Remove old API constants and keep only Open-Meteo ones
  const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'
  const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
  
  const fetchWeather = async (searchCity) => {
    try {
      setLoading(true)
      setError(null)
      
      // First get coordinates
      const geoResponse = await axios.get(GEOCODING_API_URL, {
        params: {
          name: searchCity,
          count: 1,
          language: 'pt',
          format: 'json'
        }
      })
  
      if (!geoResponse.data.results?.[0]) {
        throw new Error('Localização não encontrada.')
      }
  
      const location = geoResponse.data.results[0]
      
      // Get weather data
      const weatherResponse = await axios.get(WEATHER_API_URL, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature',
          timezone: 'America/Sao_Paulo',
          language: 'pt'
        }
      })
  
      setWeather({
        name: location.name,
        state: location.admin1 || '',
        main: {
          temp: weatherResponse.data.current.temperature_2m,
          humidity: weatherResponse.data.current.relative_humidity_2m,
          feels_like: weatherResponse.data.current.apparent_temperature
        },
        wind: {
          speed: weatherResponse.data.current.wind_speed_10m
        },
        weather: [{
          id: weatherResponse.data.current.weather_code,
          description: getWeatherDescription(weatherResponse.data.current.weather_code)
        }]
      })
      
      addToRecentSearches(location.name)
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError('Cidade não encontrada. Verifique o nome e tente novamente.')
            break
          case 401:
            setError('Erro de autenticação. Por favor, tente novamente mais tarde.')
            break
          case 429:
            setError('Muitas requisições. Aguarde um momento e tente novamente.')
            break
          case 500:
            setError('Erro no servidor. Tente novamente mais tarde.')
            break
          default:
            setError('Erro ao buscar dados do clima. Tente novamente.')
        }
      } else if (err.request) {
        setError('Erro de conexão. Verifique sua internet.')
      } else {
        setError(err.message || 'Ocorreu um erro desconhecido.')
      }
      setWeather(null)
      console.error('Erro na requisição:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeather(city)
    }
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

  useEffect(() => {
      document.title = weather 
        ? `Clima em ${weather.name} - Previsão do Tempo`
        : 'Previsão do Tempo'
    }, [weather])

  // Move this function up with other functions, before the return statement
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // Add missing getCurrentLocation function
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo seu navegador')
      return
    }
  
    setLoading(true)
    setError(null)
  
    const handleSuccess = async (position) => {
      try {
        const { latitude, longitude } = position.coords
        
        // Get location name from coordinates
        const geoResponse = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
          params: {
            latitude,
            longitude,
            localityLanguage: 'pt'
          }
        })
        
        const cityName = geoResponse.data.city || geoResponse.data.locality || 'Localização atual'
        
        // Get weather data
        const weatherResponse = await axios.get(WEATHER_API_URL, {
          params: {
            latitude,
            longitude,
            current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature',
            timezone: 'America/Sao_Paulo',
            language: 'pt'
          }
        })
        
        setWeather({
          name: cityName,
          state: geoResponse.data.principalSubdivision || '',
          main: {
            temp: weatherResponse.data.current.temperature_2m,
            humidity: weatherResponse.data.current.relative_humidity_2m,
            feels_like: weatherResponse.data.current.apparent_temperature
          },
          wind: {
            speed: weatherResponse.data.current.wind_speed_10m
          },
          weather: [{
            id: weatherResponse.data.current.weather_code,
            description: getWeatherDescription(weatherResponse.data.current.weather_code)
          }]
        })
        
        addToRecentSearches(cityName)
      } catch (err) {
        setError('Erro ao obter dados da localização atual. Por favor, tente novamente.')
        console.error('Erro na geolocalização:', err)
      } finally {
        setLoading(false)
      }
    }
  
    const handleError = (error) => {
      setLoading(false)
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Para usar sua localização atual, permita o acesso à localização nas configurações do seu navegador.')
          break
        case error.POSITION_UNAVAILABLE:
          setError('Não foi possível determinar sua localização atual.')
          break
        case error.TIMEOUT:
          setError('Tempo esgotado ao tentar obter sua localização.')
          break
        default:
          setError('Ocorreu um erro ao tentar obter sua localização.')
      }
    }
  
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  }

  useEffect(() => {
    const checkTime = () => {
      const hours = new Date().getHours()
      setIsNight(hours >= 18 || hours < 6)
    }
    
    checkTime() // Initial check
    const interval = setInterval(checkTime, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  // Add isDark state with other states
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? JSON.parse(saved) : false
  })

  // Add effect to save theme preference
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark))
  }, [isDark])

  return (
    <div 
      className={`min-h-screen bg-cover bg-center bg-no-repeat bg-fixed py-6 flex flex-col justify-center sm:py-12 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, 
          ${isDark 
            ? 'rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.5)'
            : 'rgba(255, 255, 255, 0.4), rgba(219, 234, 254, 0.5)'
          }), url(${weatherBg})`
      }}>
      {/* Theme toggle button */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 p-2 rounded-full bg-opacity-50 backdrop-blur-sm transition-all hover:scale-110 z-50"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <WiDaySunny className="w-8 h-8 text-yellow-300" />
        ) : (
          <WiMoonAltWaxingCrescent4 className="w-8 h-8 text-gray-800" />
        )}
      </button>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className={`relative px-4 py-10 mx-8 md:mx-0 shadow rounded-3xl sm:p-10
          ${isDark 
            ? 'bg-slate-800/90 text-white' 
            : 'bg-white/95 text-gray-900'}`}>
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 sm:text-lg sm:leading-7">
                <h1 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Previsão do Tempo
                </h1>
                <SearchForm 
                  city={city}
                  setCity={setCity}
                  loading={loading}
                  handleSubmit={handleSubmit}
                  debouncedFetchWeather={debouncedFetchWeather}
                  getCurrentLocation={getCurrentLocation}
                />

                <RecentSearches 
                  searches={recentSearches}
                  onClear={clearRecentSearches}
                  onSelect={fetchWeather}
                />

                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}

                {weather && (
                  <WeatherCard 
                    weather={weather} 
                    isCelsius={isCelsius}
                    toggleUnit={() => setIsCelsius(!isCelsius)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App


