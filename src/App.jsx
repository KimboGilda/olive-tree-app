import { useEffect, useState } from 'react'
import './App.css'
import TreeMap from './components/TreeMap'
import { supabase } from './supabaseClient'

function App() {
  const [trees, setTrees] = useState([])
  const [isAddMode, setIsAddMode] = useState(false)
  const [selectedTree, setSelectedTree] = useState(null);

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

  // Delete a tracked entry
  async function deleteTree(id) {
    const confirmed = confirm('Delete this tree? This cannot be undone.')
    if (!confirmed) return

    const { error } = await supabase.from('trees').delete().eq('id', id)

    if (error) {
      console.error('Error deleting tree:', error)
      alert('Failed to delete tree: ' + error.message)
    } else {
      if (selectedTree?.id === id) {
        setSelectedTree(null) // clear selection if we just deleted the selected tree
      }
      fetchTrees()
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-16 shrink-0 bg-white border-b border-gray-300 flex items-center px-4 justify-between gap-2">
        <h1 className="text-xl font-semibold text-gray-800">🫒 Olive Trees Tracker</h1>
        <div className="flex gap-2">
          <button
            onClick={handleAddTreeAtLocation}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add 🫒 Here (GPS)
          </button>
          <button
            onClick={() => setIsAddMode(!isAddMode)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${isAddMode
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
          >
            {isAddMode ? 'Click map to place 🫒' : 'Add 🫒 on Map'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 bg-gray-50 border-r border-gray-300 p-4 overflow-y-auto">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            {trees.length} tree{trees.length !== 1 ? 's' : ''} tracked
          </p>

          <ul className="space-y-1.5">
            {trees.map((tree) => (
              <li key={tree.id} className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedTree(tree)}
                  className={`flex-1 flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedTree?.id === tree.id
                    ? 'bg-green-700 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                >
                  <span className="text-base">🫒</span>
                  <span className="truncate">{tree.name}</span>
                </button>
                <button
                  onClick={() => deleteTree(tree.id)}
                  className="shrink-0 text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                  title="Delete tree"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1">
          <TreeMap
            trees={trees}
            isAddMode={isAddMode}
            onMapClick={handleMapClick}
            selectedTree={selectedTree} />
        </main>
      </div>
    </div>
  )
}

export default App;