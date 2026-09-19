import { useEffect, useState } from 'react'
import './App.css'
import TreeMap from './components/TreeMap'
import { supabase } from './supabaseClient'
import EditTreeModal from './components/EditTreeModal'
import { LocateFixed, MapPinPlus, Pencil } from 'lucide-react'

function App() {
  const [trees, setTrees] = useState([])
  const [isAddMode, setIsAddMode] = useState(false)
  const [selectedTree, setSelectedTree] = useState(null)
  const [myLocation, setMyLocation] = useState(null)
  const [editTree, setEditTree] = useState(null)

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

  async function deleteTree(id) {
    const confirmed = confirm('Delete this tree? This cannot be undone.')
    if (!confirmed) return

    const { error } = await supabase.from('trees').delete().eq('id', id)

    if (error) {
      console.error('Error deleting tree:', error)
      alert('Failed to delete tree: ' + error.message)
    } else {
      if (selectedTree?.id === id) {
        setSelectedTree(null)
      }
      fetchTrees()
    }
  }

  async function updateTree(id, name) {
    const result = await supabase.from('trees').update({ name }).eq('id', id)

    if (result.error) {
      console.error('Error while updating the entry', result.error)
      alert('Failed to update tree: ' + result.error.message)
    } else {
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
    setIsAddMode(false)
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center px-4 justify-between gap-3 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">🫒</span>
          <h1 className="text-base font-semibold text-gray-800 tracking-tight">
            Olive Grove Tracker
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAddTreeAtLocation}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            <LocateFixed size={14} />
            <span className="hidden md:inline">Add at My Location</span>
            <span className="md:hidden">Add Here</span>
          </button>

          <button
            onClick={() => setIsAddMode(!isAddMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isAddMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}
          >
            <MapPinPlus size={14} />
            <span className="hidden md:inline">
              {isAddMode ? 'Click Map to Place…' : 'Add on Map'}
            </span>
          </button>

          <button
            onClick={handleCenterOnMe}
            title="Center on my location"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white w-7 h-7 rounded-md transition-colors"
          >
            <LocateFixed size={14} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="px-4 pt-4 pb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {trees.length} Tree{trees.length !== 1 ? 's' : ''} Tracked
            </p>
          </div>

          <ul className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
            {trees.length === 0 && (
              <li className="text-sm text-gray-400 px-2 py-3">
                No trees yet — add one from the map.
              </li>
            )}

            {trees.map((tree) => (
              <li
                key={tree.id}
                className={`flex items-center gap-2 rounded-lg border transition-all group ${selectedTree?.id === tree.id
                    ? 'bg-green-700 border-green-700'
                    : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-sm'
                  }`}
              >
                <button
                  onClick={() => setSelectedTree(tree)}
                  className="flex-1 flex items-center gap-2.5 text-left px-3 py-2.5 min-w-0"
                >
                  <span className="text-lg leading-none shrink-0">🫒</span>
                  <span
                    className={`truncate text-sm font-medium ${selectedTree?.id === tree.id ? 'text-white' : 'text-gray-700'
                      }`}
                  >
                    {tree.name}
                  </span>
                </button>

                <button
                  onClick={() => setEditTree(tree)}
                  title="Edit tree"
                  className={`shrink-0 mr-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all ${selectedTree?.id === tree.id
                      ? 'text-green-100 hover:text-white hover:bg-green-800'
                      : 'text-gray-300 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Pencil size={13} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <TreeMap
            trees={trees}
            isAddMode={isAddMode}
            onMapClick={handleMapClick}
            selectedTree={selectedTree}
            myLocation={myLocation}
            onEditTree={setEditTree}
          />
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

export default App