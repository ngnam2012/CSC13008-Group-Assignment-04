import { useState } from 'react'; // Thêm useState
import { Trash2, CheckCircle, Circle, RotateCcw, XCircle, AlertCircle, Pencil, Save, X } from 'lucide-react';

export default function TaskItem({ task, activeTab, onToggle, onEdit, onTrash, onRestore, onDeleteForever }) {
  // State cho chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  // Chuyển đổi ngày ISO sang định dạng datetime-local (yyyy-MM-ddThh:mm) để hiển thị trong input
  const [editDate, setEditDate] = useState(task.dueDate ? task.dueDate.slice(0, 16) : '');

  const getStatus = () => {
    if (task.completed) return 'completed';
    if (task.dueDate && new Date(task.dueDate) < new Date()) return 'expired';
    return 'pending';
  };
  const status = getStatus();

  // Hàm lưu sau khi sửa
  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText, editDate ? new Date(editDate).toISOString() : null);
      setIsEditing(false);
    }
  };

  // Hàm hủy sửa (quay về giá trị cũ)
  const handleCancel = () => {
    setEditText(task.text);
    setEditDate(task.dueDate ? task.dueDate.slice(0, 16) : '');
    setIsEditing(false);
  };

  return (
    <div className={`flex flex-col p-4 rounded-xl border shadow-sm transition-all bg-white
      ${status === 'completed' ? 'opacity-60 bg-gray-50' : ''}
      ${status === 'expired' && !task.isDeleted && !isEditing ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}
    `}>
      {/* === CHẾ ĐỘ CHỈNH SỬA (EDIT MODE) === */}
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <input 
              type="datetime-local"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border border-gray-200 rounded p-1 text-sm text-gray-600"
            />
            <div className="flex-1 flex justify-end gap-2">
              <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1 rounded">
                <Save size={20} />
              </button>
              <button onClick={handleCancel} className="text-red-500 hover:bg-red-50 p-1 rounded">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1">
            {activeTab === 'active' && (
              <button 
                onClick={() => onToggle(task.id)} 
                className={`mt-1 ${status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
              >
                {status === 'completed' ? <CheckCircle size={24} fill="currentColor" className="bg-white rounded-full" /> : <Circle size={24} />}
              </button>
            )}

            <div className="flex flex-col">
              <span className={`text-lg font-medium ${status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.text}
              </span>
              
              <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                {status === 'expired' && !task.isDeleted && (
                  <span className="text-red-500 flex items-center gap-1">
                    <AlertCircle size={12}/> Expired
                  </span>
                )}
                {task.dueDate && (
                  <span className={`${status === 'expired' && !task.isDeleted ? 'text-red-400' : 'text-blue-400'}`}>
                    {new Date(task.dueDate).toLocaleString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CÁC NÚT HÀNH ĐỘNG */}
          <div className="flex items-center gap-1">
            {activeTab === 'active' ? (
              <>
                {/* Nút Sửa (Chỉ hiện khi ở tab active và chưa hoàn thành) */}
                {!task.completed && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                )}
                <button 
                  onClick={() => onTrash(task.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                  title="Add to trash"
                >
                  <Trash2 size={20} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onRestore(task.id)}
                  className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                  title="Restore task"
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={() => onDeleteForever(task.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                  title="Permantly delete"
                >
                  <XCircle size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}