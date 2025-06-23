import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { socket, connectSocket, disconnectSocket } from './socket';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import GameRoom from './components/GameRoom';
import Home from './components/Home';

function AppContent() {
  const navigate = useNavigate();
  const [roomInfo, setRoomInfo] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('😄');
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    connectSocket();

    socket.on('connect', () => {});

    socket.on('disconnect', () => {});

    socket.on('room-created', (data) => {
      const currentPlayer = data.roomInfo.players.find(p => p.id === data.playerId);
      if (currentPlayer) {
        setPlayerName(currentPlayer.name);
        setPlayerAvatar(currentPlayer.avatar);
      }
      
      setRoomInfo(data.roomInfo);
      setPlayerId(data.playerId);
      setLoading(false);
      setError(null);
      
      navigate(`/room/${data.roomCode}`);
    });

    socket.on('room-joined', (data) => {
      const currentPlayer = data.roomInfo.players.find(p => p.id === data.playerId);
      if (currentPlayer) {
        setPlayerName(currentPlayer.name);
        setPlayerAvatar(currentPlayer.avatar);
      }
      
      setRoomInfo(data.roomInfo);
      setPlayerId(data.playerId);
      setLoading(false);
      setError(null);
    });

    socket.on('room-updated', (data) => {
      setRoomInfo(data);
    });

    socket.on('cards-revealed', (data) => {
      setRoomInfo(data);
    });

    socket.on('voting-reset', (data) => {
      setRoomInfo(data);
    });

    socket.on('error', (data) => {
      setError(data.message);
      setLoading(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('room-updated');
      socket.off('cards-revealed');
      socket.off('voting-reset');
      socket.off('error');
      disconnectSocket();
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleCreateRoom = (name, avatar) => {
    setPlayerName(name);
    setPlayerAvatar(avatar);
    setLoading(true);
    setError(null);
    
    socket.emit('create-room', { playerName: name, avatar });
  };

  const handleJoinRoom = (roomCode, name, avatar) => {
    setPlayerName(name);
    setPlayerAvatar(avatar);
    setLoading(true);
    setError(null);
    
    socket.emit('join-room', { roomCode, playerName: name, avatar });
  };

  const handleSelectCard = (cardValue) => {
    socket.emit('select-card', { cardValue });
  };

  const handleRevealCards = () => {
    socket.emit('reveal-cards');
  };

  const handleResetVoting = () => {
    socket.emit('reset-voting');
  };

  const handleBackToMenu = () => {
    setRoomInfo(null);
    setPlayerId(null);
    setPlayerName('');
    setPlayerAvatar('😄');
    navigate('/');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Routes>
        <Route 
          path="/" 
          element={<Home isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />} 
        />
        <Route 
          path="/create" 
          element={
            <CreateRoom 
              onCreateRoom={handleCreateRoom}
              onBack={() => navigate('/')}
              error={error}
              loading={loading}
              onClearError={clearError}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          } 
        />
        <Route 
          path="/join" 
          element={
            <JoinRoom 
              onJoinRoom={handleJoinRoom}
              onBack={() => navigate('/')}
              error={error}
              loading={loading}
              onClearError={clearError}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          } 
        />
        <Route 
          path="/room/:roomCode" 
          element={
            roomInfo ? (
              <GameRoom 
                roomInfo={roomInfo}
                playerId={playerId}
                playerName={playerName}
                onSelectCard={handleSelectCard}
                onRevealCards={handleRevealCards}
                onResetVoting={handleResetVoting}
                onBackToMenu={handleBackToMenu}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
              />
            ) : (
              <JoinRoom 
                onJoinRoom={handleJoinRoom}
                onBack={() => navigate('/')}
                error={error}
                loading={loading}
                onClearError={clearError}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                autoFillCode={true}
              />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 