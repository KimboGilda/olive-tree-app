import { useState } from "react";
import { TreePine, X, Plus } from "lucide-react";

function AddTreeModal({ location, parcels, onSave, onClose, onAddParcel }) {
  const [name, setName] = useState("");
  const [parcelId, setParcelId] = useState(null);

  function handleSave() {
    if (!name.trim()) {
      return;
    }
    onSave(name.trim(), parcelId);
    onClose();
  }

  async function handleNewParcel() {
    const newName = prompt("New parcel name:");
    if (!newName) return;
    const created = await onAddParcel(newName);
    if (created) {
      setParcelId(created.id);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TreePine size={18} className="text-green-700" />
            <h2 className="text-base font-semibold text-gray-800">New Tree</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 mb-3">
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </p>

          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder="e.g. Kapraleika"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Parcel
            </label>
            <div className="flex gap-2">
              <select
                value={parcelId ?? ""}
                onChange={(e) =>
                  setParcelId(e.target.value ? Number(e.target.value) : null)
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">No parcel</option>
                {parcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleNewParcel}
                title="New parcel"
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-2 text-sm font-medium rounded-lg bg-green-700 hover:bg-green-800 text-white transition-colors shadow-sm"
          >
            Save Tree
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTreeModal;
