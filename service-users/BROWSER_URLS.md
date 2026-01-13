# Browser URLs for Testing - Users Service

All URLs are for the deployed service on Render.

Base URL: `https://cost-manager-restful-web-services-user.onrender.com`

For local testing, use: `http://localhost:3000` (or the port your service is running on)

## Health Check Endpoint

- **Service Health**: `https://cost-manager-restful-web-services-user.onrender.com/`

This will show the service status: `{"status":"ok","service":"users","timestamp":"..."}`

## Users Service

### GET Requests (Open in Browser)

- **Get all users**: `https://cost-manager-restful-web-services-user.onrender.com/api/users`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/1`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/2`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/3`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/4`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/5`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/15`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/20`
- **Get user by ID**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/25`
- **Get current user (authenticated)**: `https://cost-manager-restful-web-services-user.onrender.com/api/users/me` (requires authentication token)

**Note**: User IDs are typically 1-25 in the seed data.

### POST Requests (Use Postman/cURL)

#### Register New User
**URL**: `POST https://cost-manager-restful-web-services-user.onrender.com/api/register`

**Body**:
```json
{
  "id": 999999,
  "first_name": "John",
  "last_name": "Doe",
  "birthday": "1990-05-15",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Required Fields**:
- `id` (required): User ID (must be a number, unique)
- `first_name` (required): User's first name
- `last_name` (required): User's last name
- `birthday` (required): Birthday in format "YYYY-MM-DD"
- `email` (required): Valid email address (must be unique)
- `password` (required): Password (must be at least 6 characters)

**Response**: Returns user object with token (for authentication)

#### Login
**URL**: `POST https://cost-manager-restful-web-services-user.onrender.com/api/login`

**Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Required Fields**:
- `email` (required): User's email address
- `password` (required): User's password

**Response**: Returns user object with authentication token

**Note**: Use the token from the response in the `Authorization` header for authenticated endpoints:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Create User (Legacy - Backward Compatibility)
**URL**: `POST https://cost-manager-restful-web-services-user.onrender.com/api/add`

**Body**:
```json
{
  "id": 123456,
  "first_name": "Jane",
  "last_name": "Smith",
  "birthday": "1985-03-20"
}
```

**Required Fields**:
- `id` (required): User ID (must be a number, unique)
- `first_name` (required): User's first name
- `last_name` (required): User's last name
- `birthday` (required): Birthday in format "YYYY-MM-DD"

**Note**: This endpoint creates a user without email/password (legacy endpoint for backward compatibility).

## Authentication

Some endpoints require authentication. After logging in or registering, you'll receive a token. Use it in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Authenticated Endpoints

- **GET /api/users/me**: Get current authenticated user's information

## Notes

1. **For POST requests**, you'll need to use tools like:
   - Postman
   - Insomnia
   - cURL
   - Browser extensions (like REST Client)

2. **Local Testing**: If running locally, replace the base URL with `http://localhost:3000` (or your local port)

3. **User IDs**: The seed data typically creates users with IDs 1-25, so use those IDs in your queries.

4. **Error Responses**: All endpoints return consistent error formats:
   ```json
   {
     "id": "ERROR_TYPE",
     "message": "Error description"
   }
   ```

5. **Health Check**: Visit the root URL (`/`) to verify the service is running.

6. **User Data**: When fetching a user by ID, the response includes:
   - User basic information (id, first_name, last_name, birthday, email)
   - Total expenses and income (if available from other services)
   - User statistics

