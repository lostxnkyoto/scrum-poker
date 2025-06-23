import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const AVATARS = ['😄', '😎', '🤖', '👨‍💻', '👩‍💻', '🦄', '🐱', '🐶', '🦊', '🐸', '🦝', '🐼'];

const JoinRoom = ({ onJoinRoom, onBack, error, loading, onClearError, isDarkMode, onToggleDarkMode, autoFillCode = false }) => {
  const { roomCode: urlRoomCode } = useParams();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  useEffect(() => {
    if (urlRoomCode && autoFillCode) {
      setRoomCode(urlRoomCode.toUpperCase());
    }
  }, [urlRoomCode, autoFillCode]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onClearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomCode.trim().length === 6 && playerName.trim()) {
      onJoinRoom(roomCode.toUpperCase(), playerName.trim(), selectedAvatar);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/room/${roomCode}`;
    navigator.clipboard.writeText(link);
  };

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

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 hover:scale-110 transition-transform duration-300">
            <span className="text-6xl">🎯</span>
          </Link>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Room
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Enter room code and your name
          </p>
        </div>
        
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength="6"
                className="w-full px-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm text-center text-2xl font-mono font-bold tracking-widest"
                required
              />
              {roomCode && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mt-2 transition-colors"
                >
                  📋 Copy room link
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Choose Your Avatar
              </label>
              <div className="grid grid-cols-6 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      aspect-square rounded-xl text-2xl transition-all duration-300 hover:scale-110 border-2
                      ${selectedAvatar === avatar
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg shadow-blue-500/25 scale-105'
                        : 'border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-500'
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3 pt-2">
              <Link
                to="/"
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 px-6 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 font-semibold text-center"
              >
                ← Home
              </Link>
              <button
                type="submit"
                disabled={loading || roomCode.length !== 6 || !playerName.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Joining...</span>
                  </div>
                ) : (
                  <span>🎯 Join Room</span>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            Tips for beginners:
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 dark:border-slate-700/30">
              <span className="text-lg mb-1 block">🃏</span>
              <span className="text-slate-600 dark:text-slate-300">Choose card</span>
            </div>
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 dark:border-slate-700/30">
              <span className="text-lg mb-1 block">👥</span>
              <span className="text-slate-600 dark:text-slate-300">Wait for all</span>
            </div>
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 dark:border-slate-700/30">
              <span className="text-lg mb-1 block">🎭</span>
              <span className="text-slate-600 dark:text-slate-300">View results</span>
            </div>
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 dark:border-slate-700/30">
              <span className="text-lg mb-1 block">🔄</span>
              <span className="text-slate-600 dark:text-slate-300">Discuss & repeat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom; 