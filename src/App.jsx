import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_KEY = '4d8fb5b93d4af21d66a2948710284366' // OpenWeather API Key
  const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'
  const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct'  // Changed to https

  const fetchWeather = async (searchCity) => {
    try {
      setLoading(true)
      setError(null)
      if (!searchCity.trim()) {
        throw new Error('Por favor, digite o nome de uma cidade.')
      }
      const formattedCity = searchCity.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      
      // Added timeout and error handling for network issues
      const geoResponse = await axios.get(GEO_API_URL, {
        params: {
          q: formattedCity,
          limit: 1,
          appid: API_KEY
        },
        timeout: 10000 // 10 second timeout
      })

      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error('Localização não encontrada.')
      }

      const locationData = geoResponse.data[0]
      const state = locationData.state || ''
      
      // Agora, obter os dados do clima
      const weatherResponse = await axios.get(WEATHER_API_URL, {
        params: {
          q: formattedCity,
          appid: API_KEY,
          units: 'metric',
          lang: 'pt_br'
        }
      })
      if (!weatherResponse.data) {
        throw new Error('Não foi possível obter os dados do clima.')
      }
      setWeather({
        ...weatherResponse.data,
        state: state
      })
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Cidade não encontrada. Verifique o nome e tente novamente.')
      } else if (err.response && err.response.status === 401) {
        setError('Erro de autenticação. Por favor, tente novamente mais tarde.')
      } else {
        setError(err.message || 'Ocorreu um erro ao buscar os dados. Tente novamente.')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Previsão do Tempo</h1>
                <form onSubmit={handleSubmit} className="mb-8">
                  <div className="flex items-center border-b-2 border-blue-500 py-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Digite o nome da cidade..."
                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                      disabled={loading}
                    >
                      {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}

                {weather && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                      {weather.name}
                      {weather.state && `, ${weather.state}`}
                    </h2>
                    <div className="text-6xl font-bold text-blue-600 mb-4">
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <p className="text-xl mb-4 capitalize">{weather.weather[0].description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">Umidade</p>
                        <p className="font-bold">{weather.main.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Vento</p>
                        <p className="font-bold">{weather.wind.speed} m/s</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
