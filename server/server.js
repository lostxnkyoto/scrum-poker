const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const rooms = new Map();

function generateRoomCode() {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (rooms.has(code));
  return code;
}

function getRoomInfo(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) {
    return null;
  }

  const players = Array.from(room.players.values()).filter(p => !p.isSystem);
  const selectedCount = room.cards.size;
  
  const nonHostPlayers = players.filter(p => !p.isHost);
  const nonHostVoted = Array.from(room.cards.keys())
    .filter(socketId => {
      const player = room.players.get(socketId);
      return player && !player.isHost && !player.isSystem;
    }).length;
  
  const allNonHostsVoted = nonHostPlayers.length > 0 && nonHostVoted === nonHostPlayers.length;
  
  const roomInfo = {
    code: room.code,
    host: room.host,
    players,
    totalPlayers: players.length,
    selectedCount,
    nonHostPlayersCount: nonHostPlayers.length,
    nonHostVotedCount: nonHostVoted,
    allNonHostsVoted,
    canReveal: selectedCount > 0,
    isRevealed: room.isRevealed,
    cards: room.isRevealed ? getCardsWithHostDefault(room) : null
  };
  
  return roomInfo;
}

function getCardsWithHostDefault(room) {
  const cards = Object.fromEntries(room.cards);
  
  for (const [playerId, player] of room.players) {
    if (!player.isSystem && !cards[playerId]) {
      cards[playerId] = '?';
    }
  }
  
  return cards;
}

app.get('/api/room/:roomCode', (req, res) => {
  const { roomCode } = req.params;
  const normalizedCode = roomCode.toUpperCase();
  const room = rooms.get(normalizedCode);
  
  if (room) {
    res.json({ exists: true, playerCount: room.players.size });
  } else {
    res.json({ exists: false });
  }
});

io.on('connection', (socket) => {
  socket.on('create-room', (data) => {
    const { playerName, avatar } = data;
    
    if (!playerName?.trim()) {
      socket.emit('error', { message: 'Player name is required' });
      return;
    }

    const roomCode = generateRoomCode();
    
    const room = {
      code: roomCode,
      host: socket.id,
      players: new Map(),
      cards: new Map(),
      isRevealed: false,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    room.players.set(socket.id, {
      id: socket.id,
      name: playerName.trim(),
      avatar: avatar || '😄',
      isHost: true
    });

    rooms.set(roomCode, room);
    socket.join(roomCode);

    const roomInfo = getRoomInfo(roomCode);
    
    socket.emit('room-created', { roomCode, roomInfo, playerId: socket.id });
  });

  socket.on('join-room', (data) => {
    const { roomCode, playerName, avatar } = data;
    
    if (!roomCode?.trim() || !playerName?.trim()) {
      socket.emit('error', { message: 'Room code and player name are required' });
      return;
    }

    const normalizedCode = roomCode.toUpperCase();
    const room = rooms.get(normalizedCode);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const nameExists = Array.from(room.players.values())
      .some(player => player.name === playerName.trim() && !player.isSystem);
    
    if (nameExists) {
      socket.emit('error', { message: 'This name is already taken in the room' });
      return;
    }

    const realPlayers = Array.from(room.players.values()).filter(p => !p.isSystem);
    const shouldBeHost = realPlayers.length === 0;
    
    room.players.set(socket.id, {
      id: socket.id,
      name: playerName.trim(),
      avatar: avatar || '😄',
      isHost: shouldBeHost
    });

    if (shouldBeHost) {
      room.host = socket.id;
      delete room.emptyAt;
    }

    socket.join(normalizedCode);

    const roomInfo = getRoomInfo(normalizedCode);
    
    socket.emit('room-joined', { roomInfo, playerId: socket.id });
    
    io.to(normalizedCode).emit('room-updated', roomInfo);
  });

  socket.on('select-card', (data) => {
    const { cardValue } = data;
    
    let userRoom = null;
    let roomCode = null;
    
    for (const [code, room] of rooms) {
      if (room.players.has(socket.id)) {
        userRoom = room;
        roomCode = code;
        break;
      }
    }

    if (!userRoom) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    if (userRoom.isRevealed) {
      socket.emit('error', { message: 'Voting is already revealed' });
      return;
    }

    userRoom.cards.set(socket.id, cardValue);

    const roomInfo = getRoomInfo(roomCode);
    io.to(roomCode).emit('room-updated', roomInfo);
  });

  socket.on('reveal-cards', () => {
    let userRoom = null;
    let roomCode = null;
    
    for (const [code, room] of rooms) {
      if (room.players.has(socket.id)) {
        userRoom = room;
        roomCode = code;
        break;
      }
    }

    if (!userRoom) {
      socket.emit('error', { message: 'Вы не находитесь в комнате' });
      return;
    }

    if (userRoom.host !== socket.id) {
      socket.emit('error', { message: 'Only host can reveal cards' });
      return;
    }

    if (userRoom.cards.size === 0) {
      socket.emit('error', { message: 'Nobody has voted yet' });
      return;
    }

    userRoom.isRevealed = true;

    const roomInfo = getRoomInfo(roomCode);
    io.to(roomCode).emit('cards-revealed', roomInfo);
  });

  socket.on('reset-voting', () => {
    let userRoom = null;
    let roomCode = null;
    
    for (const [code, room] of rooms) {
      if (room.players.has(socket.id)) {
        userRoom = room;
        roomCode = code;
        break;
      }
    }

    if (!userRoom) {
      socket.emit('error', { message: 'Вы не находитесь в комнате' });
      return;
    }

    if (userRoom.host !== socket.id) {
      socket.emit('error', { message: 'Only host can reset voting' });
      return;
    }

    userRoom.cards.clear();
    userRoom.isRevealed = false;

    const roomInfo = getRoomInfo(roomCode);
    io.to(roomCode).emit('voting-reset', roomInfo);
  });

  socket.on('disconnect', () => {
    for (const [roomCode, room] of rooms) {
      if (room.players.has(socket.id)) {
        const player = room.players.get(socket.id);
        room.players.delete(socket.id);
        room.cards.delete(socket.id);

        const realPlayers = Array.from(room.players.values()).filter(p => !p.isSystem);
        if (realPlayers.length === 0) {
          room.emptyAt = new Date();
        } else {
          if (room.host === socket.id) {
            const newHost = realPlayers[0];
            if (newHost) {
              room.host = newHost.id;
              newHost.isHost = true;
            }
          }

          const roomInfo = getRoomInfo(roomCode);
          io.to(roomCode).emit('room-updated', roomInfo);
        }
      }
    }
  });
});

setInterval(() => {
  const now = new Date();
  const roomsToDelete = [];
  
  for (const [roomCode, room] of rooms) {
    if (room.emptyAt && (now - room.emptyAt) > 10 * 60 * 1000) {
      roomsToDelete.push(roomCode);
    }
    else if ((now - room.createdAt) > 2 * 60 * 60 * 1000) {
      roomsToDelete.push(roomCode);
    }
  }
  
  roomsToDelete.forEach(roomCode => {
    rooms.delete(roomCode);
  });
}, 5 * 60 * 1000); 

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 