import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onToggleDarkMode}
          className="p-3 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30 dark:border-white/10"
          aria-label="Toggle dark mode"
        >
          <span className="text-2xl">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
        </button>
      </div>

      <div className="max-w-lg w-full">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="text-8xl drop-shadow-lg">🃏</span>
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            Scrum Poker
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Team story estimation made simple and fun
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          <Link 
            to="/create" 
            className="group block w-full"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-slate-700/50 hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-slate-800/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Create Room</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Start a new estimation session</p>
                  </div>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/join" 
            className="group block w-full"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-slate-700/50 hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-slate-800/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Join Room</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Enter with room code</p>
                  </div>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="text-center space-y-3">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Available cards: 1, 2, 3, 5, 8, 13, 21, ?
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">Real-time voting</span>
            <span className="bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">Team avatars</span>
            <span className="bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">Dark mode</span>
            <span className="bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">Mobile friendly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 