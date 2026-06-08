import React, { useState } from 'react';
import { Edit, X } from 'lucide-react';

const BulkUpdateModal = ({ isOpen, onClose, onConfirm, selectedCount, loading }) => {
  const [field, setField] = useState('type');
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleFieldChange = (e) => {
    const selectedField = e.target.value;
    setField(selectedField);
    // Reset or set default value based on field
    if (selectedField === 'type') {
      setValue('function');
    } else {
      setValue('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onConfirm({ field, value });
  };

  // Field display labels
  const fields = [
    { label: 'Classification Type', value: 'type' },
    { label: 'Programming Language', value: 'language' },
    { label: 'Framework', value: 'framework' },
    { label: 'Category', value: 'category' },
    { label: 'Source Type / Platform', value: 'source' },
    { label: 'Repository Name', value: 'repo_name' }
  ];

  // Options for classification type
  const typeOptions = [
    { label: 'Function', value: 'function' },
    { label: 'Class', value: 'class' },
    { label: 'Readme', value: 'readme' },
    { label: 'Documentation', value: 'documentation' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <form 
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-2xl flex flex-col justify-between animate-fade-in duration-200"
      >
        {/* Close button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Edit Icon & Title */}
        <div className="flex items-start gap-4 mt-2">
          <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-950/20 text-brand-500 flex items-center justify-center flex-shrink-0">
            <Edit className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100">Bulk Update</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Modifying <span className="font-bold text-brand-600 dark:text-brand-400">{selectedCount}</span> selected dataset records. 
              Choose the metadata field to overwrite.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Field
            </label>
            <select
              value={field}
              onChange={handleFieldChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-slate-700 dark:text-slate-300"
            >
              {fields.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              New Value
            </label>
            {field === 'type' ? (
              <select
                value={value || 'function'}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-slate-700 dark:text-slate-300"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="Enter value..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-slate-700 dark:text-slate-300"
              />
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-200/60 dark:border-dark-border transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-500/10 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? 'Updating...' : 'Apply Bulk Update'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default BulkUpdateModal;
