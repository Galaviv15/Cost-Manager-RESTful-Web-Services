# Browser URLs for Testing - Admin Service

All URLs are for the deployed service on Render.

Base URL: `https://cost-manager-restful-web-services-admin.onrender.com`

For local testing, use: `http://localhost:3003` (or the port your service is running on)

## Health Check Endpoint

- **Service Health**: `https://cost-manager-restful-web-services-admin.onrender.com/`

This will show the service status: `{"status":"ok","service":"admin","timestamp":"..."}`

## Admin Service

### GET Requests (Open in Browser)

#### Get All Logs
- **Get all logs**: `https://cost-manager-restful-web-services-admin.onrender.com/api/logs`

This endpoint returns all system logs including:
- API endpoint access logs
- Request/response information
- Timestamps
- User IDs (if applicable)
- Endpoint paths
- HTTP methods

**Response**: Returns an array of log entries with detailed information about system activity.

#### Get About/Team Information
- **Get about/team**: `https://cost-manager-restful-web-services-admin.onrender.com/api/about`

This endpoint returns information about the development team members.

**Response Example**:
```json
[
  {
    "first_name": "Gal",
    "last_name": "Aviv"
  },
  {
    "first_name": "Bar",
    "last_name": "Bibi"
  },
  {
    "first_name": "Ofir",
    "last_name": "Avisror"
  }
]
```

**Response**: Returns an array of team member objects with `first_name` and `last_name` fields.

## Notes

1. **No Authentication Required**: Both endpoints are publicly accessible (no authentication required).

2. **Local Testing**: If running locally, replace the base URL with `http://localhost:3003` (or your local port)

3. **Logs Endpoint**: The logs endpoint may return a large amount of data depending on system activity. The logs are stored in the database and include all API access information.

4. **Logs Format**: Each log entry typically includes:
   - Timestamp
   - Endpoint path
   - HTTP method
   - User ID (if applicable)
   - Request/response details
   - Status information

5. **Error Responses**: All endpoints return consistent error formats:
   ```json
   {
     "id": "SERVER_ERROR",
     "message": "Error description"
   }
   ```

6. **Health Check**: Visit the root URL (`/`) to verify the service is running.

7. **About Endpoint**: The about endpoint provides static information about the development team and project.

8. **Logs Management**: Logs are automatically created by the logging middleware when endpoints are accessed across all services.

