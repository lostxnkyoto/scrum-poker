import React, { useState } from 'react';
import PlayerList from './PlayerList';

const CARDS = [1, 2, 3, 5, 8, 13, 21, '?'];

const GameRoom = ({ 
  roomInfo, 
  playerId, 
  playerName, 
  onSelectCard, 
  onRevealCards, 
  onResetVoting, 
  onBackToMenu,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!roomInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading room...</p>
        </div>
      </div>
    );
  }

  const currentPlayer = roomInfo.players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;
  
  const canReveal = roomInfo.canReveal || roomInfo.selectedCount > 0;
  const hasCards = roomInfo.selectedCount > 0;
  
  const progressCount = roomInfo.nonHostPlayersCount || roomInfo.totalPlayers;
  const progressSelected = roomInfo.nonHostVotedCount !== undefined ? roomInfo.nonHostVotedCount : roomInfo.selectedCount;

  const handleCardSelect = (cardValue) => {
    if (roomInfo.isRevealed) return;
    
    setSelectedCard(cardValue);
    onSelectCard(cardValue);
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}/room/${roomInfo.code}`;
    navigator.clipboard.writeText(url);
    setShowShareModal(false);
  };

  const getCardStats = () => {
    if (!roomInfo.cards || !roomInfo.isRevealed) return null;
    
    const values = Object.values(roomInfo.cards).filter(v => v !== '?');
    const numericValues = values.filter(v => typeof v === 'number');
    
    if (numericValues.length === 0) return null;
    
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const avg = sum / numericValues.length;
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    
    return { avg: avg.toFixed(1), min, max, count: values.length };
  };

  const stats = getCardStats();

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border-b border-white/20 dark:border-slate-700/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🃏</span>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Scrum Poker
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Room: <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">{roomInfo.code}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm"
                aria-label="Toggle dark mode"
              >
                <span className="text-xl">
                  {isDarkMode ? '☀️' : '🌙'}
                </span>
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-blue-500/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/20 dark:hover:bg-blue-400/20 transition-all duration-200 text-sm font-semibold border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
              >
                📤 Share
              </button>
              <button
                onClick={onBackToMenu}
                className="bg-red-500/10 dark:bg-red-400/10 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 dark:hover:bg-red-400/20 transition-all duration-200 text-sm font-semibold border border-red-200/50 dark:border-red-700/50 backdrop-blur-sm"
              >
                🚪 Leave
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-slate-700/50">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                <span className="mr-3 text-3xl">🎯</span>
                Choose Your Card
              </h2>
              
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mb-8">
                {CARDS.map((card) => (
                  <button
                    key={card}
                    onClick={() => handleCardSelect(card)}
                    disabled={roomInfo.isRevealed}
                    className={`
                      aspect-[3/4] rounded-2xl font-black text-xl transition-all duration-300 shadow-lg hover:shadow-xl border-2 backdrop-blur-sm
                      ${selectedCard === card
                        ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25 transform scale-105'
                        : 'border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-white/90 dark:hover:bg-slate-700/90 hover:scale-105'
                      }
                      ${roomInfo.isRevealed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}
                    `}
                  >
                    {card}
                  </button>
                ))}
              </div>

              {isHost && !roomInfo.isRevealed && (
                <div className="text-center text-sm text-slate-500 dark:text-slate-400 bg-purple-50/50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                  💡 <strong>Scrum Master:</strong> You can reveal cards at any time. Anyone who didn't vote will show "?".
                </div>
              )}

            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
                  <span className="mr-3 text-2xl">📊</span>
                  Voting Progress
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">
                    {progressSelected} / {progressCount}
                  </span>
                  {roomInfo.nonHostPlayersCount !== undefined && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      (participants only)
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-4 shadow-inner overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-700 shadow-lg"
                  style={{ width: `${progressCount > 0 ? (progressSelected / progressCount) * 100 : 0}%` }}
                ></div>
              </div>
              
              {roomInfo.allNonHostsVoted && !roomInfo.isRevealed && (
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400 font-bold bg-green-100/80 dark:bg-green-900/30 px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 backdrop-blur-sm shadow-lg">
                    <span className="mr-2 text-lg">🎉</span>
                    All participants have voted!
                  </span>
                </div>
              )}
            </div>

            {isHost && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                  <span className="mr-2 text-2xl">⚡</span>
                  Scrum Master Controls
                </h3>
                
                <div className="space-y-3">
                  {!roomInfo.isRevealed ? (
                    <button
                      onClick={onRevealCards}
                      disabled={!canReveal}
                      className={`
                        w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg backdrop-blur-sm
                        ${canReveal
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-xl transform hover:scale-[1.02] border border-green-400/50'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-600'
                        }
                      `}
                    >
                      <span className="mr-2 text-xl">🎭</span>
                      Reveal Cards
                    </button>
                  ) : (
                    <button
                      onClick={onResetVoting}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] border border-amber-400/50 backdrop-blur-sm"
                    >
                      <span className="mr-2 text-xl">🔄</span>
                      New Round
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                  {!roomInfo.isRevealed 
                    ? hasCards
                      ? `You can reveal cards at any time. Participants: ${roomInfo.nonHostVotedCount || 0}/${roomInfo.nonHostPlayersCount || 0}`
                      : 'Waiting for someone to vote'
                    : 'Start a new voting round'
                  }
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <PlayerList
              players={roomInfo.players}
              cards={roomInfo.cards}
              isRevealed={roomInfo.isRevealed}
              currentPlayerId={playerId}
            />

            {roomInfo.isRevealed && stats && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                  <span className="mr-2 text-xl">📈</span>
                  Results
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.avg}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Average</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm">
                    <div className="text-3xl font-black text-green-600 dark:text-green-400">{stats.count}</div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Votes</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50/80 to-amber-100/80 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm">
                    <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.min}</div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Minimum</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl border border-red-200/50 dark:border-red-700/50 backdrop-blur-sm">
                    <div className="text-3xl font-black text-red-600 dark:text-red-400">{stats.max}</div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-semibold">Maximum</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 border border-white/50 dark:border-slate-700/50 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white flex items-center">
              <span className="mr-3 text-3xl">📤</span>
              Share Room
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Share this link with your team members:
            </p>
            <div className="bg-slate-100/80 dark:bg-slate-700/80 rounded-2xl p-6 text-center mb-6 border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Room Code</div>
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-wider mb-3">
                {roomInfo.code}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 break-all bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg">
                {window.location.origin}/room/{roomInfo.code}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200 font-semibold"
              >
                Close
              </button>
              <button
                onClick={copyRoomLink}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg"
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom; 