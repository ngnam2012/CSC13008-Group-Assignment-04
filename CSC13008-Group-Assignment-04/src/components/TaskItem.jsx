import { useState } from 'react';
import { Trash2, RotateCcw, Pencil, Save, X } from 'lucide-react';

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
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="border border-blue-300 rounded p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoFocus
            placeholder="Enter task content..."
          />
          <div className="flex items-center gap-2 justify-between">
            <input
              type="datetime-local"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border border-gray-200 rounded p-1 text-sm text-gray-600 focus:outline-none"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSave} 
                className="bg-white/80 p-1.5 rounded hover:bg-green-100 text-green-600 shadow-sm transition"
                title="Save changes"
              >
                <Save size={18} />
              </button>
              <button 
                onClick={handleCancel} 
                className="bg-white/80 p-1.5 rounded hover:bg-red-100 text-red-500 shadow-sm transition"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className={`flex-1 min-w-0 ${task.completed ? 'line-through opacity-75' : ''}`}>
            <span className="task-title block text-lg font-medium break-words">{task.text}</span>
            <span className={`task-deadline text-xs md:text-sm ${isOverdue ? 'font-bold' : 'opacity-80'}`}>
              {task.dueDate ? new Date(task.dueDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : ''}
            </span>
          </div>

          <div className="flex gap-2 md:gap-3 items-center shrink-0">
            {activeTab === 'active' && (
              <>
                <button
                  onClick={() => onToggle(task.id)}
                  className={`btn-toggle text-xs md:text-sm px-2 py-1.5 rounded ring-1 ring-inset transition-all duration-200 font-medium
                    ${isOverdue 
                      ? 'bg-rose-700 text-white ring-rose-300 hover:bg-rose-800' 
                      : task.completed 
                        ? 'bg-emerald-500 text-white ring-emerald-300 hover:bg-emerald-600' 
                        : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-100'
                    }`}
                  title="Toggle status"
                >
                  {task.completed ? 'Checked' : isOverdue ? 'Overdue' : 'Pending'}
                </button>

                {!task.completed && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-edit p-1.5 rounded bg-white/20 hover:bg-blue-500 hover:text-white text-current ring-1 ring-inset ring-black/10 transition-all shadow-sm"
                    title="Edit task"
                  >
                    <Pencil size={16} />
                  </button>
                )}

                <button 
                  onClick={() => onTrash(task.id)} 
                  className="btn-delete p-1.5 rounded bg-white/20 hover:bg-red-500 hover:text-white text-current ring-1 ring-inset ring-black/10 transition-all shadow-sm"
                  title="Move to trash"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}

            {activeTab === 'trash' && (
              <>
                <button 
                  onClick={() => onRestore(task.id)} 
                  className="btn-restore text-xs md:text-sm px-2 py-1 rounded bg-emerald-500 text-white ring-1 ring-inset ring-emerald-300 shadow hover:bg-emerald-600"
                  title="Restore task"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => onDeleteForever(task.id)} 
                  className="btn-harddelete text-xs md:text-sm px-2 py-1 rounded bg-rose-600 text-white ring-1 ring-inset ring-rose-300 shadow hover:bg-rose-700"
                  title="Delete permanently"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}