import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchDatasets, 
  setPage, 
  setLimit, 
  setSearchQuery, 
  setSort, 
  deleteDataset, 
  restoreDataset, 
  bulkDeleteDatasets, 
  bulkRestoreDatasets, 
  bulkUpdateDatasets 
} from '../store/datasetSlice';
import DatasetTableRow from '../components/DatasetTableRow';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import BulkUpdateModal from '../components/BulkUpdateModal';
import ImportExportManager from '../components/ImportExportManager';
import FilterSidebar from '../components/FilterSidebar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  RefreshCw, 
  Search, 
  ArrowUpDown,
  Grid,
  List,
  Star,
  GitFork,
  Calendar,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { showNotification } from '../store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const DatasetsExplorer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items, loading, error, page, limit, totalResults, sort, searchQuery, filters } = useSelector((state) => state.datasets);
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  // Local favorites state to reflect starring in explorer instantly
  const [localFavorites, setLocalFavorites] = useState([]);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [isBulkDeleteHard, setIsBulkDeleteHard] = useState(false);

  // Bulk edit modal state
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  const [searchVal, setSearchVal] = useState(searchQuery);

  // Load favorites
  const loadFavs = () => {
    const list = JSON.parse(localStorage.getItem('favorites') || '[]');
    setLocalFavorites(list);
  };

  useEffect(() => {
    loadFavs();
  }, []);

  // Synchronize local search input with store search query
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  // Debounced search query dispatcher
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchVal !== searchQuery) {
        dispatch(setSearchQuery(searchVal));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal, searchQuery, dispatch]);

  // Fetch datasets when query dependencies change
  useEffect(() => {
    dispatch(fetchDatasets());
    setSelectedIds([]); // Clear selection when fetching new data
  }, [
    dispatch,
    page,
    limit,
    sort,
    searchQuery,
    filters.type,
    filters.repo,
    filters.source,
    filters.docType,
    filters.language,
    filters.framework,
    filters.category,
    filters.deleted
  ]);

  // Handle page changes
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(totalResults / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  // Handle items limit change
  const handleLimitChange = (e) => {
    dispatch(setLimit(Number(e.target.value)));
  };

  // Handle sorting option change
  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
  };

  // Select/Deselect individual rows
  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select/Deselect all rows
  const handleSelectAllToggle = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id || item._id));
    }
  };

  const handleEditRecord = (dataset) => {
    navigate(`/explorer/${dataset.id || dataset._id}/edit`);
  };

  const handleDeleteRecord = (id) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      dispatch(deleteDataset(deleteTargetId))
        .unwrap()
        .then(() => {
          dispatch(showNotification({ message: 'Dataset soft-deleted successfully', type: 'success' }));
          setIsDeleteOpen(false);
          setDeleteTargetId(null);
          dispatch(fetchDatasets());
        })
        .catch((err) => {
          dispatch(showNotification({ message: err || 'Failed to delete dataset', type: 'error' }));
        });
    }
  };

  const handleRestoreRecord = (id) => {
    dispatch(restoreDataset(id))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ message: 'Dataset restored successfully', type: 'success' }));
        dispatch(fetchDatasets());
      })
      .catch((err) => {
        dispatch(showNotification({ message: err || 'Failed to restore dataset', type: 'error' }));
      });
  };

  const handleBulkDeleteTrigger = (hard = false) => {
    setIsBulkDelete(true);
    setIsBulkDeleteHard(hard);
    setIsDeleteOpen(true);
  };

  const handleBulkDeleteConfirmAction = () => {
    dispatch(bulkDeleteDatasets({ ids: selectedIds, hard: isBulkDeleteHard }))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ 
          message: `${selectedIds.length} datasets ${isBulkDeleteHard ? 'permanently' : 'soft'} deleted successfully`, 
          type: 'success' 
        }));
        setIsDeleteOpen(false);
        setIsBulkDelete(false);
        setIsBulkDeleteHard(false);
        setSelectedIds([]);
        dispatch(fetchDatasets());
      })
      .catch((err) => {
        dispatch(showNotification({ message: err || 'Failed bulk delete operation', type: 'error' }));
      });
  };

  const handleBulkRestore = () => {
    dispatch(bulkRestoreDatasets(selectedIds))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ 
          message: `${selectedIds.length} datasets restored successfully`, 
          type: 'success' 
        }));
        setSelectedIds([]);
        dispatch(fetchDatasets());
      })
      .catch((err) => {
        dispatch(showNotification({ message: err || 'Failed bulk restore operation', type: 'error' }));
      });
  };

  const handleBulkUpdateConfirm = ({ field, value }) => {
    const updateField = ['type', 'language', 'framework', 'category', 'source', 'repo_name'].includes(field)
      ? `metadata.${field}`
      : field;

    const updates = selectedIds.map(id => ({
      id,
      [updateField]: value
    }));

    dispatch(bulkUpdateDatasets({ updates }))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ 
          message: `Bulk update applied to ${selectedIds.length} datasets`, 
          type: 'success' 
        }));
        setIsBulkEditOpen(false);
        setSelectedIds([]);
        dispatch(fetchDatasets());
      })
      .catch((err) => {
        dispatch(showNotification({ message: err || 'Failed bulk update operation', type: 'error' }));
      });
  };

  // Toggle favorite / star locally in Explorer
  const handleToggleFavorite = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
      dispatch(showNotification({ message: 'Removed from favorites', type: 'info' }));
    } else {
      updated = [...favorites, id];
      dispatch(showNotification({ message: 'Added to favorites', type: 'success' }));
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
    setLocalFavorites(updated);
  };

  // Helper colors for languages
  const getLanguageColor = (filePath) => {
    if (!filePath) return 'bg-[#8b949e]';
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py': return 'bg-[#3572A5]';
      case 'js': case 'jsx': return 'bg-[#f1e05a]';
      case 'ts': case 'tsx': return 'bg-[#3178c6]';
      case 'html': return 'bg-[#e34c26]';
      case 'css': return 'bg-[#563d7c]';
      case 'md': return 'bg-[#083fa1]';
      case 'json': return 'bg-[#29b6f6]';
      default: return 'bg-[#8b949e]';
    }
  };

  const getLanguageName = (filePath) => {
    if (!filePath) return 'Unknown';
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py': return 'Python';
      case 'js': case 'jsx': return 'JavaScript';
      case 'ts': case 'tsx': return 'TypeScript';
      case 'html': return 'HTML';
      case 'css': return 'CSS';
      case 'md': return 'Markdown';
      case 'json': return 'JSON';
      default: return ext.toUpperCase();
    }
  };

  const totalPages = Math.ceil(totalResults / limit) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#30363D] pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F0F6FC]">Datasets Explorer</h1>
          <p className="text-[#8B949E] text-sm">
            Inspect, search, and manage repository codebase dataset training pairs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <button
                onClick={() => navigate('/explorer/new')}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs rounded-lg transition-all cursor-pointer border border-[rgba(240,246,252,0.1)] shadow-sm"
              >
                Add Dataset
              </button>
              <button
                onClick={() => setIsImportExportOpen(true)}
                className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#c9d1d9] font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                Import / Export
              </button>
            </>
          )}
          <button
            onClick={() => dispatch(fetchDatasets())}
            disabled={loading}
            className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#c9d1d9] font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* 2. Main content split layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Filter Sidebar */}
        <FilterSidebar />

        {/* Right Side: Primary Datasets Panel */}
        <div className="flex-1 bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
          
          {/* View Toggles & Search Bar controls */}
          <div className="p-4 border-b border-[#30363D] bg-[#161B22] flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Left controls: Search Input & Selection count */}
            <div className="flex items-center gap-3 w-full sm:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                <input
                  type="text"
                  placeholder="Filter instructions, files, repositories..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-[#F0F6FC] placeholder-[#8B949E] outline-none focus:border-[#58A6FF] transition-all font-semibold"
                />
                {searchVal && (
                  <button 
                    onClick={() => setSearchVal('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-[#F0F6FC] text-xs font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* View mode toggle */}
              <div className="flex items-center border border-[#30363D] rounded-lg overflow-hidden bg-[#21262D]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#30363D] text-[#58A6FF]' : 'text-[#8B949E] hover:text-[#c9d1d9]'}`}
                  title="Grid cards layout"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 cursor-pointer transition-colors ${viewMode === 'table' ? 'bg-[#30363D] text-[#58A6FF]' : 'text-[#8B949E] hover:text-[#c9d1d9]'}`}
                  title="List table layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right controls: Sorting Select */}
            <div className="flex items-center gap-2 text-xs font-semibold w-full sm:w-auto justify-end">
              <span className="text-[#8B949E] flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
              </span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="px-2.5 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-lg outline-none text-[#c9d1d9] focus:border-[#58A6FF] transition-colors cursor-pointer text-xs font-semibold"
              >
                <option value="">Default (ID Ascending)</option>
                <option value="-id">ID (Descending)</option>
                <option value="repo">Repo Name (A-Z)</option>
                <option value="-repo">Repo Name (Z-A)</option>
                <option value="type">Type (A-Z)</option>
                <option value="-type">Type (Z-A)</option>
                <option value="language">File Path (A-Z)</option>
                <option value="-language">File Path (Z-A)</option>
              </select>
            </div>

          </div>

          {/* Grid Selection Actions checkbox header */}
          <div className="px-5 py-3 border-b border-[#30363D] bg-[#161B22] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={items.length > 0 && selectedIds.length === items.length}
                onChange={handleSelectAllToggle}
                className="h-3.5 w-3.5 rounded border-[#30363D] text-[#58A6FF] focus:ring-[#58A6FF]/20 outline-none transition-colors cursor-pointer bg-[#0D1117]"
              />
              <span className="text-xs font-semibold text-[#8B949E]">
                Select All {items.length > 0 && `(${selectedIds.length} of ${items.length} selected)`}
              </span>
            </div>
            
            <div className="text-[10px] font-mono text-[#8B949E]">
              Total Results: {totalResults.toLocaleString()}
            </div>
          </div>

          {/* MAIN DYNAMIC LISTING */}
          {loading ? (
            /* Skeleton Loading rows/cards */
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 p-5' : 'space-y-3 p-4'}>
              {Array.from({ length: viewMode === 'grid' ? 6 : 8 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#21262D] border border-[#30363D] p-5 rounded-xl h-36 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-[#30363D] rounded w-1/3" />
                  <div className="h-3 bg-[#30363D] rounded w-2/3" />
                  <div className="h-3 bg-[#30363D] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-[#21262D] border border-[#30363D] text-[#8B949E] flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#F0F6FC]">No Datasets Found</h3>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  We couldn't find any datasets matching your active filters. Try adjusting your sidebar selections or clear the search criteria.
                </p>
              </div>
            </div>
          ) : (
            viewMode === 'grid' ? (
              /* GitHub Repository Card Grid View (Default) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-5 bg-[#0D1117]/40">
                {items.map((dataset) => {
                  const itemId = dataset.id || dataset._id;
                  const isSelected = selectedIds.includes(itemId);
                  const isStarred = localFavorites.includes(itemId);
                  const repo = dataset.metadata?.repo_name || 'anonymous/repo';
                  
                  // Seed deterministic stars and forks counts
                  const seed = itemId.charCodeAt(itemId.length - 1) || 7;
                  const starCount = (seed * 43) % 450 + 50;
                  const forkCount = Math.floor(starCount * 0.22);
                  
                  return (
                    <div
                      key={itemId}
                      onClick={() => navigate(`/explorer/${itemId}`)}
                      className={`bg-[#21262D] border rounded-xl p-4.5 flex flex-col justify-between h-44 cursor-pointer hover:border-[#8b949e] hover:shadow-sm transition-all group relative ${
                        isSelected ? 'border-[#58A6FF]/40 bg-[#1f6feb]/5' : 'border-[#30363D]'
                      }`}
                    >
                      <div className="space-y-2.5">
                        
                        {/* Card Top Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 max-w-[80%]">
                            {/* Checkbox select */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectToggle(itemId)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-3.5 w-3.5 rounded border-[#30363D] text-[#58A6FF] focus:ring-[#58A6FF]/20 outline-none transition-colors cursor-pointer bg-[#0D1117]"
                            />
                            <GithubIcon className="w-4 h-4 text-[#8B949E] flex-shrink-0" />
                            <span className="text-xs font-bold text-[#58A6FF] hover:underline truncate">
                              {repo}
                            </span>
                          </div>

                          {/* Star toggle Button */}
                          <button
                            onClick={(e) => handleToggleFavorite(e, itemId)}
                            className="p-1 rounded bg-[#161B22]/50 hover:bg-[#30363D] border border-transparent hover:border-[#30363D] text-[#8B949E] hover:text-amber-400 transition-colors"
                          >
                            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                        </div>

                        {/* Middle: Truncated instruction preview */}
                        <p className="text-xs text-[#8B949E] line-clamp-2 leading-relaxed group-hover:text-[#c9d1d9] transition-colors">
                          {dataset.instruction}
                        </p>

                        {/* Keyword type category badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#161B22] border border-[#30363D] text-[#8B949E] uppercase">
                            {dataset.metadata?.type || 'record'}
                          </span>
                          {dataset.metadata?.code_element && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#161B22] border border-[#30363D] text-[#8B949E]">
                              {dataset.metadata.code_element}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom Footer */}
                      <div className="flex items-center justify-between border-t border-[#30363D]/60 pt-3 text-[10px] text-[#8B949E] font-semibold">
                        <div className="flex items-center gap-3">
                          
                          {/* Lang */}
                          <span className="flex items-center gap-1.5">
                            <span className={`h-2.5 w-2.5 rounded-full ${getLanguageColor(dataset.metadata?.file_path)}`} />
                            <span>{getLanguageName(dataset.metadata?.file_path)}</span>
                          </span>

                          {/* Stars */}
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5" />
                            <span>{starCount}</span>
                          </span>

                          {/* Forks */}
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{forkCount}</span>
                          </span>

                        </div>

                        {/* Date info */}
                        <span className="text-[9px] font-mono opacity-80 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(dataset.updatedAt || dataset.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* List Table View layout */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#30363D] bg-[#161B22]">
                      <th className="px-4 py-3 w-10 align-middle">
                        <input
                          type="checkbox"
                          checked={items.length > 0 && selectedIds.length === items.length}
                          onChange={handleSelectAllToggle}
                          className="h-3.5 w-3.5 rounded border-[#30363D] text-[#58A6FF] focus:ring-[#58A6FF]/20 outline-none transition-colors cursor-pointer bg-[#0D1117]"
                        />
                      </th>
                      <th className="px-4 py-3 text-[#8B949E] font-bold text-[10px] uppercase align-middle">ID</th>
                      <th className="px-4 py-3 text-[#8B949E] font-bold text-[10px] uppercase align-middle">Type</th>
                      <th className="px-4 py-3 text-[#8B949E] font-bold text-[10px] uppercase align-middle">Repository</th>
                      <th className="px-4 py-3 text-[#8B949E] font-bold text-[10px] uppercase align-middle">File Path</th>
                      <th className="px-4 py-3 text-[#8B949E] font-bold text-[10px] uppercase align-middle">Instruction Preview</th>
                      <th className="px-4 py-3 text-[#8B949E] font-bold text-[10px] uppercase align-middle text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#30363D]">
                    {items.map((dataset) => (
                      <DatasetTableRow
                        key={dataset.id || dataset._id}
                        dataset={dataset}
                        onView={() => navigate(`/explorer/${dataset.id || dataset._id}`)}
                        onEdit={handleEditRecord}
                        onDelete={handleDeleteRecord}
                        onRestore={handleRestoreRecord}
                        isSelected={selectedIds.includes(dataset.id || dataset._id)}
                        onSelectToggle={handleSelectToggle}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* 3. Paginated Pagination Footers */}
          {totalResults > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#30363D] bg-[#161B22]">
              {/* Counter status label */}
              <div className="text-[10px] font-bold text-[#8B949E]">
                Showing <span className="text-[#c9d1d9]">{((page - 1) * limit) + 1}</span> to{' '}
                <span className="text-[#c9d1d9]">{Math.min(page * limit, totalResults)}</span>{' '}
                of <span className="text-[#c9d1d9]">{totalResults.toLocaleString()}</span> items
              </div>

              {/* Controls triggers */}
              <div className="flex items-center gap-4.5">
                {/* Limit size */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-[#8B949E] text-[10px]">Rows:</span>
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded-lg outline-none text-[#c9d1d9] focus:border-[#58A6FF] text-xs"
                  >
                    {[10, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Index buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="p-1 bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#c9d1d9] rounded-lg border border-[#30363D] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <button className="h-6 px-2.5 rounded bg-[#1f6feb] border border-[#388bfd] text-white font-bold select-none">
                      {page}
                    </button>
                    <span className="text-[#8B949E]">of</span>
                    <button className="h-6 px-2 rounded bg-[#21262D] border border-[#30363D] text-[#c9d1d9] hover:bg-[#30363D]" disabled>
                      {totalPages}
                    </button>
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || loading}
                    className="p-1 bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#c9d1d9] rounded-lg border border-[#30363D] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Delete Confirmation Modal Overlay */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTargetId(null);
          setIsBulkDelete(false);
          setIsBulkDeleteHard(false);
        }}
        onConfirm={isBulkDelete ? handleBulkDeleteConfirmAction : handleDeleteConfirm}
        id={deleteTargetId}
        count={isBulkDelete ? selectedIds.length : undefined}
        isHard={isBulkDeleteHard}
        loading={loading}
      />

      {/* Bulk Update parameter settings */}
      <BulkUpdateModal
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        onConfirm={handleBulkUpdateConfirm}
        selectedCount={selectedIds.length}
        loading={loading}
      />

      {/* Import / Export JSON manager panels */}
      <ImportExportManager
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImportSuccess={(msg) => {
          setIsImportExportOpen(false);
          dispatch(showNotification({ message: msg, type: 'success' }));
          dispatch(fetchDatasets());
        }}
      />

      {/* FLOATING BULK ACTIONS OVERLAY BAR */}
      {selectedIds.length > 0 && user && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#21262D] border border-[#30363D] shadow-2xl p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl w-[90%] animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#58A6FF] animate-pulse" />
            <span className="text-xs font-semibold text-[#F0F6FC]">
              {selectedIds.length} records selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setIsBulkEditOpen(true)}
              className="px-3 py-1.5 bg-[#161B22] hover:bg-[#30363D] text-[#c9d1d9] text-[10px] font-bold rounded border border-[#30363D] transition-colors cursor-pointer"
            >
              Bulk Edit
            </button>

            {filters.deleted === 'true' && user.role === 'admin' ? (
              <button
                onClick={handleBulkRestore}
                className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-[10px] font-bold rounded border border-transparent transition-colors cursor-pointer"
              >
                Bulk Restore
              </button>
            ) : (
              <button
                onClick={() => handleBulkDeleteTrigger(false)}
                className="px-3 py-1.5 bg-[#d29922] hover:bg-amber-600 text-white text-[10px] font-bold rounded border border-transparent transition-colors cursor-pointer"
              >
                Bulk Soft Delete
              </button>
            )}

            {user.role === 'admin' && (
              <button
                onClick={() => handleBulkDeleteTrigger(true)}
                className="px-3 py-1.5 bg-[#F85149] hover:bg-[#ff7b72] text-white text-[10px] font-bold rounded border border-transparent transition-colors cursor-pointer"
              >
                Bulk Hard Delete
              </button>
            )}

            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-[#161B22]/30 text-[#8B949E] hover:text-[#c9d1d9] text-[10px] font-medium rounded transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetsExplorer;
