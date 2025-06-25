import Modal from "@/components/ui/PopupBox";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  deleting: boolean;
  error: string;
}

export default function DeleteConfirmModal({ open, onClose, onDelete, deleting, error }: DeleteConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl text-black font-bold mb-2">Delete Stream?</h2>
        <p className="text-gray-700">
          Are you sure you want to delete this stream? This action cannot be undone.
        </p>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onDelete}
            disabled={deleting}
            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white hover:cursor-pointer"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
} 