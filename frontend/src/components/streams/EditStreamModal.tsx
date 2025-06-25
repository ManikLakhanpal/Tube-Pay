import Modal from "@/components/ui/PopupBox";
import { Button } from "@/components/ui/Button";

interface EditStreamModalProps {
  open: boolean;
  onClose: () => void;
  editForm: {
    title: string;
    description: string;
    streamLink: string;
    isLive: boolean;
  };
  setEditForm: (form: EditStreamModalProps["editForm"]) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  error: string;
  success: string;
  onDelete: () => void;
  deleting: boolean;
  onShowDelete: () => void;
}

export default function EditStreamModal({
  open,
  onClose,
  editForm,
  setEditForm,
  onSubmit,
  saving,
  error,
  success,
  deleting,
  onShowDelete,
}: EditStreamModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-xl text-black font-bold mb-2">Edit Stream</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full px-3 py-2 border text-black placeholder:text-gray-500 border-gray-300 rounded-md"
            placeholder="Stream Title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full px-3 py-2 border text-black placeholder:text-gray-500 border-gray-300 rounded-md"
            rows={2}
            placeholder="Stream Description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stream Link (YouTube, etc.)
          </label>
          <input
            type="url"
            value={editForm.streamLink}
            onChange={(e) => setEditForm({ ...editForm, streamLink: e.target.value })}
            className="w-full px-3 py-2 border text-black placeholder:text-gray-500 border-gray-300 rounded-md"
            placeholder="https://youtube.com/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={editForm.isLive ? "live" : "complete"}
            onChange={(e) => setEditForm({ ...editForm, isLive: e.target.value === "live" })}
            className="w-full px-3 py-2 border text-black placeholder:text-gray-500 border-gray-300 rounded-md"
          >
            <option value="live">Live</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="flex space-x-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={onShowDelete}
            disabled={deleting}
            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white hover:cursor-pointer"
          >
            Delete Stream
          </Button>
        </div>
      </form>
    </Modal>
  );
} 