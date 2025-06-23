import React from 'react';

const PlayerList = ({ players, cards, isRevealed, currentPlayerId, roomInfo }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50 dark:border-slate-700/50">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
        <span className="mr-3 text-2xl">👥</span>
        Participants ({players.length})
      </h3>
      
      <div className="space-y-3">
        {players.map((player) => {
          const hasSelectedCard = roomInfo?.votedPlayers?.includes(player.id) || false;
          const cardValue = isRevealed && cards ? cards[player.id] : null;
          const isCurrentPlayer = player.id === currentPlayerId;
          
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                isCurrentPlayer 
                  ? 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/30 shadow-md' 
                  : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="text-2xl">
                    {player.avatar || '😄'}
                  </div>
                  
                  {hasSelectedCard && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-slate-800" />
                  )}
                </div>
                
                <div className="flex flex-col">
                  <div className="font-semibold text-slate-800 dark:text-white text-sm">
                    {player.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {player.isHost && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
                        ⭐ Scrum Master
                      </span>
                    )}
                    {isCurrentPlayer && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                {isRevealed && cardValue !== null ? (
                  <div className={`px-3 py-2 rounded-lg text-sm font-bold min-w-[2.5rem] text-center ${
                    cardValue === '?' 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    {cardValue}
                  </div>
                ) : hasSelectedCard ? (
                  <div className="text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    Ready
                  </div>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400 text-xs font-medium px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    Waiting
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            👥 {players.length} participants
          </span>
          {cards && (
            <span className="text-slate-600 dark:text-slate-400">
              ✓ {Object.keys(cards).length} voted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerList; 