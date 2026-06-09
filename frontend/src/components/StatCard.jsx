import React, { useEffect, useState } from 'react';

const CountUp = ({ end, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof end !== 'number') return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{typeof end === 'number' ? count.toLocaleString() : end}</span>;
};

const StatCard = ({ title, value, icon: Icon, color = 'brand', description, loading }) => {
  const colorMap = {
    brand: 'text-[#58A6FF] border-[#58A6FF]/20 bg-[#58A6FF]/5',
    purple: 'text-[#bc8cff] border-[#bc8cff]/20 bg-[#bc8cff]/5',
    emerald: 'text-[#3FB950] border-[#3FB950]/20 bg-[#3FB950]/5',
    blue: 'text-[#58A6FF] border-[#58A6FF]/20 bg-[#58A6FF]/5',
    rose: 'text-[#F85149] border-[#F85149]/20 bg-[#F85149]/5',
    amber: 'text-[#d29922] border-[#d29922]/20 bg-[#d29922]/5',
    cyan: 'text-[#39c5cf] border-[#39c5cf]/20 bg-[#39c5cf]/5',
    indigo: 'text-[#bc8cff] border-[#bc8cff]/20 bg-[#bc8cff]/5',
    pink: 'text-[#ff7b72] border-[#ff7b72]/20 bg-[#ff7b72]/5',
    orange: 'text-[#f0883e] border-[#f0883e]/20 bg-[#f0883e]/5',
  };

  const selectedColor = colorMap[color] || colorMap.brand;

  if (loading) {
    return (
      <div className="bg-[#21262D] border border-[#30363D] p-5 rounded-xl flex flex-col justify-between h-32 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-[#30363D] rounded w-2/3" />
          <div className="h-8 w-8 bg-[#30363D] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-[#30363D] rounded w-1/2" />
          <div className="h-3 bg-[#30363D] rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#21262D] border border-[#30363D] p-5 rounded-xl hover:border-[#8b949e] transition-all duration-200 flex flex-col justify-between h-32 group relative shadow-sm">
      
      {/* Decorative tiny top border highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-[#58A6FF] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider group-hover:text-[#F0F6FC] transition-colors select-none">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${selectedColor} transition-transform duration-200 group-hover:scale-105`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="text-2xl font-bold tracking-tight text-[#F0F6FC] font-mono leading-none">
          <CountUp end={value} />
        </h3>
        {description && (
          <p className="text-[10px] text-[#8B949E] mt-1.5 font-medium truncate" title={description}>{description}</p>
        )}
      </div>

    </div>
  );
};

export default StatCard;
