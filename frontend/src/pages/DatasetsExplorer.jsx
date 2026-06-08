import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDatasets, setPage, setLimit, setSearchQuery, setSort, deleteDataset } from '../store/datasetSlice';
import DatasetTableRow from '../components/DatasetTableRow';
import DatasetDetailModal from '../components/DatasetDetailModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import FilterSidebar from '../components/FilterSidebar';
import { ChevronLeft, ChevronRight, HelpCircle, Layers, RefreshCw, Search, ArrowUpDown } from 'lucide-react';
import { showNotification } from '../store/uiSlice';

const DatasetsExplorer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items, loading, error, page, limit, totalResults, sort, searchQuery, filters } = useSelector((state) => state.datasets);
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [searchVal, setSearchVal] = useState(searchQuery);

  // Synchronize local search input with store search query (e.g. on filter clear)
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

  // Fetch datasets when query state dependencies change
  useEffect(() => {
    dispatch(fetchDatasets());
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
    filters.category
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

  const handleViewDetail = (dataset) => {
    setSelectedDataset(dataset);
    setIsDetailOpen(true);
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

  const totalPages = Math.ceil(totalResults / limit) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-dark-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Datasets Explorer</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Inspect, search, and manage repository codebase dataset training pairs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => navigate('/explorer/new')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-brand-500 shadow-md shadow-brand-500/10"
            >
              Add Dataset
            </button>
          )}
          <button
            onClick={() => dispatch(fetchDatasets())}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-slate-200 dark:border-dark-border shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh List
          </button>
        </div>

      </div>

      {/* Main content grid split */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Filter Sidebar */}
        <FilterSidebar />

        {/* Right Side: Main Table Grid */}
        <div className="flex-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
          
          {/* Search and Sort Control Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-dark-border/40 bg-slate-50/20 dark:bg-slate-800/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search instructions, repository, code..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder-slate-400 dark:placeholder-slate-500"
              />
              {searchVal && (
                <button 
                  onClick={() => setSearchVal('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs font-semibold w-full sm:w-auto justify-end">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
              </span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl outline-none text-slate-700 dark:text-slate-300 focus:border-brand-500 transition-colors cursor-pointer"
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

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border bg-slate-50/50 dark:bg-slate-800/10">
                  <th className="px-6 py-4 w-12 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">
                    <input
                      type="checkbox"
                      checked={items.length > 0 && selectedIds.length === items.length}
                      onChange={handleSelectAllToggle}
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500/20 outline-none transition-colors cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">ID</th>
                  <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">Type</th>
                  <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">Repository</th>
                  <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">File Path</th>
                  <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle">Instruction Preview</th>
                  <th className="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase align-middle text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-dark-border/40">
                {loading ? (
                  // Skeleton loading rows
                  Array.from({ length: limit }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4.5 align-middle">
                        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" />
                      </td>
                      <td className="px-6 py-4.5 align-middle">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                      </td>
                      <td className="px-6 py-4.5 align-middle">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                      </td>
                      <td className="px-6 py-4.5 align-middle">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                      </td>
                      <td className="px-6 py-4.5 align-middle">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                      </td>
                      <td className="px-6 py-4.5 align-middle">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-60" />
                      </td>
                      <td className="px-6 py-4.5 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center align-middle">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                          <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold">No Datasets Found</h3>
                        <p className="text-sm text-slate-400">
                          We couldn't find any dataset records matching your active filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((dataset) => (
                    <DatasetTableRow
                      key={dataset.id || dataset._id}
                      dataset={dataset}
                      onView={handleViewDetail}
                      onEdit={handleEditRecord}
                      onDelete={handleDeleteRecord}
                      isSelected={selectedIds.includes(dataset.id || dataset._id)}
                      onSelectToggle={handleSelectToggle}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Section */}
          {totalResults > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-slate-100 dark:border-dark-border">
              {/* Show info */}
              <div className="text-xs font-semibold text-slate-400">
                Showing <span className="text-slate-600 dark:text-slate-300">{((page - 1) * limit) + 1}</span> to{' '}
                <span className="text-slate-600 dark:text-slate-300">
                  {Math.min(page * limit, totalResults)}
                </span>{' '}
                of <span className="text-slate-600 dark:text-slate-300">{totalResults.toLocaleString()}</span> records
              </div>

              {/* Pagination controls & limits */}
              <div className="flex items-center gap-4.5">
                {/* Limit selector */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-slate-400">Rows per page:</span>
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-lg outline-none text-slate-600 dark:text-slate-300 focus:border-brand-500"
                  >
                    {[10, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prev/Next buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg border border-slate-200/40 dark:border-dark-border/40 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers indicators */}
                  <div className="flex items-center gap-1">
                    {/* First Page */}
                    {page > 2 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className={`h-7.5 w-7.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center border transition-all ${
                            page === 1
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'bg-white dark:bg-dark-card border-slate-200/60 dark:border-dark-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          1
                        </button>
                        {page > 3 && <span className="text-slate-400 text-xs px-0.5">...</span>}
                      </>
                    )}

                    {/* Preceding Page */}
                    {page > 1 && (
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        className="h-7.5 w-7.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center border bg-white dark:bg-dark-card border-slate-200/60 dark:border-dark-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                      >
                        {page - 1}
                      </button>
                    )}

                    {/* Current Page */}
                    <button
                      className="h-7.5 w-7.5 text-xs font-bold rounded-lg flex items-center justify-center border bg-brand-600 text-white border-brand-600"
                      disabled
                    >
                      {page}
                    </button>

                    {/* Succeeding Page */}
                    {page < totalPages && (
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        className="h-7.5 w-7.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center border bg-white dark:bg-dark-card border-slate-200/60 dark:border-dark-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                      >
                        {page + 1}
                      </button>
                    )}

                    {/* Last Page */}
                    {page < totalPages - 1 && (
                      <>
                        {page < totalPages - 2 && <span className="text-slate-400 text-xs px-0.5">...</span>}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="h-7.5 w-7.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center border bg-white dark:bg-dark-card border-slate-200/60 dark:border-dark-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || loading}
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg border border-slate-200/40 dark:border-dark-border/40 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Detail slide-over drawer modal */}
      <DatasetDetailModal
        dataset={selectedDataset}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteConfirm}
        id={deleteTargetId}
        loading={loading}
      />
    </div>

  );
};

export default DatasetsExplorer;
