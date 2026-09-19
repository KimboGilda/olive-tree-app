import { useEffect, useState } from 'react'
import './App.css'
import TreeMap from './components/TreeMap'
import { supabase } from './supabaseClient'
import EditTreeModal from './components/EditTreeModal'

function App() {
  const [trees, setTrees] = useState([])
  const [isAddMode, setIsAddMode] = useState(false)
  const [selectedTree, setSelectedTree] = useState(null);
  const [myLocation, setMyLocation] = useState(null)
  const [editTree, setEditTree] = useState(null);

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
  };

  async function deleteTree(id) {
    const confirmed = confirm('Delete this tree? This cannot be undone.')
    if (!confirmed) return

    const { error } = await supabase.from('trees').delete().eq('id', id)

    if (error) {
      console.error('Error deleting tree:', error)
      alert('Failed to delete tree: ' + error.message)
    } else {
      if (selectedTree?.id === id) {
        setSelectedTree(null) // clear selection if we deleted the selectedTree
      }
      fetchTrees()
    }
  }

  async function updateTree(id, name) {

    const result = await supabase.from('trees').update({ name }).eq('id', id);

    if (result.error) {
      console.error(`Error while updating the entry`, result.error)
      alert('Failed to update tree: ' + result.error.message)
    }
    else {
      fetchTrees()
    }
  }



  function handleCenterOnMe() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          _t: Date.now(),
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Could not get your location: ' + error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  };

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
    setIsAddMode(false)
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
          <button
            onClick={handleCenterOnMe}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            📍
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
                  onClick={() => setEditTree(tree)}
                  className="p-1 hover:bg-blue-80"
                  title="Edit tree"
                >
                  ✏️
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
            selectedTree={selectedTree}
            myLocation={myLocation} />
        </main>

        {editTree && (
          <EditTreeModal
            tree={editTree}
            onClose={() => setEditTree(null)}
            onSave={updateTree}
            onDelete={deleteTree}
          />
        )}
      </div>
    </div>
  )
}

export default App;