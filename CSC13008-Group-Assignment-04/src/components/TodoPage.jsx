import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import TodoForm from './TodoForm';
import TodoTabs from './TodoTabs';
import TaskItem from './TaskItem';
import ConfirmModal from './ConfirmModal'; 
import appIcon from './icon.png';

export default function TodoPage() {
  // --- STATE DỮ LIỆU ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('active');

  // --- STATE CHO MODAL XÁC NHẬN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  useEffect(() => {
    // --- Cập nhật Title (như cũ) ---
    if (activeTab === 'active') {
      const pendingCount = tasks.filter(t => !t.completed && !t.isDeleted).length;
      document.title = pendingCount > 0 ? `(${pendingCount}) My Tasks` : "My Tasks";
    } else {
      document.title = "Trash";
    }

    // --- Cập nhật Icon (MỚI) ---
    // Tìm thẻ link icon trên trình duyệt
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      // Nếu chưa có thì tạo mới
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    // Gán đường dẫn từ file đã import
    link.href = appIcon;

  }, [activeTab, tasks]);

  // --- EFFECT LƯU LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => setTasks(prev => [...prev]), 60000);
    return () => clearInterval(timer);
  }, []);
  // --- CÁC HÀM XỬ LÝ ---
  const handleAddTask = (text, dueDate) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      isDeleted: false,
    };
    setTasks([newTask, ...tasks]);
    toast.success('Added new task!');
  };

  const handleEditTask = (id, newText, newDate) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, text: newText, dueDate: newDate } : t
    ));
    toast.success('Task updated!');
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  
  const moveToTrash = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isDeleted: true } : t));
    toast('Moved to trash', { icon: '🗑️' });
  };

  const restoreTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isDeleted: false } : t));
    toast.success('Task restored!');
  };
  
  // --- LOGIC MỚI: XÓA VĨNH VIỄN VỚI MODAL ĐẸP ---
  
  // 1. Hàm này được gọi khi bấm nút Xóa vĩnh viễn ở TaskItem
  const confirmDeleteForever = (id) => {
    setModalContent({
      title: 'Delete Task?',
      message: 'Are you sure you want to delete this task permanently? This action cannot be undone.'
    });
    // Lưu lại hành động xóa cụ thể vào state để Modal gọi sau
    setModalAction(() => () => {
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Deleted permanently');
    });
    setIsModalOpen(true);
  };
  
  // 2. Hàm này được gọi khi bấm nút Empty Trash
  const confirmEmptyTrash = () => {
    setModalContent({
      title: 'Empty Trash?',
      message: 'Warning: This will permanently delete ALL tasks in the trash.'
    });
    setModalAction(() => () => {
      setTasks(prev => prev.filter(t => !t.isDeleted));
      toast.success('Trash emptied');
    });
    setIsModalOpen(true);
  };

  const visibleTasks = tasks.filter(task => 
    activeTab === 'trash' ? task.isDeleted : !task.isDeleted
  );

  return (
    // RESPONSIVE FIX: p-3 (mobile) -> md:p-8 (desktop)
    <div className="min-h-screen bg-gray-50 p-3 md:p-8 font-sans flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction}
        title={modalContent.title}
        message={modalContent.message}
      />
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[85vh]">
        <div className="bg-blue-600 p-4 md:p-6 text-white flex justify-center items-center shadow-md flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide truncate">Task Management</h2>
        </div>

        <TodoTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'active' && <TodoForm onAdd={handleAddTask} />}

        {activeTab === 'trash' && visibleTasks.length > 0 && (
          <div className="p-3 bg-red-50 flex justify-end border-b border-red-100">
            <button onClick={confirmEmptyTrash} className="text-red-600 text-sm hover:underline font-medium flex items-center gap-1">
              <XCircle size={16}/> Empty Trash
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50/50">
          {visibleTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>{activeTab === 'active' ? 'No tasks available.' : 'Trash is empty.'}</p>
            </div>
          )}

          {visibleTasks.map((task) => (
            <TaskItem 
              key={task.id}
              task={task}
              activeTab={activeTab}
              onToggle={toggleTask}
              onEdit={handleEditTask}
              onTrash={moveToTrash}
              onRestore={restoreTask}
              onDeleteForever={confirmDeleteForever} 
            />
          ))}
        </div>
      </div>

      <footer className="mt-4 md:mt-6 text-center text-gray-400 text-xs md:text-sm font-medium pb-4 md:pb-0">
        &copy; 2025 HCMUS - Web Group Assignment 02
      </footer>

    </div>
  );
}