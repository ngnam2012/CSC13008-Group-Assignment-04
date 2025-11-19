import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';

export default function TodoForm({ onAdd }) {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input, dueDate);
    setInput('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100 bg-blue-50/30 flex flex-col gap-3">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Input your new task..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition shadow-sm">
          <Plus size={24} />
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600 bg-white w-fit px-3 py-1 rounded-lg border border-gray-200 text-sm">
        <Calendar size={16} className="text-blue-500"/>
        <span className="mr-2">Due:</span>
        <input 
          type="datetime-local" 
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="focus:outline-none text-gray-700 bg-transparent cursor-pointer"
        />
      </div>
    </form>
  );
}