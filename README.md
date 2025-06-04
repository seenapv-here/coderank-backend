
# CodeRank - Secure Code Execution Platform

CodeRank is a backend service that allows authenticated users to submit and execute code securely in multiple programming languages (currently Python and JavaScript). It uses Docker for language isolation, RabbitMQ for asynchronous processing, and MongoDB for storing snippets and results.

---

## Architecture Overview

```
Client (Frontend)
   |
   | REST API (Auth, Code Execution)
   v
Backend (Node.js + Express)
   |
   |  ┌------------------------┐
   |  |    MongoDB (Snippets) |
   |  └------------------------┘
   |
   | RabbitMQ Queue (Per language)
   v
Language-specific Runners (Docker)
```

---

## Prerequisites

- Docker Desktop (with WSL2 support for Windows)
- Node.js & npm
- MongoDB installed or use Docker
- RabbitMQ installed or use Docker

---

## Running with Docker Compose

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/coderank.git
cd coderank
```

### 2. Docker Compose up

```bash
docker-compose up --build
```

This command will:

- Build and run the backend service
- Start MongoDB, RabbitMQ
- Launch language runners as microservices

---

## Building Runners Manually

### Python Runner

```bash
docker build -t python-runner -f runners/python/Dockerfile runners/python
```

### JavaScript Runner

```bash
docker build -t javascript-runner -f runners/javascript/Dockerfile runners/javascript
```

---

## Auth API Endpoints

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/signup`   | Register a user    |
| POST   | `/api/auth/login`    | Login & get token  |

Use the returned JWT in Authorization headers: `Bearer <token>`

---

## Code Execution Endpoints

| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/api/code/execute`        | Submit code for execution         |
| GET    | `/api/code/status/:id`     | Poll status of execution by ID    |
| GET    | `/api/code/snippets`       | Get history for logged-in user    |

---

## Project Structure

```
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── queue/
│   └── config/
├── runners/
│   ├── python/
│   └── javascript/
├── public/
│   ├── index.html
│   └── execute.html
├── docker-compose.yml
├── .env
└── README.md
```

---

## Future Improvements

- Add support for more languages like C++, Java, etc.
- Introduce sandboxing (like Firecracker, gVisor)
- Frontend UI for code input and output
- User role-based access control
- Rate limiting and billing
- Output logging to file store or S3
