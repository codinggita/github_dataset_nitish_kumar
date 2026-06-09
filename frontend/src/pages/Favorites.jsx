import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, GitFork, Trash2, ArrowRight, Layers, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../services/api';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const Favorites = () => {
  const navigate = useNavigate();
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favIds.length === 0) {
      setFavoritesList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const requests = favIds.map(id => 
        apiClient.get(`/datasets/${id}`)
          .then(res => res.data.data)
          .catch(err => {
            console.error(`Failed to fetch details for favorite dataset ${id}:`, err);
            return null; // Return null so we can filter it out gracefully
          })
      );
      const results = await Promise.all(requests);
      const validResults = results.filter(item => item !== null);
      
      // Seed statistics based on ID
      const datasetsWithStats = validResults.map(item => {
        const idStr = item.id || item._id;
        const seed = idStr.charCodeAt(idStr.length - 1) || 7;
        const stars = (seed * 43) % 450 + 50;
        const forks = Math.floor(stars * 0.22);
        return {
          ...item,
          stars,
          forks
        };
      });
      
      setFavoritesList(datasetsWithStats);
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading your favorites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = (e, idToRemove) => {
    e.stopPropagation();
    e.preventDefault();
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(id => id !== idToRemove);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Animate item removal
    setFavoritesList(prev => prev.filter(item => (item.id || item._id) !== idToRemove));
  };

  const getLanguageColor = (filePath) => {
    if (!filePath) return 'bg-slate-400';
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#30363D] pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F0F6FC] flex items-center gap-2">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400" /> Favorites
          </h1>
          <p className="text-[#8B949E] text-sm">
            Quick access to your starred datasets and repository code training pairs.
          </p>
        </div>
        <Link 
          to="/explorer" 
          className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#c9d1d9] font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          Explore Datasets <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-2xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Grid List */}
      {favoritesList.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-16 text-center max-w-xl mx-auto space-y-4">
          <div className="h-16 w-16 bg-[#21262D] text-[#8B949E] border border-[#30363D] rounded-2xl flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F6FC]">No Bookmarked Favorites</h3>
          <p className="text-[#8B949E] text-sm leading-relaxed">
            Star repositories inside the explorer row or details view to populate your favorites collection.
          </p>
          <Link 
            to="/explorer" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            Find Datasets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {favoritesList.map((dataset) => {
              const datasetId = dataset.id || dataset._id;
              const repo = dataset.metadata?.repo_name || 'anonymous/repo';
              
              return (
                <motion.div
                  key={datasetId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#21262D] border border-[#30363D] hover:border-[#8b949e] p-5 rounded-2xl flex flex-col justify-between h-48 transition-all hover:shadow-md group cursor-pointer relative"
                  onClick={() => navigate(`/explorer/${datasetId}`)}
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <GithubIcon className="w-4 h-4 text-[#8B949E]" />
                        <span className="text-[#58A6FF] font-semibold text-sm hover:underline truncate max-w-[220px]">
                          {repo}
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => handleRemoveFavorite(e, datasetId)}
                        className="p-1.5 rounded-lg bg-[#161B22]/50 hover:bg-rose-950/30 text-[#8B949E] hover:text-rose-400 border border-transparent hover:border-rose-900/30 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preview instruction */}
                    <p className="text-xs text-[#8B949E] line-clamp-2 leading-relaxed">
                      {dataset.instruction}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-[#30363D]/60 pt-3 text-xs text-[#8B949E]">
                    <div className="flex items-center gap-4">
                      {/* Language */}
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${getLanguageColor(dataset.metadata?.file_path)}`} />
                        <span>{getLanguageName(dataset.metadata?.file_path)}</span>
                      </span>

                      {/* Stars */}
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
                        <span>{dataset.stars}</span>
                      </span>

                      {/* Forks */}
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5" />
                        <span>{dataset.forks}</span>
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-[#8B949E]/70 bg-[#161B22] px-2 py-0.5 rounded border border-[#30363D]">
                      #{datasetId.substring(Math.max(0, datasetId.length - 6))}
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Favorites;
