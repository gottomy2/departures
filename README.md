# Departures - Flight Management System

## Overview

Departures is a full-stack flight management system that allows users to browse flight schedules, check statuses, and manage flight information. The backend is built with **Spring Boot** and uses **PostgreSQL** for data storage, while the frontend is developed using **React with Vite.js** and **Tailwind CSS**. Authentication is handled via **JWT tokens**, and flight weather data is fetched using an external weather API.

## Requirements

### Backend

- **Java 22**
- **Maven**
- **PostgreSQL** (or another configured database)
- **Docker** (optional, for containerized setup)

### Frontend

- **Node.js (>=18.x.x)**
- **npm (>=8.x.x)**

## Installation & Setup

### 1. Clone the repository

```sh
git clone https://github.com/your-repo/departures.git
cd departures
```

### 2. Backend Setup

#### Configure Database & API Keys

Modify the `backend/src/main/resources/application.properties` file:

```spring.application.name=departures
spring.datasource.url=jdbc:postgresql://localhost:5432/departures
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.liquibase.change-log=classpath:/db/changelog/db.changelog-master.xml
weather.api.key=YOUR_API_KEY_HERE
spring.cache.type=simple
```

Ensure that PostgreSQL is running and a database named `departures` exists: 
`psql -U postgres -c "CREATE DATABASE departures;"`

#### Run the Backend

Navigate to the `backend` directory and build the project:

```
cd backend
mvn clean install

```
Run the application: `mvn spring-boot:run`

The backend will start on http://localhost:8080.

### 3. Frontend Setup
#### Navigate to the frontend directory:
```bash
cd ../frontend
npm install
```
#### Start the frontend development server: `npm run dev`

The frontend will be available at http://localhost:5173.

### 4.API Endpoints
#### Authentication
- POST /api/auth/login - Logs in and returns a JWT token

#### Flights
- GET /api/flights - Fetch paginated flight list
- POST /api/flights - Create a new flight (requires authentication)
- PUT /api/flights/{id} - Update flight data (requires authentication)
- DELETE /api/flights/{id} - Delete a flight (requires authentication)

#### Gates
- GET /api/gates - Fetch gates list
- POST /api/gates - Create a new gate (requires authentication)
- PUT /api/gates/{id} - Update gate data (requires authentication)
- DELETE /api/gates/{id} - Delete a gate (requires authentication)

### CI/CD Pipeline (GitHub Actions)
#### This project includes automated testing and build processes via GitHub Actions:
- Backend CI - Builds and tests the backend
- Frontend CI - Builds and tests the frontend
#### To manually trigger a workflow:
- Go to GitHub Actions in your repository
- Select the desired workflow
- Click Run workflow