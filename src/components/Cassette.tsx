import React from 'react';
import { motion } from 'motion/react';

interface CassetteProps {
  isPlaying: boolean;
  label?: string;
}

export function Cassette({ isPlaying, label = "MIX TAPE" }: CassetteProps) {
  return (
    <div className="relative w-full max-w-[400px] aspect-[1.6/1] bg-neutral-800 rounded-xl shadow-2xl p-4 flex flex-col items-center justify-between border-4 border-neutral-900 mx-auto">
      {/* Top Screws */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-neutral-600 shadow-inner flex items-center justify-center">
        <div className="w-full h-[1px] bg-neutral-800 rotate-45"></div>
      </div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-neutral-600 shadow-inner flex items-center justify-center">
        <div className="w-full h-[1px] bg-neutral-800 -rotate-45"></div>
      </div>

      {/* Cassette Label Area */}
      <div className="w-full h-3/4 bg-neutral-200 rounded-md p-2 flex flex-col relative overflow-hidden shadow-inner">
        {/* Label Header */}
        <div className="w-full h-6 bg-red-700 rounded-t-sm flex items-center px-2 mb-2">
          <span className="text-white text-[10px] font-sans font-bold tracking-widest">A</span>
        </div>
        
        {/* Title */}
        <div className="text-center font-serif italic font-bold text-neutral-800 text-xl border-b border-neutral-400 pb-1 mb-2 truncate px-4">
          {label}
        </div>

        {/* Reels Container */}
        <div className="flex-1 flex items-center justify-center gap-12 relative z-10">
          {/* Left Reel */}
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center shadow-inner">
            <motion.div 
              className="w-16 h-16 rounded-full border-4 border-neutral-600 flex items-center justify-center relative"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              {/* Spokes */}
              <div className="absolute w-full h-1 bg-neutral-600"></div>
              <div className="absolute w-1 h-full bg-neutral-600"></div>
              <div className="absolute w-full h-1 bg-neutral-600 rotate-45"></div>
              <div className="absolute w-1 h-full bg-neutral-600 rotate-45"></div>
              {/* Center Hub */}
              <div className="w-6 h-6 rounded-full bg-neutral-300 z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
              </div>
            </motion.div>
          </div>

          {/* Right Reel */}
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center shadow-inner">
            <motion.div 
              className="w-16 h-16 rounded-full border-4 border-neutral-600 flex items-center justify-center relative"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              {/* Spokes */}
              <div className="absolute w-full h-1 bg-neutral-600"></div>
              <div className="absolute w-1 h-full bg-neutral-600"></div>
              <div className="absolute w-full h-1 bg-neutral-600 rotate-45"></div>
              <div className="absolute w-1 h-full bg-neutral-600 rotate-45"></div>
              {/* Center Hub */}
              <div className="w-6 h-6 rounded-full bg-neutral-300 z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tape window */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-neutral-900/20 rounded-full z-0 pointer-events-none border border-neutral-400/50"></div>
      </div>

      {/* Bottom Trapezoid Area */}
      <div className="w-3/4 h-1/5 bg-neutral-700 mt-2 rounded-t-lg flex items-center justify-around px-8 shadow-inner border-t-2 border-neutral-600">
        <div className="w-4 h-4 rounded-full bg-neutral-900 shadow-inner"></div>
        <div className="w-4 h-4 rounded-full bg-neutral-900 shadow-inner"></div>
      </div>

      {/* Bottom Screws */}
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-neutral-600 shadow-inner flex items-center justify-center">
        <div className="w-full h-[1px] bg-neutral-800 rotate-[30deg]"></div>
      </div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-neutral-600 shadow-inner flex items-center justify-center">
        <div className="w-full h-[1px] bg-neutral-800 -rotate-[60deg]"></div>
      </div>
    </div>
  );
}
