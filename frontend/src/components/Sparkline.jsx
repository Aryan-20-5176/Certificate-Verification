import { motion } from 'framer-motion';

const Sparkline = ({ data, color = '#10b981', height = 40 }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const step = width / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * step,
    y: height - ((val - min) / range) * height
  }));

  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="w-full h-16 group-hover:scale-105 transition-transform duration-500">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`} 
        className="overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Glow effect */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={`${pathData} L ${width},${height} L 0,${height} Z`}
          fill={`url(#gradient)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Trading "Sticking" Pulse (Vertical lines at each point) */}
        {points.map((p, i) => (
          <motion.line
            key={i}
            x1={p.x}
            y1={height}
            x2={p.x}
            y2={p.y}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: height - p.y, opacity: 0.8 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{ filter: 'url(#glow)' }}
          />
        ))}

        {/* Main Line (The Candle Trend) */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: 'url(#glow)' }}
        />
        
        {/* Trading Dot */}
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.8, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ filter: 'url(#glow)' }}
        />
      </svg>
    </div>
  );
};

export default Sparkline;
