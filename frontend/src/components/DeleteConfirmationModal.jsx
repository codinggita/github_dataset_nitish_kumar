import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, id, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-2xl flex flex-col justify-between animate-fade-in duration-200">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Indicator */}
        <div className="flex items-start gap-4 mt-2">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100">Delete Dataset</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Are you sure you want to delete dataset record <span className="font-mono font-bold text-slate-600 dark:text-slate-300">#{id}</span>? 
              This will perform a soft-delete and mark it as inactive.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-200/60 dark:border-dark-border transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-500/10 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
