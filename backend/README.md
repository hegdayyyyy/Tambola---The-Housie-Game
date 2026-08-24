# Tambola - The Indian Housie

Backend application for a multiplayer Tambola/Housie game.

## Technology Stack

- Java 17
- Spring Boot 3.2.0
- Maven
- PostgreSQL
- Spring Data JPA
- Spring Web
- Validation

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Getting Started

### Database Setup

1. Ensure PostgreSQL is installed and running locally.

2. Create a PostgreSQL database named `tambola_db`:

```sql
CREATE DATABASE tambola_db;
```

3. Configure the database password as an environment variable:

**Windows (Command Prompt):**
```cmd
set DB_PASSWORD=your_postgres_password
```

**Windows (PowerShell):**
```powershell
$env:DB_PASSWORD="your_postgres_password"
```

**Linux/Mac:**
```bash
export DB_PASSWORD=your_postgres_password
```

Alternatively, create a `.env` file in the backend directory (see `.env.example`).

### Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Configuration

Database configuration is located in `src/main/resources/application.properties`:
- Host: localhost
- Port: 5432
- Database: tambola_db
- Username: postgres
- Password: Set via `DB_PASSWORD` environment variable

## Project Structure

```
tambola-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── tambola/
│   │   │           └── housie/
│   │   │               └── TambolaApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── tambola/
│                   └── housie/
│                       └── TambolaApplicationTests.java
└── pom.xml
```
