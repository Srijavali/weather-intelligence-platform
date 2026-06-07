# Weather Intelligence Platform

A production-oriented full-stack Weather Intelligence Platform built with React, TypeScript, Node.js, Express, and PostgreSQL.

The platform enables users to retrieve live weather information, manage weather records through CRUD operations, export data, and experience production-grade reliability features such as caching, timeout protection, retry mechanisms, centralized error handling, and offline support.

---

## Features

### Weather Dashboard

* Search weather by location
* Current location weather
* Multi-day forecast display
* Responsive user interface
* Weather condition visualization

### Weather Record Management

* Create weather records
* View all records
* View record details
* Update existing records
* Delete records
* Pagination support
* Filtering support

### Data Export

* Export records as JSON
* Export records as CSV

### Reliability Features

#### Backend

* Centralized error handling
* AppError pattern
* Structured logging
* Correlation IDs
* Retry mechanisms
* Request timeouts
* Helmet security
* Compression
* Rate limiting
* Graceful shutdown

#### Frontend

* Request cancellation
* Timeout handling
* Offline detection
* Cache layer
* Stale cache fallback
* Error boundaries
* Runtime validation

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JavaScript (ESM)

### Database

* PostgreSQL

### External Services

* Weather API

---

## System Architecture

```text
React Frontend
       │
       ▼
Express Backend
       │
       ▼
Controllers
       │
       ▼
Services
       │
       ▼
Repositories
       │
       ▼
PostgreSQL

       ▲
       │
Weather API
```

### Architecture Principles

* Separation of Concerns
* Single Responsibility Principle
* DRY Principle
* Clean Architecture
* Fail Fast Validation
* Defensive Programming

---

## Backend API Endpoints

### Health Check

```http
GET /api/health
```

### Weather

```http
GET /api/weather?location=
```

### Weather Records

```http
POST   /api/weather-records
GET    /api/weather-records
GET    /api/weather-records/:id
PUT    /api/weather-records/:id
DELETE /api/weather-records/:id
```

### Exports

```http
GET /api/exports/json
GET /api/exports/csv
```

---

## Filtering & Pagination

### Supported Filters

* location
* startDate
* endDate

### Pagination

```http
?page=1&limit=10
```

---

## Project Structure

```text
weather-intelligence-platform/

├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── db/
│   │
│   ├── exports/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── routes/
│   │
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE weather_platform;
```

Run:

```bash
backend/src/db/init.sql
```

to create the schema.

---

## Environment Variables

### Backend

Create:

```env
backend/.env
```

Example:

```env
PORT=5000

DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=

WEATHER_API_KEY=
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Srijavali/weather-intelligence-platform.git

cd weather-intelligence-platform
```

### Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

---

## Running the Application

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## Current Design

Weather records currently store a weather snapshot along with:

* location
* startDate
* endDate

The date range currently acts as metadata used for:

* Filtering
* Searching
* Reporting
* Exporting
* Record Management

The system does not continuously monitor weather during the selected date range.

---

## Future Enhancements

### Monitoring Period System

Transform startDate and endDate into true monitoring periods.

### Scheduled Weather Collection

Use schedulers or cron jobs to periodically collect weather observations.

### Historical Weather Timeline

Store weather observations over time instead of a single snapshot.

Example:

```text
Day 1
Day 2
Day 3
...
```

### AI Assistant

Provide intelligent recommendations for:

* Farmers
* Researchers
* Travelers

Examples:

* Irrigation recommendations
* Crop disease risk alerts
* Weather trend analysis
* Travel planning suggestions

### Automated Summarization

Generate AI-powered weather monitoring summaries.

### Trend Dashboard

* Graphs
* Charts
* Historical weather evolution

### Alerts & Notifications

* Email
* SMS
* Push Notifications

### Agentic AI Integration

Proactive weather monitoring and intelligent recommendation generation.

---

## Learning Outcomes

This project demonstrates:

* Full-stack development
* REST API design
* PostgreSQL integration
* Layered architecture
* Production-grade error handling
* Reliability engineering
* Caching strategies
* Observability principles
* Software engineering best practices

---

## Author

Sri Javali

Computer Science Engineering Student

Passionate about Full-Stack Development, AI Systems, Explainable AI, and Production-Grade Software Engineering.
