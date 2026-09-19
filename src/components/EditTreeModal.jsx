import { useState } from 'react'
import { TreePine, Trash2, X } from 'lucide-react'

function EditTreeModal({ tree, onSave, onClose, onDelete }) {
    const [name, setName] = useState(tree.name)

    function handleSave() {
        if (!name.trim()) {
            return
        }
        onSave(tree.id, name.trim())
        onClose()
    }

    function handleDelete() {
        onDelete(tree.id)
        onClose()
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
    )
}

export default EditTreeModal