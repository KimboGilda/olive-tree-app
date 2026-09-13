import { useEffect, useState } from 'react'
import './App.css'
import TreeMap from './components/TreeMap'
import { supabase } from './supabaseClient'

function App() {
  const [trees, setTrees] = useState([])

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

  async function handleAddTreeAtLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        const name = prompt('Name this olive tree:')
        if (!name) return // user cancelled or left it empty

        const { error } = await supabase
          .from('trees')
          .insert([{ name, lat: latitude, lng: longitude, source: 'gps' }])

        if (error) {
          console.error('Error saving tree:', error)
          alert('Failed to save tree: ' + error.message)
        } else {
          fetchTrees() // refresh the list so the new marker appears
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Could not get your location: ' + error.message)
      }
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-16 shrink-0 bg-white border-b border-gray-300 flex items-center px-4 justify-between">
        <h1 className="text-xl font-semibold text-gray-800">🫒 Olive Grove Tracker</h1>
        <button
          onClick={handleAddTreeAtLocation}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Add Tree Here
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 bg-gray-50 border-r border-gray-300 p-4 overflow-y-auto">
          <p className="text-sm text-gray-500">
            {trees.length} tree{trees.length !== 1 ? 's' : ''} tracked
          </p>
        </aside>

        <main className="flex-1">
          <TreeMap trees={trees} />
        </main>
      </div>
    </div>
  )
}

export default App