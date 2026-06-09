import React from 'react';
import { Eye, Edit2, Trash2, ExternalLink, RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    aria-hidden="true"
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" 
    />
  </svg>
);

const DatasetTableRow = ({ dataset, onView, onEdit, onDelete, onRestore, isSelected, onSelectToggle }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Safe extraction of nested metadata fields
  const id = dataset.id || dataset._id;
  const instruction = dataset.instruction || '';
  const metaType = dataset.metadata?.type || 'unknown';
  const repoName = dataset.metadata?.repo_name || 'unknown';
  const filePath = dataset.metadata?.file_path || '';
  const url = dataset.metadata?.url || '';
  const isDeleted = dataset.isDeleted === true;

  // Extract file extension or name for display
  const getFileDisplay = () => {
    if (!filePath) return 'N/A';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  // Format type style badge
  const getTypeBadge = () => {
    switch (metaType.toLowerCase()) {
      case 'function':
      case 'function_implementation':
        return 'bg-[#58A6FF]/10 text-[#58A6FF] border-[#58A6FF]/20';
      case 'class':
      case 'class_implementation':
        return 'bg-[#bc8cff]/10 text-[#bc8cff] border-[#bc8cff]/20';
      case 'documentation':
        return 'bg-[#3FB950]/10 text-[#3FB950] border-[#3FB950]/20';
      case 'readme':
      case 'readme_based':
        return 'bg-[#f0883e]/10 text-[#f0883e] border-[#f0883e]/20';
      default:
        return 'bg-[#21262D] text-[#8b949e] border-[#30363D]';
    }
  };

  return (
    <tr className={`border-b border-[#30363D] hover:bg-[#161B22]/60 transition-colors group ${isDeleted ? 'opacity-50 bg-[#161B22]/10' : ''}`}>
      {/* Checkbox column */}
      <td className="px-4 py-3 align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectToggle && onSelectToggle(id)}
          className="h-3.5 w-3.5 rounded border-[#30363D] text-[#58A6FF] focus:ring-[#58A6FF]/20 outline-none transition-colors cursor-pointer bg-[#0D1117]"
        />
      </td>

      {/* Dataset ID badge */}
      <td className="px-4 py-3 align-middle font-mono text-[10px] font-bold text-[#8B949E]">
        #{id.substring(Math.max(0, id.length - 6))}
      </td>

      {/* Metadata classification type */}
      <td className="px-4 py-3 align-middle">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${getTypeBadge()}`}>
          {metaType.replace('_', ' ')}
        </span>
      </td>

      {/* Source Repository */}
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-1.5 max-w-[200px]">
          <GithubIcon className="w-3.5 h-3.5 text-[#8B949E] flex-shrink-0" />
          <span 
            onClick={() => navigate(`/explorer/${id}`)}
            className={`text-xs font-semibold truncate hover:underline hover:text-[#58A6FF] cursor-pointer ${isDeleted ? 'line-through text-[#8B949E]' : 'text-[#c9d1d9]'}`}
          >
            {repoName}
          </span>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B949E] hover:text-[#58A6FF] transition-colors flex-shrink-0"
              title="Open GitHub source"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </td>

      {/* Target file location */}
      <td className={`px-4 py-3 align-middle font-mono text-[10px] max-w-[120px] truncate ${isDeleted ? 'line-through text-[#8B949E]/60' : 'text-[#8B949E]'}`} title={filePath}>
        {getFileDisplay()}
      </td>

      {/* Instruction preview snippet */}
      <td className="px-4 py-3 align-middle">
        <p className={`text-xs line-clamp-1 max-w-[280px] ${isDeleted ? 'line-through text-[#8B949E]/70' : 'text-[#c9d1d9]'}`} title={instruction}>
          {instruction}
        </p>
      </td>

      {/* Operations column */}
      <td className="px-4 py-3 align-middle text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details */}
          <button
            onClick={() => navigate(`/explorer/${id}`)}
            className="p-1 rounded bg-[#21262D] text-[#8B949E] hover:text-[#58A6FF] border border-[#30363D] hover:border-[#8b949e] transition-colors cursor-pointer"
            title="View details page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Restore action visible to admin users if deleted */}
          {user && user.role === 'admin' && isDeleted && (
            <button
              onClick={() => onRestore && onRestore(id)}
              className="p-1 rounded bg-[#21262D] text-[#3FB950] hover:bg-[#3FB950]/10 border border-[#30363D] transition-colors cursor-pointer"
              title="Restore record"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit & Delete actions visible to logged in users when NOT deleted */}
          {user && !isDeleted && (
            <>
              <button
                onClick={() => onEdit(dataset)}
                className="p-1 rounded bg-[#21262D] text-[#d29922] hover:text-amber-400 border border-[#30363D] transition-colors cursor-pointer"
                title="Edit record"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1 rounded bg-[#21262D] text-[#F85149] hover:bg-rose-950/20 border border-[#30363D] transition-colors cursor-pointer"
                title="Delete record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default DatasetTableRow;
