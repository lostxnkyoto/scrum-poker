## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Run Application

```bash
docker-compose up --build
```

Application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3001

### Development

#### Backend
```bash
cd server
npm install
npm start
```

#### Frontend
```bash
cd client
npm install
npm start
```

### Features

- Create/join planning sessions
- Real-time voting
- Scrum Master controls
- Responsive design
- Dark mode support

### Usage

1. Create a room as Scrum Master
2. Share room code with team
3. Vote on story points
4. Reveal results when ready
5. Reset for next story 