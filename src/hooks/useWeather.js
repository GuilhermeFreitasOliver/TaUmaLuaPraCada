import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import debounce from 'lodash/debounce'

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'

export function useWeather() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches')
    return saved ? JSON.parse(saved) : []
  })

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

  const addToRecentSearches = (cityName) => {
    setRecentSearches(prev => {
      const newSearches = [cityName, ...prev.filter(city => city !== cityName)]
      const result = newSearches.slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(result))
      return result
    })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

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
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleError = (err) => {
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
    }
  
    const debouncedFetchWeather = useCallback(
      debounce((searchCity) => {
        if (searchCity.trim().length > 2) {
          fetchWeather(searchCity)
        }
      }, 500),
      []
    )
  
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        setLoading(true)
        setError(null)
        navigator.geolocation.getCurrentPosition(
          async (position) => {
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
              setError('Erro ao obter dados da localização atual')
              console.error('Erro na geolocalização:', err)
            } finally {
              setLoading(false)
            }
          },
          (err) => {
            setError('Permissão de localização negada')
            setLoading(false)
            console.error('Erro de permissão:', err)
          }
        )
      } else {
        setError('Geolocalização não suportada pelo seu navegador')
      }
    }
  
    return {
      city,
      setCity,
      weather,
      loading,
      error,
      recentSearches,
      fetchWeather,
      debouncedFetchWeather,
      clearRecentSearches,
      getCurrentLocation
    }
  }