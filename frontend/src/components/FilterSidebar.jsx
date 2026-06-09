import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../store/datasetSlice';
import { Trash2, Sliders } from 'lucide-react';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.datasets);

  // Handle dropdown value changes
  const handleFilterChange = (name, value) => {
    dispatch(setFilter({ [name]: value }));
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    dispatch(resetFilters());
  };

  // Filter dropdown configurations
  const filterSections = [
    {
      label: 'Inventory Status',
      name: 'deleted',
      options: [
        { label: 'Active Records', value: '' },
        { label: 'Soft Deleted (Trash)', value: 'true' },
        { label: 'Show All Records', value: 'all' },
      ],
    },
    {
      label: 'Classification Type',
      name: 'type',
      options: [
        { label: 'All Types', value: '' },
        { label: 'Function', value: 'function' },
        { label: 'Function Implementation', value: 'function_implementation' },
        { label: 'Class', value: 'class' },
        { label: 'Class Implementation', value: 'class_implementation' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Docstring Generation', value: 'docstring_generation' },
      ],
    },
    {
      label: 'Category',
      name: 'category',
      options: [
        { label: 'All Categories', value: '' },
        { label: 'AI (Artificial Intelligence)', value: 'ai' },
        { label: 'ML (Machine Learning)', value: 'ml' },
        { label: 'Code Generation', value: 'code_generation' },
        { label: 'Docstring', value: 'docstring' },
      ],
    },
    {
      label: 'Framework',
      name: 'framework',
      options: [
        { label: 'All Frameworks', value: '' },
        { label: 'PyTorch', value: 'pytorch' },
        { label: 'TensorFlow', value: 'tensorflow' },
        { label: 'Keras', value: 'keras' },
        { label: 'Scikit-Learn', value: 'scikit' },
        { label: 'JAX', value: 'jax' },
      ],
    },
    {
      label: 'Language / Extension',
      name: 'language',
      options: [
        { label: 'All Languages', value: '' },
        { label: 'Python (.py)', value: 'python' },
        { label: 'JavaScript (.js)', value: 'javascript' },
        { label: 'Markdown (.md)', value: 'markdown' },
        { label: 'Go (.go)', value: 'go' },
        { label: 'C++ (.cpp)', value: 'cpp' },
        { label: 'Java (.java)', value: 'java' },
        { label: 'Rust (.rs)', value: 'rust' },
      ],
    },
    {
      label: 'Document Format',
      name: 'docType',
      options: [
        { label: 'All Formats', value: '' },
        { label: 'Markdown (md)', value: 'md' },
        { label: 'HTML', value: 'html' },
        { label: 'RestructuredText (rst)', value: 'rst' },
        { label: 'Plain Text (txt)', value: 'txt' },
      ],
    },
    {
      label: 'Source Type',
      name: 'source',
      options: [
        { label: 'All Sources', value: '' },
        { label: 'GitHub Repository', value: 'github_repository' },
      ],
    },
  ];

  const hasActiveFilters = Object.values(filters).some((val) => val !== '');

  return (
    <div className="w-full lg:w-64 bg-[#161B22] border border-[#30363D] p-5 rounded-xl space-y-5 h-fit shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
        <div className="flex items-center gap-2 font-bold text-xs text-[#F0F6FC]">
          <Sliders className="w-4 h-4 text-[#58A6FF]" />
          Filter Repositories
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-[#F85149] hover:text-[#ff7b72] font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Repository search */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B949E]">
          Source Repository
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. pytorch/pytorch"
            value={filters.repo}
            onChange={(e) => handleFilterChange('repo', e.target.value)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-[#F0F6FC] placeholder-[#8B949E] outline-none focus:border-[#58A6FF] transition-all font-semibold"
          />
        </div>
      </div>

      {/* Select lists */}
      <div className="space-y-4">
        {filterSections.map((section) => (
          <div key={section.name} className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B949E]">
              {section.label}
            </label>
            <select
              value={filters[section.name]}
              onChange={(e) => handleFilterChange(section.name, e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs outline-none text-[#c9d1d9] focus:border-[#58A6FF] transition-colors cursor-pointer capitalize font-semibold"
            >
              {section.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#161B22]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
