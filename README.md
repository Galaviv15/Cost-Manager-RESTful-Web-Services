# Cost Manager RESTful Web Services

A comprehensive Node.js/Express/MongoDB RESTful API system for managing personal finances, expenses, budgets, goals, and generating detailed reports. This project supports both monolithic (all-in-one) and microservices architectures.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Overview

Cost Manager is a RESTful web service application designed to help users track and manage their financial activities. The system provides comprehensive features for expense tracking, budget management, goal setting, cost management (income and expenses), analytics, and automated reporting.

The project offers two deployment models:
- **All-in-One**: Monolithic architecture with all services integrated into a single application
- **Microservices**: Independent services that can be deployed and scaled separately

## Features

- **User Management**: User registration, authentication (JWT), and profile management
- **Cost Management**: Track income and expenses with detailed categorization
- **Budget Tracking**: Create and monitor budgets by category and time period
- **Goals Management**: Set and track financial goals with progress monitoring
- **Analytics**: Comprehensive analytics including trends, category breakdowns, and comparisons
- **Reporting**: Monthly and yearly reports with caching using the Computed Design Pattern
- **Admin Operations**: System logging, team information, and administrative functions

## Architecture

### All-in-One Architecture

The `all-in-one/` directory contains a monolithic implementation where all services run in a single Node.js application. This is ideal for:
- Development and testing
- Simpler deployment scenarios
- Smaller-scale applications

**Services included:**
- Users Service
- Costs Service
- Budgets Service
- Goals Service
- Analytics Service
- Reports Service
- Admin Service

All services are accessible through a single port (default: 3000).

### Microservices Architecture

The repository also includes individual service directories that can be deployed independently:

- `service-users/` - User management and authentication
- `service-costs/` - Cost management (income and expenses)
- `service-budgets/` - Budget management
- `service-goals/` - Goals tracking
- `service-analytics/` - Analytics and insights
- `service-report/` - Report generation
- `service-admin/` - Administrative functions

Each microservice can be:
- Deployed independently
- Scaled separately based on demand
- Developed and maintained by different teams
- Updated without affecting other services

## Technology Stack

- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB (MongoDB Atlas) with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with bcryptjs
- **Logging**: Pino with MongoDB storage
- **Environment Management**: dotenv
- **Testing**: Jest, Supertest
- **Development Tools**: Nodemon, Concurrently

## Project Structure

```
Cost-Manager-RESTful-Web-Services/
├── all-in-one/              # Monolithic implementation
│   ├── src/
│   │   ├── config/          # Database and logger configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware (auth, logging)
│   │   └── utils/           # Utility functions
│   ├── tests/               # Unit and integration tests
│   ├── app.js               # Main application entry point
│   └── package.json
│
├── service-users/           # Users microservice
├── service-costs/           # Costs microservice
├── service-budgets/         # Budgets microservice
├── service-goals/           # Goals microservice
├── service-analytics/       # Analytics microservice
├── service-report/          # Reports microservice
└── service-admin/           # Admin microservice
```

Each service directory follows a similar structure:
- `src/` - Source code (config, controllers, models, routes, services, middleware, utils)
- `tests/` - Test files
- `app.js` - Service entry point
- `package.json` - Dependencies and scripts

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or MongoDB Atlas)
- npm or yarn

### Installation

#### For All-in-One Architecture

1. Navigate to the all-in-one directory:
```bash
cd all-in-one
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cost_manager
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

4. Start the application:
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

#### For Microservices Architecture

1. Navigate to the desired service directory:
```bash
cd service-users  # or service-costs, service-budgets, etc.
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with service-specific configuration:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cost_manager
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

4. Start the service:
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

**Note:** Each microservice runs on its own port. Ensure port numbers don't conflict when running multiple services.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port number | No (default: 3000) |
| `NODE_ENV` | Environment (development/production) | No |
| `LOG_LEVEL` | Logging level (info/debug/error) | No |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | No (default: 7d) |

## API Documentation

### Base URLs

- **All-in-One (Local)**: `http://localhost:3000`
- **All-in-One (Production)**: See `all-in-one/BROWSER_URLS.md` for deployed URL
- **Microservices**: Each service runs on its own port (see individual service READMEs)

### Main Endpoints

#### Users Service
- `POST /api/register` - Register a new user
- `POST /api/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/me` - Get current authenticated user (requires JWT)

#### Costs Service
- `POST /api/add` - Create a new cost (income or expense)
- `POST /api/costs` - Create a new cost (alternative endpoint)

#### Budgets Service
- `POST /api/budgets` - Create a budget
- `GET /api/budgets` - Get budgets (with filters)
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget
- `GET /api/budgets/status` - Get budget status

#### Goals Service
- `POST /api/goals` - Create a financial goal
- `GET /api/goals` - Get goals (with filters)
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal
- `GET /api/goals/:id/progress` - Get goal progress

#### Analytics Service
- `GET /api/analytics` - Get user analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/trends` - Get spending trends
- `GET /api/analytics/category` - Get category breakdown
- `GET /api/analytics/monthly` - Get monthly analytics
- `GET /api/analytics/yearly` - Get yearly analytics

#### Reports Service
- `GET /api/reports` - Get user reports
- `GET /api/report` - Get monthly report (legacy endpoint)

#### Admin Service
- `GET /api/about` - Get team information
- `GET /api/logs` - Get system logs

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Error Response Format

All error responses follow this structure:

```json
{
  "id": "ERROR_ID",
  "message": "Error description"
}
```

Common error IDs:
- `VALIDATION_ERROR` - Invalid input parameters
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required or failed
- `DUPLICATE_ERROR` - Duplicate resource
- `SERVER_ERROR` - Internal server error

For detailed API documentation, see:
- `all-in-one/README.md` - Comprehensive API documentation for the all-in-one version
- `all-in-one/BROWSER_URLS.md` - Browser-testable URLs
- Individual service READMEs in each service directory

## Testing

The project includes comprehensive test suites using Jest and Supertest.

### Running Tests

#### All-in-One
```bash
cd all-in-one
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

#### Individual Services
```bash
cd service-users  # or any service directory
npm test
npm run test:watch
npm run test:coverage
```

### Test Coverage

Test files are located in the `tests/` directory of each service and include:
- Unit tests for services and utilities
- Integration tests for API endpoints
- Authentication and authorization tests
- Error handling tests

## Deployment

### All-in-One Deployment

Deploy the `all-in-one/` directory as a single Node.js application. Ensure:
- MongoDB connection string is properly configured
- Environment variables are set
- Port is accessible
- JWT_SECRET is securely generated

### Microservices Deployment

Each service can be deployed independently:
1. Deploy each service directory separately
2. Configure shared MongoDB database
3. Set up service discovery/API gateway if needed
4. Configure load balancing for high-traffic services
5. Set up centralized logging if desired

### Database Requirements

- MongoDB (version 4.4 or higher recommended)
- Shared database for all services in microservices architecture
- Proper indexing for performance (check individual service configurations)

### Production Considerations

- Use strong, unique JWT_SECRET values
- Enable MongoDB connection pooling
- Set up proper error monitoring
- Configure rate limiting
- Use HTTPS in production
- Set up backup strategies for MongoDB
- Monitor service health and performance

## Computed Design Pattern

The Reports service implements the **Computed Design Pattern** for efficient report generation:
- Reports for **past months** are cached in the database
- Cached reports are retrieved when available (faster response)
- If not cached, reports are generated, cached, and returned
- Reports for the **current month** are always calculated fresh (not cached)

This pattern optimizes performance by avoiding redundant calculations for historical data.

## Logging

All services use Pino for structured logging:
- HTTP requests are automatically logged
- Logs are stored in MongoDB `logs` collection
- Log levels: info, debug, error, warn
- Structured JSON format for easy parsing

## License

ISC

## Additional Resources

- **Detailed API Documentation**: See `all-in-one/README.md`
- **Browser Testable URLs**: See `all-in-one/BROWSER_URLS.md`
- **Individual Service Documentation**: See README.md in each service directory
- **Project Specifications**: See `project_spec.md` files in service directories

