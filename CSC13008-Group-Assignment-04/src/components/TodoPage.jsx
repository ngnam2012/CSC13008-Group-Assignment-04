import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import TodoForm from './TodoForm';
import TodoTabs from './TodoTabs';
import TaskItem from './TaskItem';
import ConfirmModal from './ConfirmModal'; 
import appIcon from './icon.png';

export default function TodoPage() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('active');

  // Confirmation modal state — store a simple payload when asking for confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPayload, setModalPayload] = useState(null); 
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  useEffect(() => {
    //Update document title (same behavior as before)
    if (activeTab === 'active') {
      const pendingCount = tasks.filter(t => !t.completed && !t.isDeleted).length;
      document.title = pendingCount > 0 ? `(${pendingCount}) My Tasks` : "My Tasks";
    } else {
      document.title = "Trash";
    }

    // Find existing favicon link element in the document
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      // Create it if not present
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    // Assign the imported icon path
    link.href = appIcon;

  }, [activeTab, tasks]);

  // Effect: persist tasks to localStorage 
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => setTasks(prev => [...prev]), 60000);
    return () => clearInterval(timer);
  }, []);
  //Handler functions
  const handleAddTask = (text, dueDate) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      isDeleted: false,
    };
    setTasks([newTask, ...tasks]);
    toast.success('Đã thêm task');
  };

  const handleEditTask = (id, newText, newDate) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, text: newText, dueDate: newDate } : t
    ));
    toast.success('Cập nhật task thành công');
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  
  const moveToTrash = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isDeleted: true } : t));
    toast('Đã chuyển vào thùng rác', { icon: '🗑️' });
  };

  const restoreTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isDeleted: false } : t));
    toast.success('Đã khôi phục task');
  };
  
  // New logic: confirm before permanently deleting items
  // Called when clicking 'Delete forever' in a TaskItem
  const confirmDeleteForever = (id) => {
    setModalContent({
      title: 'Delete Task?',
      message: 'Are you sure you want to delete this task permanently? This action cannot be undone.'
    });
    // Store a small payload so the modal can trigger the correct action
    setModalPayload({ type: 'deleteForever', id });
    setIsModalOpen(true);
  };

  // Called when clicking 'Empty Trash' (empty all trashed tasks)
  const confirmEmptyTrash = () => {
    setModalContent({
      title: 'Empty Trash?',
      message: 'Warning: This will permanently delete ALL tasks in the trash.'
    });
    setModalPayload({ type: 'emptyTrash' });
    setIsModalOpen(true);
  };

  // Handler invoked when the modal confirm button is clicked
  const handleModalConfirm = () => {
    if (!modalPayload) return;
    if (modalPayload.type === 'deleteForever') {
      setTasks(prev => prev.filter(t => t.id !== modalPayload.id));
      toast.success('Deleted permanently');
    } else if (modalPayload.type === 'emptyTrash') {
      setTasks(prev => prev.filter(t => !t.isDeleted));
      toast.success('Trash emptied');
    }
    setIsModalOpen(false);
    setModalPayload(null);
  };

  // Filter then sort by deadline (earliest first). Tasks without deadline go last.
  const visibleTasks = tasks
    .filter(task => (activeTab === 'trash' ? task.isDeleted : !task.isDeleted))
    .slice()
    .sort((a, b) => {
      const aTime = a.dueDate ? Date.parse(a.dueDate) : Infinity;
      const bTime = b.dueDate ? Date.parse(b.dueDate) : Infinity;
      return aTime - bTime;
    });

  return (
    // RESPONSIVE FIX: p-3 (mobile) -> md:p-8 (desktop)
    <div className="min-h-screen bg-gray-50 p-3 md:p-8 font-sans flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        title={modalContent.title}
        message={modalContent.message}
      />

      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-gray-900">TODO App</h1>

          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('active')}
              data-active={activeTab === 'active'}
              className="nav-link text-gray-500 hover:text-blue-600 transition duration-150 ease-in-out flex items-center px-1"
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              data-active={activeTab === 'trash'}
              className="nav-link text-gray-500 hover:text-red-600 transition duration-150 ease-in-out flex items-center px-1"
            >
              Trash
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Add task section (matches index.html styling) */}
        {activeTab === 'active' && (
          <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add new task</h2>
            <TodoForm onAdd={handleAddTask} />
          </section>
        )}

        {/* List section */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 id="list-title" className="text-2xl font-semibold text-gray-800">Task list</h2>
            <p id="task-guide" className="text-sm text-slate-400 text-center mt-2">
              {activeTab === 'active' ? 'Click status to change • Click 🗑️ to delete task' : ''}
            </p>
          </div>

          <ul id="task-list" className="space-y-3">
            {visibleTasks.length === 0 ? (
              <div id="empty-state" className="text-center p-10 bg-white rounded-xl shadow-inner text-slate-500 font-medium">
                {activeTab === 'active' ? 'Nothing to show' : 'Trash is empty.'}
              </div>
            ) : (
              visibleTasks.map((task) => (
                <li key={task.id}>
                  <TaskItem 
                    task={task}
                    activeTab={activeTab}
                    onToggle={toggleTask}
                    onEdit={handleEditTask}
                    onTrash={moveToTrash}
                    onRestore={restoreTask}
                    onDeleteForever={confirmDeleteForever} 
                  />
                </li>
              ))
            )}
          </ul>

          {activeTab === 'trash' && visibleTasks.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button onClick={confirmEmptyTrash} className="text-red-600 text-sm hover:underline font-medium flex items-center gap-1">
                <XCircle size={16}/> Empty Trash
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-4 md:mt-6 text-center text-gray-400 text-xs md:text-sm font-medium pb-4 md:pb-0">
        &copy; 2025 HCMUS | GA04 - TODO App with React.js
      </footer>
    
    </div>
  );
}