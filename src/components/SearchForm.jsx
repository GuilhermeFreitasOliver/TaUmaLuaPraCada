import { LoadingSpinner } from './LoadingSpinner';

export function SearchForm({
  city,
  setCity,
  loading,
  handleSubmit,
  debouncedFetchWeather,
  getCurrentLocation,
}) {
  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex items-center border-b-2 border-blue-500 py-2">
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (e.target.value.trim().length > 2) {
              debouncedFetchWeather(e.target.value);
            }
          }}
          placeholder="Digite o nome da cidade..."
          className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
        {city && (
          <button
            type="button"
            onClick={() => setCity('')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-2"
          >
            ×
          </button>
        )}
        <button
          type="button"
          onClick={getCurrentLocation}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
          title="Usar minha localização"
        >
          📍
        </button>
        <button
          type="submit"
          className="flex items-center justify-center w-20 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Buscar'}
        </button>
      </div>
    </form>
  );
}
