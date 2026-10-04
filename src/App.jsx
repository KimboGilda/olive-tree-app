import { useEffect, useState } from "react";
import "./App.css";
import TreeMap from "./components/TreeMap";
import { supabase } from "./supabaseClient";
import EditTreeModal from "./components/EditTreeModal";
import AddTreeModal from "./components/AddTreeModal";
import { LocateFixed, MapPinPlus, Pencil, Menu, X } from "lucide-react";

function App() {
  const [trees, setTrees] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [editTree, setEditTree] = useState(null);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchParcels();
    fetchTrees();
  }, []);

  async function fetchParcels() {
    const { data, error } = await supabase.from("parcels").select("*");
    if (error) {
      console.error("Error fetching parcels:", error);
    } else {
      setParcels(data);
    }
  }

  async function addParcel(name) {
    const { data, error } = await supabase
      .from("parcels")
      .insert([{ name }])
      .select();
    if (error) {
      console.error("Error creating parcel:", error);
      alert("Failed to create parcel: " + error.message);
      return null;
    }
    await fetchParcels();
    return data[0];
  }

  async function fetchTrees() {
    const { data, error } = await supabase.from("trees").select("*");
    if (error) {
      console.error("Error fetching trees:", error);
    } else {
      setTrees(data);
    }
  }

  async function saveNewTree(name, parcelId) {
    if (!pendingLocation) return;

    const { error } = await supabase.from("trees").insert([
      {
        name,
        lat: pendingLocation.lat,
        lng: pendingLocation.lng,
        source: pendingLocation.source,
        parcel_id: parcelId,
      },
    ]);

    if (error) {
      console.error("Error saving tree:", error);
      alert("Failed to save tree: " + error.message);
    } else {
      fetchTrees();
    }
    setPendingLocation(null);
  }

  async function deleteTree(id) {
    const confirmed = confirm("Delete this tree? This cannot be undone.");
    if (!confirmed) return;

    const { error } = await supabase.from("trees").delete().eq("id", id);

    if (error) {
      console.error("Error deleting tree:", error);
      alert("Failed to delete tree: " + error.message);
    } else {
      if (selectedTree?.id === id) {
        setSelectedTree(null);
      }
      fetchTrees();
    }
  }

  async function updateTree(id, name, parcelId) {
    const result = await supabase
      .from("trees")
      .update({ name, parcel_id: parcelId })
      .eq("id", id);

    if (result.error) {
      console.error("Error while updating the entry", result.error);
      alert("Failed to update tree: " + result.error.message);
    } else {
      fetchTrees();
    }
  }

  function handleCenterOnMe() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          _t: Date.now(),
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  function handleAddTreeAtLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPendingLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          source: "gps",
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  function handleMapClick(latlng) {
    setPendingLocation({ lat: latlng.lat, lng: latlng.lng, source: "manual" });
    setIsAddMode(false);
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center px-3 sm:px-4 justify-between gap-2 shadow-sm z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-md transition-colors shrink-0"
          >
            <Menu size={20} />
          </button>
          <span className="text-xl leading-none shrink-0">🫒</span>
          <h1 className="text-base font-semibold text-gray-800 tracking-tight truncate">
            Olive Trees Tracker
          </h1>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleAddTreeAtLocation}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white px-2.5 sm:px-3 py-2 rounded-md text-xs font-medium transition-colors"
          >
            <LocateFixed size={14} />
            <span className="hidden sm:inline">Add at My Location</span>
          </button>

          <button
            onClick={() => setIsAddMode(!isAddMode)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              isAddMode
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
            }`}
          >
            <MapPinPlus size={14} />
            <span className="hidden sm:inline">
              {isAddMode ? "Click Map…" : "Add on Map"}
            </span>
          </button>

          <button
            onClick={handleCenterOnMe}
            title="Center on my location"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white w-9 h-9 rounded-md transition-colors"
          >
            <LocateFixed size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
          />
        )}

        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-gray-50 border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {trees.length} Tree{trees.length !== 1 ? "s" : ""} Tracked
            </p>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200"
            >
              <X size={16} />
            </button>
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
                className={`flex items-center gap-2 rounded-lg border transition-all group ${
                  selectedTree?.id === tree.id
                    ? "bg-green-700 border-green-700"
                    : "bg-white border-gray-200 hover:border-green-300 hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => {
                    setSelectedTree(tree);
                    setIsSidebarOpen(false);
                  }}
                  className="flex-1 flex items-center gap-2.5 text-left px-3 py-2.5 min-w-0"
                >
                  <span className="text-lg leading-none shrink-0">🫒</span>
                  <span
                    className={`truncate text-sm font-medium ${
                      selectedTree?.id === tree.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {tree.name}
                  </span>
                </button>

                <button
                  onClick={() => setEditTree(tree)}
                  title="Edit tree"
                  className={`shrink-0 mr-2 p-1.5 rounded-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all ${
                    selectedTree?.id === tree.id
                      ? "text-green-100 hover:text-white hover:bg-green-800"
                      : "text-gray-300 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Pencil size={13} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 relative">
          <TreeMap
            trees={trees}
            parcels={parcels}
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
            parcels={parcels}
            onClose={() => setEditTree(null)}
            onSave={updateTree}
            onDelete={deleteTree}
            onAddParcel={addParcel}
          />
        )}

        {pendingLocation && (
          <AddTreeModal
            location={pendingLocation}
            parcels={parcels}
            onSave={saveNewTree}
            onClose={() => setPendingLocation(null)}
            onAddParcel={addParcel}
          />
        )}
      </div>
    </div>
  );
}

export default App;
