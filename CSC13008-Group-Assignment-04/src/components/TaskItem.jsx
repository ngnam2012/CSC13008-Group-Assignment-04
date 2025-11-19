import { useState } from 'react'; // Thêm useState
import { Trash2, CheckCircle, Circle, RotateCcw, XCircle, AlertCircle, Pencil, Save, X } from 'lucide-react';

export default function TaskItem({ task, activeTab, onToggle, onEdit, onTrash, onRestore, onDeleteForever }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDate, setEditDate] = useState(task.dueDate ? task.dueDate.slice(0, 16) : '');

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate).getTime() < Date.now();

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText, editDate ? new Date(editDate).toISOString() : null);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditDate(task.dueDate ? task.dueDate.slice(0, 16) : '');
    setIsEditing(false);
  };

  const cardBase = `p-3 mb-5 rounded-xl shadow-md border-2 transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg`;
  const cardStateClass = task.completed
    ? 'bg-gradient-to-br from-emerald-50/70 to-emerald-100/50 text-slate-500 ring-emerald-200 border-emerald-300'
    : isOverdue
      ? 'bg-gradient-to-br from-rose-500/90 to-rose-600/80 text-white ring-rose-300/60 border-rose-400'
      : 'bg-gradient-to-br from-white/60 to-slate-50/70 text-slate-900 ring-slate-200 border-slate-200';

  return (
    <div className={`${cardBase} ${cardStateClass}`}>
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
        <div className="flex items-center justify-between">
          <div className={`${task.completed ? 'line-through text-gray-400' : ''}`}>
            <span className="task-title block text-lg font-medium">{task.text}</span>
            <span className="task-deadline text-sm">
              {task.dueDate ? new Date(task.dueDate).toLocaleString('vi-VN') : ''}
            </span>
          </div>

          <div className="flex gap-4 md:gap-5 items-center">
            {activeTab === 'active' && (
              <>
                <button
                  onClick={() => onToggle(task.id)}
                  className={`btn-toggle text-sm md:text-base px-2 py-1 rounded ring-1 ring-inset transition-all duration-200 ${isOverdue ? 'bg-rose-700 text-white font-semibold ring-rose-300 md:hover:bg-rose-600' : task.completed ? 'bg-emerald-500 text-white ring-emerald-300 md:hover:bg-emerald-600' : 'bg-slate-200 text-slate-900 ring-slate-300 md:hover:bg-slate-300'}`}
                >
                  {isOverdue ? 'Overdue' : task.completed ? 'Checked' : 'Pending'}
                </button>

                <button onClick={() => onTrash(task.id)} className="btn-delete text-sm md:text-base px-2 py-1 rounded bg-white/10 backdrop-blur-md md:hover:bg-white/60 ring-1 ring-inset ring-slate-300/70 shadow md:hover:shadow-md">
                  🗑️
                </button>
              </>
            )}

            {activeTab === 'trash' && (
              <>
                <button onClick={() => onRestore(task.id)} className="btn-restore text-sm md:text-base px-2 py-1 rounded bg-emerald-500 text-white ring-1 ring-inset ring-emerald-300 border-2 border-emerald-800 shadow md:hover:bg-emerald-600">
                  Restore
                </button>
                <button onClick={() => onDeleteForever(task.id)} className="btn-harddelete text-sm md:text-base px-2 py-1 rounded bg-rose-600 border-2 border-rose-900 text-white ring-1 ring-inset ring-rose-300 shadow md:hover:bg-rose-700">
                  Delete forever
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}