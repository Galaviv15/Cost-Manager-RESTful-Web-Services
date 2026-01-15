# Browser URLs for Testing - Admin Service

All URLs are for the deployed service on Render.

Base URL: `https://cost-manager-restful-web-services-admin.onrender.com`

For local testing, use: `http://localhost:3003` (or the port your service is running on)

## Health Check Endpoint

- **Service Health**: `https://cost-manager-restful-web-services-admin.onrender.com/`

This will show the service status: `{"status":"ok","service":"admin","timestamp":"..."}`

## Admin Service

### GET Requests (Open in Browser)

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

1. **No Authentication Required**: The endpoint is publicly accessible (no authentication required).

2. **Local Testing**: If running locally, replace the base URL with `http://localhost:3003` (or your local port)

3. **Error Responses**: All endpoints return consistent error formats:
   ```json
   {
     "id": "SERVER_ERROR",
     "message": "Error description"
   }
   ```

4. **Health Check**: Visit the root URL (`/`) to verify the service is running.

5. **About Endpoint**: The about endpoint provides static information about the development team and project.

6. **Logs Service**: Logs are now handled by a separate service (service-logs). See the logs service documentation for accessing logs.

