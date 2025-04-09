# NestJS Docker App

A NestJS application with user authentication, product management, and bulk email functionality, containerized with Docker. This app uses MySQL for data persistence, Redis for queuing emails, and SMTP for email delivery.

---

## Architecture Overview

### Components
- **NestJS Application**:
  - Backend framework handling API routes, business logic, and authentication.
  - Modules: `AuthModule`, `UsersModule`, `ProductsModule`, `EmailModule`.
  - Uses TypeORM for database ORM and JWT for authentication.

- **MySQL**:
  - Relational database storing users and products.
  - Mounted to `./mysql-data` for persistence.

- **Redis**:
  - In-memory data store for queuing bulk email jobs via Bull.
  - Mounted to `./redis-data` for persistence with append-only file (AOF).

- **SMTP Service**:
  - External email service (e.g., Gmail SMTP) for sending bulk emails.
  - Configured via environment variables.

- **Docker**:
  - Containerizes the app (`app`), database (`mysql`), and queue (`redis`).
  - `Dockerfile`: Builds the NestJS app image.
  - `docker-compose.yml`: Orchestrates multi-container setup with volume mounts.

### Architecture Diagram
+-------------------+       +-------------------+       +-------------------+
|   Client (HTTP)   | <---> |   NestJS App      | <---> |   MySQL Database  |
|   (Swagger UI)    |       |   (Port 3000)     |       |   (Port 3306)     |
+-------------------+       | - Auth            |       +-------------------+
| - Users           |
| - Products        |       +-------------------+
| - Email (Bull)    | <---> |   Redis Queue     |
+-------------------+       |   (Port 6379)     |
+-------------------+
|
+-------------------+
|   SMTP Service    |
|   (e.g., Gmail)   |
+-------------------+

- **Flow**:
  1. Client sends HTTP requests to the NestJS app (e.g., `/auth/login`, `/users/send-bulk-emails`).
  2. NestJS interacts with MySQL for user/product data.
  3. Bulk email requests are queued in Redis via Bull.
  4. Email jobs are processed and sent via SMTP.

---

## API Documentation

### Base URL
- `http://localhost:3000` (or your deployed URL)

### Authentication
- JWT-based authentication is required for protected endpoints.
- Obtain a token via `POST /auth/login` and include it in the `Authorization` header as `Bearer <token>`.

### Endpoints

#### Auth
- **POST /auth/login**
  - **Description**: Logs in a user and returns a JWT token.
  - **Request Body**:
    ```json
    {
      "email": "test@example.com",
      "password": "123456"
    }

    Responses:
        201: { "access_token": "jwt.token.here" }
        401: { "message": "Unauthorized" }

Users

    POST /users/register
        Description: Registers a new user.
        Request Body:
        json

    {
      "email": "test@example.com",
      "password": "123456",
      "role": "user"  // Optional, defaults to "user"
    }
    Responses:
        201: { "id": 1, "email": "test@example.com", "role": "user" }
        400: { "message": "Bad Request" }

GET /users

    Description: Lists all users (JWT required).
    Headers: Authorization: Bearer <token>
    Responses:
        200: [ { "id": 1, "email": "test@example.com", "role": "user" }, ... ]
        401: { "message": "Unauthorized" }

POST /users/send-bulk-emails

    Description: Sends bulk emails to all users (admin only, JWT required).
    Headers: Authorization: Bearer <token>
    Request Body:
    json

        {
          "subject": "Test Email",
          "message": "Hello from NestJS"
        }
        Responses:
            201: { "message": "Bulk emails have been queued successfully" }
            401: { "message": "Unauthorized" }
            403: { "message": "Forbidden" }

Products

    POST /products
        Description: Creates a new product (admin only, JWT required).
        Headers: Authorization: Bearer <token>
        Request Body:
        json

        {
          "name": "Laptop",
          "price": 1000,
          "description": "A high-end laptop"
        }
        Responses:
            201: { "id": 1, "name": "Laptop", "price": 1000, "description": "A high-end laptop" }
            401: { "message": "Unauthorized" }
            403: { "message": "Forbidden" }
    GET /products
        Description: Lists all products.
        Responses:
            200: [ { "id": 1, "name": "Laptop", "price": 1000, "description": "A high-end laptop" }, ... ]

Prerequisites

    Docker and Docker Compose installed

Setup

    Clone the repository:
    bash

git clone https://github.com/your-username/nestjs-docker-app.git
cd nestjs-docker-app
Copy .env.example to .env and update with your credentials:
bash
cp .env.example .env
Edit .env with your SMTP and JWT settings.
Build and run:
bash

    docker-compose up --build
    Access the app:
        API: http://localhost:3000
        Swagger: http://localhost:3000/api

Project Structure
text
nestjs-docker-app/
├── .dockerignore        # Ignores files for Docker build
├── .env.example        # Template for environment variables
├── .github/            # GitHub Actions workflows
│   └── workflows/
│       └── docker-build.yml
├── .gitignore          # Ignores files for Git
├── Dockerfile          # Builds the NestJS app image
├── docker-compose.yml  # Orchestrates app, MySQL, Redis
├── package.json        # Node.js dependencies and scripts
├── README.md           # This file
├── src/                # Application source code
│   ├── auth/           # Authentication module
│   ├── email/          # Email queuing module
│   ├── products/       # Products module
│   ├── users/          # Users module
│   └── app.module.ts   # Root module
├── wait-for-it.sh      # Waits for MySQL to be ready
Environment Variables

See .env.example for all variables:

    NODE_ENV: Environment (e.g., dev, production)
    DB_*: MySQL connection settings
    REDIS_*: Redis connection settings
    SMTP_*: Email service settings
    JWT_SECRET: Secret for JWT signing

Contributing

    Fork the repository.
    Create a branch: git checkout -b feature/your-feature.
    Commit changes: git commit -m "Add your feature".
    Push: git push origin feature/your-feature.
    Open a pull request.

### Explanation
1. **Architecture Overview**:
   - **Components**: Describes the key parts (NestJS, MySQL, Redis, SMTP, Docker).
   - **Diagram**: A simple ASCII diagram showing how components interact.
   - **Flow**: Explains the request lifecycle (e.g., client -> NestJS -> MySQL/Redis -> SMTP).

2. **API Documentation**:
   - Lists all endpoints from `AuthController`, `UsersController`, and `ProductsController`.
   - Includes method, path, description, request body (if any), headers, and possible responses.
   - Matches the Swagger setup we implemented.

3. **Setup Instructions**:
   - Retained from the previous README, ensuring users can run the app.

4. **Additional Sections**:
   - **Project Structure**: Shows the file layout.
   - **Environment Variables**: References `.env.example`.
   - **Contributing**: Basic guidelines for contributors.

---

### Steps to Add to Your Repository
1. **Update `README.md`**:
   - Replace your existing `README.md` with the content above.
   - Replace `your-username` with your actual GitHub username in the clone URL.

2. **Commit and Push**:
   ```bash
   git add README.md
   git commit -m "Add architecture and API documentation to README"
   git push

Running the App

As documented, users can clone and run:
bash
git clone https://github.com/your-username/nestjs-docker-app.git
cd nestjs-docker-app
cp .env.example .env
# Edit .env with credentials
docker-compose up --build