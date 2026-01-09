# Users Service

User management service for the Cost Manager application.

## Port
3000

## Endpoints

- `POST /api/register` - Register a new user (returns JWT token)
- `POST /api/login` - Login with email and password (returns JWT token)
- `POST /api/add` - Create a new user (backward compatibility)
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current authenticated user
- `GET /api/users/:id` - Get user by ID

## Environment Variables

See `.env.example` for required environment variables.

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

