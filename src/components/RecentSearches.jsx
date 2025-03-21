export function RecentSearches({ searches, onClear, onSelect }) {
  if (searches.length === 0) return null
  
  return (
    <div className="mt-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-500">Pesquisas recentes:</p>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Limpar histórico
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map(city => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}