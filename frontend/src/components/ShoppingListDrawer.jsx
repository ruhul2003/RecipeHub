'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Check,
  Trash2,
  X,
  Plus,
  Copy,
  CheckCheck,
  ListTodo,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShoppingListDrawer({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  // Load from localStorage on mount or open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('recipehub_shopping_list');
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load shopping list', e);
      }
    }
  }, [isOpen]);

  // Sync to localStorage
  const saveItems = (updated) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recipehub_shopping_list', JSON.stringify(updated));
    }
  };

  const handleToggleCheck = (id) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveItems(updated);
  };

  const handleDeleteItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name: newItemText.trim(),
      checked: false,
      addedAt: new Date().toISOString(),
    };
    saveItems([newItem, ...items]);
    setNewItemText('');
  };

  const handleClearCompleted = () => {
    const updated = items.filter((item) => !item.checked);
    saveItems(updated);
    toast.success('Completed items cleared!');
  };

  const handleCopyList = () => {
    if (items.length === 0) {
      return toast.error('Shopping list is empty.');
    }
    const text = items
      .map((item) => `[${item.checked ? 'x' : ' '}] ${item.name}`)
      .join('\n');
    navigator.clipboard.writeText(`RecipeHub Grocery List:\n\n${text}`);
    toast.success('Shopping list copied to clipboard!');
  };

  const checkedCount = items.filter((i) => i.checked).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Grocery Checklist</h3>
                <p className="text-xs text-slate-400 font-medium">
                  {items.length > 0
                    ? `${checkedCount} of ${items.length} items collected`
                    : 'Manage ingredients to buy'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          {items.length > 0 && (
            <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={handleCopyList}
                className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 font-bold transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Checklist</span>
              </button>

              {checkedCount > 0 && (
                <button
                  onClick={handleClearCompleted}
                  className="flex items-center space-x-1 text-rose-500 hover:text-rose-600 font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Checked ({checkedCount})</span>
                </button>
              )}
            </div>
          )}

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add ingredient e.g. 2 tbsp olive oil..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ListTodo className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700 stroke-1" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Your shopping list is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Click &quot;Add to Shopping List&quot; on any recipe details page or type ingredients above!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    item.checked
                      ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-400'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        item.checked
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-amber-500'
                      }`}
                    >
                      {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm font-semibold truncate ${
                        item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
