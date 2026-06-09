import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Star, 
  GitFork, 
  Eye as WatchIcon, 
  Play, 
  Code, 
  FileCode, 
  Activity as ActivityIcon, 
  BarChart3, 
  LineChart,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  RotateCcw,
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);
import { showNotification } from '../store/uiSlice';
import { deleteDataset, restoreDataset } from '../store/datasetSlice';
import apiClient from '../services/api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const DatasetDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Interactive client-side states
  const [starred, setStarred] = useState(false);
  const [starsCount, setStarsCount] = useState(0);
  const [forked, setForked] = useState(false);
  const [forksCount, setForksCount] = useState(0);
  const [watching, setWatching] = useState(false);
  const [watchersCount, setWatchersCount] = useState(0);
  
  const [copiedSection, setCopiedSection] = useState(null);

  // Fetch Dataset details
  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/datasets/${id}`);
      const data = response.data.data;
      setDataset(data);
      
      // Seed deterministic statistics based on ID
      const seed = id.charCodeAt(id.length - 1) || 7;
      const baseStars = (seed * 43) % 450 + 50;
      const baseForks = Math.floor(baseStars * 0.22);
      const baseWatchers = Math.floor(baseStars * 0.12);
      
      setStarsCount(baseStars);
      setForksCount(baseForks);
      setWatchersCount(baseWatchers);

      // Check local favorites
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isFav = favorites.includes(data.id || data._id);
      setStarred(isFav);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to retrieve dataset details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleCopy = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Toggle favorite/star local state
  const handleStarToggle = () => {
    if (!dataset) return;
    const itemID = dataset.id || dataset._id;
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (starred) {
      favorites = favorites.filter(favId => favId !== itemID);
      setStarsCount(prev => prev - 1);
      dispatch(showNotification({ message: 'Removed from favorites', type: 'info' }));
    } else {
      favorites.push(itemID);
      setStarsCount(prev => prev + 1);
      dispatch(showNotification({ message: 'Added to favorites', type: 'success' }));
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setStarred(!starred);
  };

  const handleForkToggle = () => {
    if (forked) return;
    setForked(true);
    setForksCount(prev => prev + 1);
    dispatch(showNotification({ message: 'Repository dataset forked successfully to your profile!', type: 'success' }));
  };

  const handleWatchToggle = () => {
    setWatching(!watching);
    setWatchersCount(prev => watching ? prev - 1 : prev + 1);
    dispatch(showNotification({ message: watching ? 'Stopped watching dataset' : 'Started watching dataset', type: 'info' }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to soft-delete this dataset record?')) {
      dispatch(deleteDataset(id))
        .unwrap()
        .then(() => {
          dispatch(showNotification({ message: 'Dataset soft-deleted successfully', type: 'success' }));
          navigate('/explorer');
        })
        .catch((err) => {
          dispatch(showNotification({ message: err || 'Failed to delete dataset', type: 'error' }));
        });
    }
  };

  const handleRestore = () => {
    dispatch(restoreDataset(id))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ message: 'Dataset restored successfully', type: 'success' }));
        fetchDetail();
      })
      .catch((err) => {
        dispatch(showNotification({ message: err || 'Failed to restore dataset', type: 'error' }));
      });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 md:p-8">
        <div className="flex justify-between items-center pb-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
        <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading">Error Loading Dataset</h2>
        <p className="text-slate-400 text-sm leading-relaxed">{error || 'The requested dataset does not exist or has been permanently removed.'}</p>
        <Link to="/explorer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Explorer
        </Link>
      </div>
    );
  }

  const { instruction, input, output, metadata } = dataset;
  const repoName = metadata?.repo_name || 'anonymous/dataset-repository';
  const repoParts = repoName.split('/');
  const owner = repoParts[0] || 'anonymous';
  const name = repoParts.slice(1).join('/') || 'repo';
  const isDeleted = dataset.isDeleted === true;

  // Split lines helper for file code layout
  const getLines = (text) => text.split('\n');

  // Char stats
  const instructionChars = instruction.length;
  const inputChars = input ? input.length : 0;
  const outputChars = output.length;
  const totalChars = instructionChars + inputChars + outputChars;
  const wordCount = (instruction + ' ' + (input || '') + ' ' + output).split(/\s+/).filter(Boolean).length;

  // Analytics Chart Data (Instruction length VS Output length)
  const statsChartData = [
    { name: 'Instruction', count: instructionChars, words: instruction.split(/\s+/).length },
    { name: 'Input Context', count: inputChars, words: input ? input.split(/\s+/).length : 0 },
    { name: 'Output Code', count: outputChars, words: output.split(/\s+/).length }
  ];

  // Simulated activity commit history
  const seedNum = (id.charCodeAt(id.length - 2) || 4) + (id.charCodeAt(id.length - 1) || 9);
  const activityLogs = [
    {
      action: 'Dataset record validated and locked',
      author: 'system-agent',
      date: new Date(new Date(dataset.createdAt).getTime() + 600000).toLocaleString(),
      commit: 'ac8d31a',
      type: 'lock'
    },
    {
      action: 'File sync from GitHub Source',
      author: 'github-sync-api',
      date: new Date(dataset.createdAt).toLocaleString(),
      commit: '75b2ef8',
      type: 'sync'
    }
  ];
  if (dataset.updatedAt !== dataset.createdAt) {
    activityLogs.unshift({
      action: 'Metadata edits & code formatting applied',
      author: user?.name || 'collaborator',
      date: new Date(dataset.updatedAt).toLocaleString(),
      commit: '3f6c8d2',
      type: 'edit'
    });
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Repository Inspired Header */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Repo Title Path */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#8B949E]">
            <Link to="/explorer" className="flex items-center gap-1.5 hover:text-[#58A6FF] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Explorer
            </Link>
            <span>/</span>
            <div className="flex items-center gap-1">
              <GithubIcon className="w-4 h-4" />
              <span className="font-semibold text-[#58A6FF] hover:underline cursor-pointer">{owner}</span>
              <span>/</span>
              <span className="font-bold text-[#F0F6FC] hover:underline cursor-pointer">{name}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#21262D] border border-[#30363D] text-[11px] font-medium text-[#8B949E] uppercase tracking-wide">
              {metadata?.type || 'Record'}
            </span>
            {isDeleted && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold uppercase">
                Deleted
              </span>
            )}
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F0F6FC] flex items-center gap-2">
            Dataset Entry #{id.substring(Math.max(0, id.length - 8))}
          </h1>
        </div>

        {/* Watch / Star / Fork Counter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Watch */}
          <div className="inline-flex rounded-lg border border-[#30363D] bg-[#21262D] overflow-hidden text-xs font-semibold">
            <button 
              onClick={handleWatchToggle}
              className="px-3 py-1.5 flex items-center gap-1.5 text-[#c9d1d9] hover:bg-[#30363D] transition-colors cursor-pointer border-r border-[#30363D]"
            >
              <WatchIcon className={`w-3.5 h-3.5 ${watching ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span>{watching ? 'Watching' : 'Watch'}</span>
            </button>
            <span className="px-3 py-1.5 bg-[#161B22] text-[#8B949E] select-none flex items-center justify-center font-mono">
              {watchersCount}
            </span>
          </div>

          {/* Star / Favorite */}
          <div className="inline-flex rounded-lg border border-[#30363D] bg-[#21262D] overflow-hidden text-xs font-semibold">
            <button 
              onClick={handleStarToggle}
              className="px-3 py-1.5 flex items-center gap-1.5 text-[#c9d1d9] hover:bg-[#30363D] transition-colors cursor-pointer border-r border-[#30363D]"
            >
              <Star className={`w-3.5 h-3.5 ${starred ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span>{starred ? 'Starred' : 'Star'}</span>
            </button>
            <span className="px-3 py-1.5 bg-[#161B22] text-[#8B949E] select-none flex items-center justify-center font-mono">
              {starsCount}
            </span>
          </div>

          {/* Fork */}
          <div className="inline-flex rounded-lg border border-[#30363D] bg-[#21262D] overflow-hidden text-xs font-semibold">
            <button 
              onClick={handleForkToggle}
              className="px-3 py-1.5 flex items-center gap-1.5 text-[#c9d1d9] hover:bg-[#30363D] transition-colors cursor-pointer border-r border-[#30363D]"
            >
              <GitFork className={`w-3.5 h-3.5 ${forked ? 'text-emerald-400' : ''}`} />
              <span>{forked ? 'Forked' : 'Fork'}</span>
            </button>
            <span className="px-3 py-1.5 bg-[#161B22] text-[#8B949E] select-none flex items-center justify-center font-mono">
              {forksCount}
            </span>
          </div>
        </div>

      </div>

      {/* 2. Repository Tabs Menu */}
      <div className="border-b border-[#30363D] flex items-center overflow-x-auto gap-4 scrollbar-none">
        {[
          { key: 'overview', name: 'Code Overview', icon: Code },
          { key: 'analytics', name: 'Analytics Insights', icon: BarChart3 },
          { key: 'statistics', name: 'Text Statistics', icon: LineChart },
          { key: 'activity', name: 'Activity Log', icon: ActivityIcon }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 pt-1 px-2 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
                isActive 
                  ? 'border-[#F0883E] text-[#F0F6FC]' 
                  : 'border-transparent text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              <TabIcon className="w-4.5 h-4.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Instruction Panel */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-[#21262D] border-b border-[#30363D] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8B949E] flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#58A6FF]" /> INSTRUCTION.md
                  </span>
                  <button 
                    onClick={() => handleCopy(instruction, 'instruction')}
                    className="text-xs text-[#8B949E] hover:text-[#58A6FF] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedSection === 'instruction' ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'instruction' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="flex bg-[#0D1117] text-[#c9d1d9] font-mono text-xs overflow-x-auto leading-relaxed max-h-[350px]">
                  {/* Line Numbers */}
                  <div className="text-right px-3.5 py-4 border-r border-[#30363D] bg-[#161B22]/50 text-[#8B949E]/50 select-none min-w-[45px]">
                    {getLines(instruction).map((_, idx) => (
                      <div key={idx}>{idx + 1}</div>
                    ))}
                  </div>
                  {/* Code */}
                  <pre className="p-4 flex-1 whitespace-pre-wrap select-text">
                    <code>{instruction}</code>
                  </pre>
                </div>
              </div>

              {/* Input Context (only if exists) */}
              {input && (
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-[#21262D] border-b border-[#30363D] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#8B949E] flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-[#8B949E]" /> INPUT_CONTEXT.json
                    </span>
                    <button 
                      onClick={() => handleCopy(input, 'input')}
                      className="text-xs text-[#8B949E] hover:text-[#58A6FF] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedSection === 'input' ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === 'input' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="flex bg-[#0D1117] text-[#85e89d] font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
                    <div className="text-right px-3.5 py-4 border-r border-[#30363D] bg-[#161B22]/50 text-[#8B949E]/50 select-none min-w-[45px]">
                      {getLines(input).map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                      ))}
                    </div>
                    <pre className="p-4 flex-1 whitespace-pre-wrap select-text">
                      <code>{input}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Output Panel */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-[#21262D] border-b border-[#30363D] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8B949E] flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#3FB950]" /> EXPECTED_OUTPUT.py
                  </span>
                  <button 
                    onClick={() => handleCopy(output, 'output')}
                    className="text-xs text-[#8B949E] hover:text-[#58A6FF] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedSection === 'output' ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'output' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="flex bg-[#0D1117] text-[#ff7b72] font-mono text-xs overflow-x-auto leading-relaxed max-h-[450px]">
                  <div className="text-right px-3.5 py-4 border-r border-[#30363D] bg-[#161B22]/50 text-[#8B949E]/50 select-none min-w-[45px]">
                    {getLines(output).map((_, idx) => (
                      <div key={idx}>{idx + 1}</div>
                    ))}
                  </div>
                  <pre className="p-4 flex-1 whitespace-pre-wrap select-text">
                    <code className="text-[#a5d6ff]">{output}</code>
                  </pre>
                </div>
              </div>

            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl">
                <h3 className="text-base font-semibold text-[#F0F6FC] mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#58A6FF]" /> Character Densities Breakdown
                </h3>
                <p className="text-xs text-[#8B949E] mb-6">Aggregate characters count comparisons across the three main sections of this training pair.</p>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363D" />
                      <XAxis dataKey="name" stroke="#8B949E" fontSize={11} />
                      <YAxis stroke="#8B949E" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#21262D', borderColor: '#30363D', borderRadius: '8px' }}
                        labelStyle={{ color: '#F0F6FC', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="count" fill="#58A6FF" radius={[6, 6, 0, 0]} barSize={40}>
                        {statsChartData.map((entry, index) => {
                          const colors = ['#58A6FF', '#8B949E', '#3FB950'];
                          return <Cell key={`cell-${index}`} fill={colors[index]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl">
                <h3 className="text-base font-semibold text-[#F0F6FC] mb-2 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-[#3FB950]" /> Vocabulary Words Aggregate
                </h3>
                <p className="text-xs text-[#8B949E] mb-6">Word count distribution across instruction prompt contexts.</p>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                      <XAxis dataKey="name" stroke="#8B949E" fontSize={11} />
                      <YAxis stroke="#8B949E" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#21262D', borderColor: '#30363D', borderRadius: '8px' }}
                      />
                      <Area type="monotone" dataKey="words" stroke="#3FB950" fill="rgba(63, 185, 80, 0.15)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* STATISTICS TAB */}
          {activeTab === 'statistics' && (
            <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-6">
              <h3 className="text-base font-semibold text-[#F0F6FC] border-b border-[#30363D] pb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F0883E]" /> Text Complexity Indicators
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-[#21262D] border border-[#30363D]">
                  <div className="text-xs text-[#8B949E] mb-1 uppercase font-semibold">Prompt Complexity</div>
                  <div className="text-2xl font-bold text-[#F0F6FC] font-mono">
                    {Math.floor(instructionChars / 12)} <span className="text-xs text-[#8B949E]">avg len</span>
                  </div>
                  <p className="text-[10px] text-[#8B949E] mt-2">Instruction sentence-level token complexity ratio.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#21262D] border border-[#30363D]">
                  <div className="text-xs text-[#8B949E] mb-1 uppercase font-semibold">Total Vocabulary</div>
                  <div className="text-2xl font-bold text-[#3FB950] font-mono">{wordCount}</div>
                  <p className="text-[10px] text-[#8B949E] mt-2">Unique word count density of dataset records.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#21262D] border border-[#30363D]">
                  <div className="text-xs text-[#8B949E] mb-1 uppercase font-semibold">Estimated Tokens</div>
                  <div className="text-2xl font-bold text-[#58A6FF] font-mono">
                    {Math.ceil(totalChars / 4)}
                  </div>
                  <p className="text-[10px] text-[#8B949E] mt-2">Estimated BPE tokenizer sequence length.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#21262D] border border-[#30363D]">
                  <div className="text-xs text-[#8B949E] mb-1 uppercase font-semibold">Total Lines</div>
                  <div className="text-2xl font-bold text-[#c9d1d9] font-mono">
                    {getLines(instruction).length + getLines(output).length}
                  </div>
                  <p className="text-[10px] text-[#8B949E] mt-2">Combined codebase instruction and code lines.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#21262D] border border-[#30363D]">
                  <div className="text-xs text-[#8B949E] mb-1 uppercase font-semibold">Input/Output Ratio</div>
                  <div className="text-2xl font-bold text-[#F0883E] font-mono">
                    {(outputChars / Math.max(1, instructionChars)).toFixed(2)}x
                  </div>
                  <p className="text-[10px] text-[#8B949E] mt-2">Ratio of output generation to input prompt size.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#21262D] border border-[#30363D]">
                  <div className="text-xs text-[#8B949E] mb-1 uppercase font-semibold">Storage Density</div>
                  <div className="text-2xl font-bold text-[#ff7b72] font-mono">
                    {(totalChars / 1024).toFixed(2)} <span className="text-xs text-[#8B949E]">KB</span>
                  </div>
                  <p className="text-[10px] text-[#8B949E] mt-2">Character sequence storage volume in memory.</p>
                </div>
              </div>

              <div className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl text-xs text-[#8B949E] space-y-1">
                <span className="font-semibold text-[#F0F6FC]">Tokenizer Note:</span>
                <p>Estimates are based on OpenAI's tiktoken standard (approx. 4 characters per token). Complex code formatting syntax can result in higher token overhead.</p>
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-6">
              <h3 className="text-base font-semibold text-[#F0F6FC] border-b border-[#30363D] pb-3 flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-[#58A6FF]" /> Synchronize Audit Log
              </h3>

              <div className="relative border-l border-[#30363D] pl-6 ml-3 space-y-8">
                {activityLogs.map((log, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet */}
                    <span className="absolute -left-9.5 top-0.5 h-6 w-6 rounded-full bg-[#21262D] border border-[#30363D] flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-[#58A6FF]" />
                    </span>
                    
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-[#F0F6FC]">
                        <span className="font-semibold">{log.action}</span>
                        <span className="text-xs px-2 py-0.5 rounded font-mono bg-[#21262D] text-[#8B949E] border border-[#30363D]">
                          {log.commit}
                        </span>
                      </div>
                      
                      <div className="text-xs text-[#8B949E] flex items-center gap-3">
                        <span>Synced by <strong className="text-[#c9d1d9]">{log.author}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {log.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Metadata Area */}
        <div className="space-y-6">
          
          {/* Metadata Sidebar Pane */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B949E] border-b border-[#30363D] pb-2">
              Metadata Properties
            </h3>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <span className="text-[#8B949E] block">Source Type</span>
                <span className="font-mono text-[#F0F6FC] bg-[#21262D] px-2 py-1 border border-[#30363D] rounded inline-block">
                  {metadata?.source_type || 'unknown'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8B949E] block">Code Element Classification</span>
                <span className="font-mono text-[#F0F6FC] bg-[#21262D] px-2 py-1 border border-[#30363D] rounded inline-block">
                  {metadata?.code_element || 'unknown'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8B949E] block">Document Type</span>
                <span className="font-mono text-[#F0F6FC] bg-[#21262D] px-2 py-1 border border-[#30363D] rounded inline-block uppercase">
                  {metadata?.doc_type || 'N/A'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8B949E] block">File Extension Language</span>
                <span className="font-mono text-[#58A6FF] font-semibold bg-[#21262D] px-2 py-1 border border-[#30363D] rounded inline-block">
                  {metadata?.file_path ? '.' + metadata.file_path.split('.').pop() : 'N/A'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8B949E] block">Is README Based?</span>
                <span className={`font-semibold ${metadata?.is_readme ? 'text-[#3FB950]' : 'text-[#8B949E]'}`}>
                  {metadata?.is_readme ? 'YES' : 'NO'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8B949E] block">Sync Gateway URL</span>
                {metadata?.url ? (
                  <a 
                    href={metadata.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#58A6FF] hover:underline flex items-center gap-1.5 break-all"
                  >
                    <span>Source Repository URL</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : (
                  <span className="text-[#8B949E]">N/A</span>
                )}
              </div>

            </div>
          </div>

          {/* Admin Operations Panel */}
          {user && (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B949E] border-b border-[#30363D] pb-2">
                Operations
              </h3>

              <div className="flex flex-col gap-2">
                <Link
                  to={`/explorer/${id}/edit`}
                  className="w-full py-2 bg-[#21262D] border border-[#30363D] hover:border-[#8B949E] hover:bg-[#30363D] text-[#F0F6FC] text-center text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Dataset Record</span>
                </Link>

                {isDeleted ? (
                  user.role === 'admin' && (
                    <button
                      onClick={handleRestore}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Dataset</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleDelete}
                    className="w-full py-2 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/40 text-rose-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Soft Delete Record</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DatasetDetail;
