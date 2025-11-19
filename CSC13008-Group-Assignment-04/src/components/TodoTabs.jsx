import { Trash2 } from 'lucide-react';

export default function TodoTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-gray-200 bg-gray-50">
      <button 
        onClick={() => setActiveTab('active')}
        className={`flex-1 py-3 font-medium text-sm transition ${
          activeTab === 'active' 
            ? 'bg-white text-blue-600 border-t-2 border-blue-600' 
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        Tasks
      </button>
      <button 
        onClick={() => setActiveTab('trash')}
        className={`flex-1 py-3 font-medium text-sm transition flex items-center justify-center gap-2 ${
          activeTab === 'trash' 
            ? 'bg-white text-red-500 border-t-2 border-red-500' 
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <Trash2 size={16} /> Trash 
      </button>
    </div>
  );
}