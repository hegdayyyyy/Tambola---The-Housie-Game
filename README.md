# Tambola - The Housie Game

![Screenshot 1](./images/Screenshot%202026-08-24%20215933.png)
![Screenshot 2](./images/Screenshot%202026-08-24%20220310.png)
![Screenshot 3](./images/Screenshot%202026-08-24%20222038.png)

A real-time multiplayer Tambola game ( Indian Bingo)

## Project Structure

```
tambola-main/
├── backend/      # Spring Boot API & WebSocket server
├── frontend/     # React + TanStack Start web app
└── README.md
```

## Prerequisites

- Java JDK 17+
- Node.js 18+
- PostgreSQL 12+

## Setup & Run

### Backend

```bash
cd backend

# Install dependencies
mvn clean install

# Configure database in application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/tambola_db
# spring.datasource.username=postgres
# spring.datasource.password=your_password

# Run
mvn spring-boot:run
```

Backend runs on: `http://localhost:8081`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs on: `http://localhost:8080`

## Features

- Create & join game rooms
- Real-time player updates via WebSocket
- Auto ticket generation
- Manual & automatic number calling
- Housie validation (Early Five, Top Line, Middle Line, Bottom Line, Full House)
- Player disqualification on invalid claims
- Light/Dark theme

## Key Files

**Backend**
- `src/main/java/com/tambola/housie/controller/` - REST endpoints
- `src/main/java/com/tambola/housie/service/` - Game logic
- `src/main/java/com/tambola/housie/entity/` - Database models

**Frontend**
- `src/routes/` - Pages
- `src/components/` - React components
- `src/services/` - API & WebSocket clients
- `src/lib/game-store.ts` - State management

## Database

PostgreSQL is required. Tables are auto-created on first run.

```
Rooms → Players → Tickets
     → Games → CalledNumbers, Claims
```

## Tech Stack

- **Backend**: Spring Boot, WebSocket/STOMP, JPA/Hibernate, PostgreSQL
- **Frontend**: React 18, TypeScript, Tailwind CSS, TanStack Router

