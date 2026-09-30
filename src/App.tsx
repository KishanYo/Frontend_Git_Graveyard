import React, { useState, useEffect, useRef } from 'react';
import { Skull } from 'lucide-react';
import gsap from 'gsap';

type Classification = 'potentially_abandoned' | 'suspicious' | 'inactive' | 'healthy';

interface GraveData {
  path: string;
  commit_count: number;
  days_since_last_modified: number;
  file_age_days: number;
  staleness_score: number;
  classification: Classification;
  signals: string[];
}

const mockGraveyardData: GraveData[] = [
  { path: 'backend/legacy_parser.py', staleness_score: 94, classification: 'potentially_abandoned', commit_count: 1, days_since_last_modified: 400, file_age_days: 410, signals: [] },
  { path: 'backend/old_models.py', staleness_score: 89, classification: 'potentially_abandoned', commit_count: 2, days_since_last_modified: 350, file_age_days: 400, signals: [] },
  { path: 'scripts/cleanup_v1.sh', staleness_score: 75, classification: 'suspicious', commit_count: 5, days_since_last_modified: 120, file_age_days: 300, signals: [] },
  { path: 'frontend/src/utils/old-regex.ts', staleness_score: 72, classification: 'suspicious', commit_count: 3, days_since_last_modified: 90, file_age_days: 200, signals: [] },
  { path: 'docs/archived.md', staleness_score: 55, classification: 'inactive', commit_count: 10, days_since_last_modified: 45, file_age_days: 150, signals: [] },
  { path: 'config/settings.yml', staleness_score: 41, classification: 'inactive', commit_count: 15, days_since_last_modified: 30, file_age_days: 100, signals: [] },
  { path: 'backend/app.py', staleness_score: 12, classification: 'healthy', commit_count: 50, days_since_last_modified: 2, file_age_days: 200, signals: [] },
  { path: 'frontend/src/App.tsx', staleness_score: 5, classification: 'healthy', commit_count: 120, days_since_last_modified: 0, file_age_days: 50, signals: [] },
];

function Tombstone({ grave }: { grave: GraveData }) {
  const barRef = useRef<HTMLDivElement>(null);
  const stoneRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, { width: `${grave.staleness_score}%`, duration: 1.2, ease: 'power2.out', delay: 0.6 });
    }
  }, [grave.staleness_score]);

  const colorClass = {
    potentially_abandoned: 'grave-tint-abandoned',
    suspicious: 'grave-tint-suspicious',
    inactive: 'grave-tint-inactive',
    healthy: 'grave-tint-healthy',
  }[grave.classification];

  const barColor = {
    potentially_abandoned: 'bg-graveyard-abandoned',
    suspicious: 'bg-graveyard-suspicious',
    inactive: 'bg-graveyard-inactive',
    healthy: 'bg-graveyard-healthy',
  }[grave.classification];

  const hash = grave.path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rot = (hash % 5) - 2;
  const scale = 0.96 + ((hash % 8) / 100);

  return (
    <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] relative z-20">
      <img 
        ref={stoneRef}
        src="/tombstone.png"
        alt="Grave"
        className={`tombstone-img ${colorClass}`}
        style={{ 
          transform: `rotate(${rot}deg) scale(${scale})` 
        }}
      />

      <div className="w-[120px] sm:w-[130px] h-2 bg-graveyard-track mt-1 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.05)]">
        <div ref={barRef} className={`h-full w-0 ${barColor} shadow-[0_0_8px_currentColor] opacity-90 group-hover:opacity-100 group-hover:brightness-125 transition-all`} />
      </div>

      <div className="font-mono text-[10px] md:text-[11px] text-[#71717A] mt-3 w-full text-center truncate group-hover:text-graveyard-textPrimary group-hover:drop-shadow-md transition-all px-2">
        {grave.path}
      </div>
    </div>
  );
}

function App() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<GraveData[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      };
      
      const layers = document.querySelectorAll('.parallax-layer');
      layers.forEach((layer) => {
        const speed = layer.getAttribute('data-speed') || '0';
        gsap.to(layer, {
          x: mouseRef.current.x * parseFloat(speed),
          y: mouseRef.current.y * parseFloat(speed),
          duration: 0.8,
          ease: 'power1.out',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(mockGraveyardData);
    }, 2000);
  };

  useEffect(() => {
    if (results) {
      gsap.fromTo('.grave-enter', 
        { opacity: 0, y: 40, scale: 0.94 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [results]);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center pb-24">
      <div className="moonlight parallax-layer" data-speed="15" />
      <div className="environment-fog parallax-layer" data-speed="30" />
      <div className="environment-fog-front parallax-layer" data-speed="45" />
      
      <div className="w-full max-w-[1400px] px-8 md:px-12 py-10 relative z-10 flex flex-col min-h-screen">
        
        <header className="flex items-center gap-3 mb-8 self-start">
          <Skull className="w-6 h-6 text-[#F5F5F7] opacity-90" />
          <h1 className="text-[#F5F5F7] font-ui font-semibold text-[22px] tracking-tight">Git Graveyard</h1>
        </header>

        <div className="flex gap-4 w-full max-w-xl self-start">
          <input 
            type="text" 
            placeholder="Enter Github URL or Local Repository Path"
            disabled={analyzing}
            className="flex-1 bg-[#1A1A1F] border border-[#2A2A30] rounded-lg px-4 py-2.5 text-[#F5F5F7] placeholder-[#8A8A92] focus:outline-none focus:border-[#4A4A52] transition-colors text-sm disabled:opacity-50 shadow-inner"
          />
          <button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="bg-[#2a241b] hover:bg-[#382f22] text-[#F5F5F7] px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all border border-[#4a3a24] shadow-[0_2px_10px_rgba(0,0,0,0.5)] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] hover:shadow-[0_4px_15px_rgba(200,120,40,0.15)] group"
          >
            {analyzing ? (
              <span className="flex items-center gap-2 text-[#c0864a] text-sm">
                <span className="w-[6px] h-[6px] bg-[#c0864a] rounded-full animate-ping" />
                Analyzing
              </span>
            ) : (
               <span className="group-hover:translate-y-[-1px] transition-transform">Analyze</span>
            )}
          </button>
        </div>

        {results && (
          <div className="mt-20 w-full animate-in fade-in duration-1000">
            <h2 className="text-[#F5F5F7] font-ui font-semibold text-xl mb-16 tracking-tight">Graveyard Report</h2>
            
            <div className="parallax-layer" data-speed="25" ref={containerRef}>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-20 justify-items-center">
                {results.map((grave, idx) => (
                  <div key={idx} className="grave-enter opacity-0 relative">
                    <Tombstone grave={grave} />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
