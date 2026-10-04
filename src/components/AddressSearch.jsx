import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";

function AddressSearch({ onSelectLocation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query,
          )}&limit=5`,
        );
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleSelect(result) {
    onSelectLocation({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      _t: Date.now(),
    });
    setQuery(result.display_name);
    setResults([]);
    setIsOpen(false);
  }

  return (
    <div className="relative flex-1 min-w-0 max-w-xs">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search address…"
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white"
        />
        {isLoading && (
          <Loader2
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
          />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto z-[1000]">
          {results.map((result) => (
            <li key={result.place_id}>
              <button
                onClick={() => handleSelect(result)}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                {result.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressSearch;
