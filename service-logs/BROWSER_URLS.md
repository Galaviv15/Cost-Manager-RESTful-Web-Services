# Browser URLs for Testing - Logs Service

All URLs are for the deployed service on Render.

Base URL: `https://cost-manager-restful-web-services-logs.onrender.com`

For local testing, use: `http://localhost:3007` (or the port your service is running on)

## Health Check Endpoint

- **Service Health**: `https://cost-manager-restful-web-services-logs.onrender.com/`

This will show the service status: `{"status":"ok","service":"logs","timestamp":"..."}`

## Logs Service

### GET Requests (Open in Browser)

#### Get All Logs
- **Get all logs**: `https://cost-manager-restful-web-services-logs.onrender.com/api/logs`

This endpoint returns all log entries stored in the MongoDB database.

**Response Example**:
```json
[
  {
    "id": 1,
    "message": "GET /api/logs",
    "level": "info",
    "endpoint": "/api/logs",
    "method": "GET",
    "timestamp": "2026-01-16T15:46:06.544Z",
    "status_code": 200
  },
  {
    "id": 2,
    "message": "POST /api/add",
    "level": "info",
    "endpoint": "/api/add",
    "method": "POST",
    "timestamp": "2026-01-16T15:45:30.123Z",
    "userid": 123123,
    "status_code": 201
  }
]
```

**Response**: Returns an array of log objects. Each log entry includes:
- `id`: Unique log entry ID
- `message`: Log message content
- `level`: Log level (info, error, warn, debug)
- `endpoint`: The endpoint that was accessed
- `method`: HTTP method used (GET, POST, PUT, DELETE, etc.)
- `timestamp`: When the log was created
- `userid`: User ID if applicable (optional)
- `status_code`: HTTP status code of the response (optional)

## Notes

1. **No Authentication Required**: The endpoint is publicly accessible (no authentication required).

2. **Local Testing**: If running locally, replace the base URL with `http://localhost:3007` (or your local port)

3. **Logs Creation**: Logs are automatically created for:
   - Every HTTP request the server receives
   - Every endpoint access
   - Errors and important events

4. **Error Responses**: All endpoints return consistent error formats:
   ```json
   {
     "id": "ERROR_TYPE",
     "message": "Error description"
   }
   ```

5. **Health Check**: Visit the root URL (`/`) to verify the service is running.

6. **Log Storage**: Logs are stored in the MongoDB `logs` collection and persist across service restarts.

7. **Log Levels**: The service supports different log levels:
   - `info`: General informational messages
   - `error`: Error messages
   - `warn`: Warning messages
   - `debug`: Debug messages

8. **Empty Response**: If no logs exist, the endpoint returns an empty array `[]`.

