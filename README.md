# Movie Project

This project is a full-stack microservices application composed of three distinct services: an Authentication Service, a Movies API Service, and a Frontend Web Application.

## Services Overview

1.  **`auth-service` (Port 4000):**
    -   Handles user registration, login, and token management (JWT).
    -   Connects to its own MongoDB database (`auth_service`).
    -   Provides authentication middleware/validation for other services.

2.  **`movies-service` (Port 3001):**
    -   Manages movie data (CRUD operations) and genres.
    -   Connects to its own MongoDB database (`movies_app`).
    -   Protected routes require valid JWT tokens verified against the Auth Service's secret.

3.  **`frontend` (Port 3000):**
    -   The user-facing web application built with Express and Pug templates.
    -   Acts as a client that consumes APIs from both the `auth-service` and `movies-service`.
    -   Handles session management via cookies.

## Prerequisites

-   **Node.js** (Latest LTS recommended)
-   **MongoDB** (Ensure your local MongoDB instance is running on `mongodb://localhost:27017`)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd MovieProject
    ```

2.  **Install dependencies:**
    You can install dependencies for all services at once using the root script:
    ```bash
    npm run install-all
    ```

    Alternatively, you can install them individually:
    ```bash
    # Install Auth Service dependencies
    cd auth-service
    npm install

    # Install Movies Service dependencies
    cd ../movies-service
    npm install

    # Install Frontend dependencies
    cd ../frontend
    npm install
    cd ..
    ```

## Configuration (.env)

You must configure the environment variables for each service. Example files (`.env.example`) are provided in each service directory. You can rename these files to `.env` or copy their content. Feel free to modify the values (e.g., ports, database URIs, secrets) according to your preference and local environment setup.

### 1. Auth Service (`auth-service/.env`)
Create a `.env` file in `auth-service/` and add:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/auth_service
JWT_ACCESS_SECRET=replace_with_your_secure_access_secret
JWT_REFRESH_SECRET=replace_with_your_secure_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

### 2. Movies Service (`movies-service/.env`)
Create a `.env` file in `movies-service/` and add:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/movies_app
JWT_ACCESS_SECRET=replace_with_your_secure_access_secret
CORS_ORIGIN=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:4000
AUTH_SERVICE_TIMEOUT=5000
```

### 3. Frontend (`frontend/.env`)
Create a `.env` file in `frontend/` and add:
```env
PORT=3000
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:4000
MOVIES_SERVICE_URL=http://localhost:3001
JWT_ACCESS_SECRET=replace_with_your_secure_access_secret
```

**Important:** Ensure `JWT_ACCESS_SECRET` matches across all services so tokens can be correctly verified.

## Running the Application

You can run all services simultaneously using the root script:
```bash
npm run start-all
```

Alternatively, you can run each service independently in separate terminals:

**Terminal 1: Auth Service**
```bash
cd auth-service
npm run dev
```

**Terminal 2: Movies Service**
```bash
cd movies-service
npm run dev
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
```

Once all services are running, open your browser and visit:
**http://localhost:3000**

## Development Notes

-   **Nodemon:** The `npm run dev` command (used in individual service folders) uses `nodemon` to automatically restart the server when file changes are detected.
-   **Production:** The `npm run start-all` command runs the services in standard mode (using `node` instead of `nodemon`).