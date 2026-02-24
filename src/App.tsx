import React, { useState, useEffect, useRef } from 'react';
import { Cassette } from './components/Cassette';
import { Play, Pause, Volume2, VolumeX, Loader2, Music, Paintbrush, Code } from 'lucide-react';

interface Station {
  stationuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
}

export default function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        // Fetch top stations, limit to 20 to have a good selection
        const response = await fetch('https://de1.api.radio-browser.info/json/stations/topclick?limit=20');
        if (!response.ok) throw new Error('Failed to fetch stations');
        const data = await response.json();
        
        // Filter out stations without a valid URL
        const validStations = data.filter((s: Station) => s.url_resolved);
        setStations(validStations);
        
        if (validStations.length > 0) {
          setCurrentStation(validStations[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (!audioRef.current || !currentStation) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If the src is empty or changed, we need to set it
      if (audioRef.current.src !== currentStation.url_resolved) {
        audioRef.current.src = currentStation.url_resolved;
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
            setError("Failed to play this station. Try another one.");
          });
      }
    }
  };

  const handleStationSelect = (station: Station) => {
    if (currentStation?.stationuuid === station.stationuuid) {
      handlePlayPause();
      return;
    }

    setCurrentStation(station);
    setIsPlaying(false);
    setError(null);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = station.url_resolved;
      
      // Auto-play when selecting a new station
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
            setError("Failed to play this station. Try another one.");
          });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center mb-16 w-full">
        <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight mb-4 text-neutral-800">
          you are not immune<br />
          <span className="text-6xl md:text-8xl">to nostalgia.</span>
        </h1>
        <p className="font-cursive text-neutral-600 max-w-2xl mx-auto text-3xl md:text-4xl leading-relaxed mt-8">
          "On the radio, everyone is as beautiful as you imagine them to be."
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col md:flex-row gap-12 items-start justify-center">
        
        {/* Left Column: Player */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="mb-8 w-full">
            <Cassette 
              isPlaying={isPlaying} 
              label={currentStation ? currentStation.name : "Loading..."} 
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-full max-w-[400px] bg-white/50 p-6 rounded-2xl shadow-sm border border-neutral-200/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-6 mb-6">
              <button 
                onClick={handlePlayPause}
                disabled={!currentStation || isLoading}
                className="w-16 h-16 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center w-full gap-4 px-4">
              <button onClick={() => setIsMuted(!isMuted)} className="text-neutral-600 hover:text-neutral-900">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-800"
              />
            </div>

            {error && (
              <div className="mt-4 text-red-600 text-sm font-sans text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Station List */}
        <div className="w-full md:w-1/2 flex flex-col h-[500px]">
          <h2 className="font-serif text-2xl italic mb-4 text-neutral-800 border-b border-neutral-300 pb-2">
            Top Stations
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-neutral-500">
                <Loader2 className="animate-spin mr-2" /> Loading stations...
              </div>
            ) : (
              <ul className="space-y-2">
                {stations.map((station) => {
                  const isActive = currentStation?.stationuuid === station.stationuuid;
                  return (
                    <li key={station.stationuuid}>
                      <button
                        onClick={() => handleStationSelect(station)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-4 group
                          ${isActive 
                            ? 'bg-neutral-800 text-white shadow-md' 
                            : 'bg-white/40 hover:bg-white/80 text-neutral-800 border border-neutral-200/50'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                          ${isActive ? 'bg-neutral-700' : 'bg-neutral-200 group-hover:bg-neutral-300'}`}>
                          {isActive && isPlaying ? (
                            <div className="flex gap-1 items-end h-4">
                              <div className="w-1 bg-white animate-[bounce_1s_infinite] h-full"></div>
                              <div className="w-1 bg-white animate-[bounce_1s_infinite_0.2s] h-2/3"></div>
                              <div className="w-1 bg-white animate-[bounce_1s_infinite_0.4s] h-full"></div>
                            </div>
                          ) : (
                            <Play size={16} className={isActive ? 'text-white ml-1' : 'text-neutral-500 ml-1'} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-sans font-medium truncate ${isActive ? 'text-white' : 'text-neutral-900'}`}>
                            {station.name || 'Unknown Station'}
                          </h3>
                          <p className={`text-xs truncate mt-1 ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {station.tags ? station.tags.split(',').slice(0, 3).join(', ') : station.country || 'Various'}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setError("Stream offline or unsupported format.");
        }}
      />

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-neutral-300 w-full flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-neutral-600 font-sans pb-8">
        <a href="https://www.radio-browser.info/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neutral-900 transition-colors">
          <Music size={16} className="text-neutral-900" />
          <span>Powered by Radio-Browser</span>
        </a>
        <a href="https://henry.codes/writing/a-website-to-destroy-all-websites/?ref=DenseDiscovery-376" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neutral-900 transition-colors">
          <Paintbrush size={16} className="text-neutral-900" />
          <span>Theme Inspiration</span>
        </a>
        <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neutral-900 transition-colors">
          <Code size={16} className="text-neutral-900" />
          <span>Built with AI Studio</span>
        </a>
      </footer>
    </div>
  );
}
