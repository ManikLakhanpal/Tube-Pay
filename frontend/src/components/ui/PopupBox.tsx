export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/80"
      style={{ touchAction: "none" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-11/12 max-w-xs sm:max-w-md relative z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}