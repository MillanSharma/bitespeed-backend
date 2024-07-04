# BiteSpeed Backend API

This project is a simple API for managing contacts, built using Node.js, TypeScript, Express, PostgreSQL, Drizzle ORM, and Zod for validation.

## Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **TypeScript**: A statically typed superset of JavaScript.
- **Express**: A minimal and flexible Node.js web application framework.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Drizzle ORM**: A lightweight, TypeScript-first ORM for SQL databases.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **SwaggerDocs**: A interactive API documentation
- **Zest**: A Javascript testing framework.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/MillanSharma/bitespeed-backend.git
   cd bitespeed-backend
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Set up the environment variables:

   ```sh
   cp .env.example .env
   ```

   Update `.env` with your PostgreSQL connection details.

4. Run the database migrations:

   ```sh
   pnpm drizzle-kit generate:pg
   pnpm tsx src/migration.ts
   ```

5. Start the server:
   ```sh
   pnpm dev
   ```

## Test


1. Run the test:

   ```sh
   pnpm run test 
   ```

## Exposed Routes

### GET /status

Returns the status of the API.

**Request:**

```httpf
GET /status


GET /identify
request: { email: string, phoneNumber: string }
```

#### route exposed on: https://bitespeed-backend-wwxo.onrender.com/status

#### docs exposed on: https://bitespeed-backend-wwxo.onrender.com/status
