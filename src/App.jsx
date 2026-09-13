import { useEffect, useState } from 'react'
import './App.css'
import TreeMap from './components/TreeMap'
import { supabase } from './supabaseClient'

function App() {
  const [trees, setTrees] = useState([])
  const [isAddMode, setIsAddMode] = useState(false)

  useEffect(() => {
    fetchTrees()
  }, [])

  async function fetchTrees() {
    const { data, error } = await supabase.from('trees').select('*')
    if (error) {
      console.error('Error fetching trees:', error)
    } else {
      setTrees(data)
    }
  }

  async function saveTree(lat, lng, source) {
    const name = prompt('Name this olive tree:')
    if (!name) return

    const { error } = await supabase
      .from('trees')
      .insert([{ name, lat, lng, source }])

    if (error) {
      console.error('Error saving tree:', error)
      alert('Failed to save tree: ' + error.message)
    } else {
      fetchTrees()
    }
  }

  function handleAddTreeAtLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        saveTree(latitude, longitude, 'gps')
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Could not get your location: ' + error.message)
      }
    )
  }

  function handleMapClick(latlng) {
    saveTree(latlng.lat, latlng.lng, 'manual')
    setIsAddMode(false) // turn off add mode after placing one tree
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-16 shrink-0 bg-white border-b border-gray-300 flex items-center px-4 justify-between gap-2">
        <h1 className="text-xl font-semibold text-gray-800">🫒 Olive Grove Tracker</h1>
        <div className="flex gap-2">
          <button
            onClick={handleAddTreeAtLocation}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add Tree Here (GPS)
          </button>
          <button
            onClick={() => setIsAddMode(!isAddMode)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${isAddMode
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
          >
            {isAddMode ? 'Click map to place tree…' : 'Add Tree on Map'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 bg-gray-50 border-r border-gray-300 p-4 overflow-y-auto">
          <p className="text-sm text-gray-500">
            {trees.length} tree{trees.length !== 1 ? 's' : ''} tracked
          </p>
        </aside>

        <main className="flex-1">
          <TreeMap trees={trees} isAddMode={isAddMode} onMapClick={handleMapClick} />
        </main>
      </div>
    </div>
  )
}

export default App