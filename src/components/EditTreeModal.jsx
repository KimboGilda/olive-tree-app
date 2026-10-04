import { useState } from "react";
import { TreePine, Trash2, X, Plus } from "lucide-react";

function EditTreeModal({
  tree,
  parcels,
  onSave,
  onClose,
  onDelete,
  onAddParcel,
}) {
  const [name, setName] = useState(tree.name);
  const [parcelId, setParcelId] = useState(tree.parcel_id);

  function handleSave() {
    if (!name.trim()) {
      return;
    }
    onSave(tree.id, name.trim(), parcelId);
    onClose();
  }

  async function handleNewParcel() {
    const name = prompt("New parcel name:");
    if (!name) return;
    const created = await onAddParcel(name);
    if (created) {
      setParcelId(created.id);
    }
  }

  function handleDelete() {
    onDelete(tree.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TreePine size={18} className="text-green-700" />
            <h2 className="text-base font-semibold text-gray-800">Edit Tree</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow"
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

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>

          <div className="flex gap-2">
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
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTreeModal;
