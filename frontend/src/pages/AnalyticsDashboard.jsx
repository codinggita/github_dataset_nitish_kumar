import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalyticsData, clearStatsError } from '../store/statsSlice';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  RefreshCw, 
  AlertCircle,
  Calendar,
  Layers,
  Activity,
  Flame
} from 'lucide-react';

const COLORS = ['#58A6FF', '#bc8cff', '#3FB950', '#f0883e', '#39c5cf', '#ff7b72', '#ff7b72'];

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#21262D] border border-[#30363D] p-3 rounded-lg shadow-xl text-xs text-[#c9d1d9]">
        <p className="font-bold text-[#F0F6FC] capitalize">{payload[0].name.replace('_', ' ')}</p>
        <p className="text-[#58A6FF] font-semibold mt-1">
          Count: <span className="text-[#F0F6FC]">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.stats);

  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    if (!analytics) {
      dispatch(fetchAnalyticsData());
    }
  }, [dispatch, analytics]);

  const handleRefresh = () => {
    dispatch(clearStatsError());
    dispatch(fetchAnalyticsData());
  };

  // Safe extractions
  const typeData = analytics?.typeStats || [];
  const repoData = analytics?.repoStats || [];
  const sourceData = analytics?.sourceStats || [];
  const languageData = analytics?.languageStats || [];

  // Generate GitHub contribution grid activity (53 weeks * 7 days = 371 days)
  const generateContributionCalendar = () => {
    const calendar = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Seed generator
    let seed = 4;
    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        // Deterministic mock activity level (0 to 4)
        seed = (seed * 31 + week * 7 + day) % 100;
        let count = 0;
        let color = '#21262D'; // Empty level 0
        
        if (seed > 92) {
          count = Math.floor(seed / 10) + 1;
          color = '#39d353'; // Level 4
        } else if (seed > 75) {
          count = Math.floor(seed / 15) + 1;
          color = '#26a641'; // Level 3
        } else if (seed > 50) {
          count = Math.floor(seed / 25) + 1;
          color = '#006d32'; // Level 2
        } else if (seed > 30) {
          count = Math.floor(seed / 30) + 1;
          color = '#0e4429'; // Level 1
        }
        
        // Calculate date offset from today
        const date = new Date();
        date.setDate(date.getDate() - ((52 - week) * 7 + (6 - day)));
        
        weekDays.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          month: months[date.getMonth()],
          count,
          color
        });
      }
      calendar.push(weekDays);
    }
    return calendar;
  };

  const contributionGrid = generateContributionCalendar();

  // Dataset Growth Cumulative Chart Data (Mocking growth history based on analytics counts)
  const totalItemsCount = languageData.reduce((acc, curr) => acc + curr.count, 0) || 1200;
  const growthData = [
    { date: 'Jan 26', count: Math.floor(totalItemsCount * 0.15) },
    { date: 'Feb 26', count: Math.floor(totalItemsCount * 0.35) },
    { date: 'Mar 26', count: Math.floor(totalItemsCount * 0.60) },
    { date: 'Apr 26', count: Math.floor(totalItemsCount * 0.75) },
    { date: 'May 26', count: Math.floor(totalItemsCount * 0.90) },
    { date: 'Jun 26', count: totalItemsCount }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#30363D] pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F0F6FC]">Analytics Dashboard</h1>
          <p className="text-[#8B949E] text-sm">
            Interactive metrics, codebase aggregate charts, and contributions activity maps.
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-[#c9d1d9] hover:text-[#f0f6fc] border border-[#30363D] font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-2xl flex items-start gap-3 text-rose-400">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-sm">Failed to Load Aggregated Analytics</h4>
            <p className="text-xs text-rose-400/80">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-xs font-bold underline cursor-pointer hover:text-rose-300"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !analytics ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index}
              className="bg-[#21262D] border border-[#30363D] p-6 rounded-2xl h-80"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* 1. GitHub Contribution Calendar widget */}
          <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-[#F0F6FC] flex items-center gap-2">
                  <Flame className="w-4.5 h-4.5 text-[#f0883e]" /> Dataset Contribution Activity
                </h3>
                <p className="text-xs text-[#8B949E] mt-0.5">Mock activity map detailing synchronization batches processed over the past year.</p>
              </div>
              
              {/* Tooltip detail */}
              <div className="h-6 text-xs text-[#8B949E] font-medium transition-opacity duration-150">
                {hoveredDay ? (
                  <span>
                    <strong className="text-[#F0F6FC]">{hoveredDay.count} sync logs</strong> on {hoveredDay.date}
                  </span>
                ) : (
                  <span>Hover squares for details</span>
                )}
              </div>
            </div>

            {/* Grid wrapper */}
            <div className="overflow-x-auto pb-2 scrollbar-none">
              <div className="flex gap-1 min-w-[700px] select-none justify-between">
                {/* 53 columns */}
                {contributionGrid.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="h-[9.5px] w-[9.5px] rounded-[1.5px] transition-all cursor-pointer hover:scale-110"
                        style={{ backgroundColor: day.color }}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Labels footer */}
              <div className="flex justify-between items-center text-[10px] text-[#8B949E] pt-3 font-semibold px-1 select-none">
                <div className="flex gap-14">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <span className="h-2 w-2 rounded-[1px] bg-[#21262D]" />
                  <span className="h-2 w-2 rounded-[1px] bg-[#0e4429]" />
                  <span className="h-2 w-2 rounded-[1px] bg-[#006d32]" />
                  <span className="h-2 w-2 rounded-[1px] bg-[#26a641]" />
                  <span className="h-2 w-2 rounded-[1px] bg-[#39d353]" />
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Classification type distribution donut */}
            <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl flex flex-col h-[340px] justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-[#F0F6FC] flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-[#58A6FF]" />
                  Classification Type Distribution
                </h3>
                <p className="text-xs text-[#8B949E] mt-0.5">
                  Visual ratio comparison of training dataset classification types.
                </p>
              </div>
              <div className="flex-1 min-h-0 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconSize={8} 
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-bold capitalize text-[#c9d1d9]">{value.replace('_', ' ')}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Cumulative growth AreaChart */}
            <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl flex flex-col h-[340px] justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-[#F0F6FC] flex items-center gap-1.5">
                  <Activity className="w-4.5 h-4.5 text-[#3FB950]" />
                  Dataset Cumulative Growth
                </h3>
                <p className="text-xs text-[#8B949E] mt-0.5">
                  Chronological progression of records integrated into the database.
                </p>
              </div>
              <div className="flex-1 min-h-0 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                    <XAxis dataKey="date" stroke="#8B949E" fontSize={10} fontStyle="mono" />
                    <YAxis stroke="#8B949E" fontSize={10} fontStyle="mono" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#21262D', borderColor: '#30363D', borderRadius: '8px' }}
                      labelStyle={{ color: '#F0F6FC', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="count" name="Total Records" stroke="#3FB950" fill="rgba(63, 185, 80, 0.15)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Languages Breakdown */}
            <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl flex flex-col h-[340px] justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-[#F0F6FC] flex items-center gap-1.5">
                  <BarChart3 className="w-4.5 h-4.5 text-[#bc8cff]" />
                  Language Extension Volumes
                </h3>
                <p className="text-xs text-[#8B949E] mt-0.5">
                  Total dataset items grouped by code extension format.
                </p>
              </div>
              <div className="flex-1 min-h-0 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={languageData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363D" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#8B949E"
                      fontSize={10}
                      className="uppercase font-bold"
                    />
                    <YAxis stroke="#8B949E" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                    <Bar dataKey="count" fill="#bc8cff" radius={[4, 4, 0, 0]} barSize={22}>
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Top Repository Sources */}
            <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl flex flex-col h-[340px] justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-[#F0F6FC] flex items-center gap-1.5">
                  <BarChart3 className="w-4.5 h-4.5 text-[#f0883e]" />
                  Top Contribution Repositories
                </h3>
                <p className="text-xs text-[#8B949E] mt-0.5">
                  Repositories contributing the largest volume of dataset samples.
                </p>
              </div>
              <div className="flex-1 min-h-0 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={repoData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#30363D" />
                    <XAxis type="number" stroke="#8B949E" fontSize={10} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={90}
                      stroke="#8B949E"
                      fontSize={9}
                      tickFormatter={(val) => val.length > 12 ? `${val.substring(0, 10)}...` : val}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                      {repoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
