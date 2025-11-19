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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-input" className="block text-sm font-medium text-gray-700 mb-1">Task content</label>
        <input
          id="task-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter task here"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <div>
        <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
        <input
          id="task-deadline"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <button type="submit" className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition duration-150 ease-in-out">
        <span>+ Add</span>
      </button>
    </form>
  );
}