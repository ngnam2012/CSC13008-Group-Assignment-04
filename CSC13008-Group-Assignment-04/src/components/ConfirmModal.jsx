import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>

        {/* Body */}
        <p className="text-gray-600 mb-6 ml-1">
          {message}
        </p>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-white font-bold bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition flex items-center gap-2"
          >
            Xác nhận xóa
          </button>
        </div>
        
        {/* Close Button Top Right */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}