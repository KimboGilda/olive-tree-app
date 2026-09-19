import { useState } from 'react';


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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-lg shadow-lg p-5 w-80">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Edit Tree</h2>

                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                <div className="flex justify-between items-center">
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1.5 text-sm rounded-md bg-red-700 hover:bg-red-800 text-white"
                    >
                        Delete
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm rounded-md bg-gray-500 hover:bg-gray-800 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 py-1.5 text-sm rounded-md bg-green-700 hover:bg-green-800 text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTreeModal;