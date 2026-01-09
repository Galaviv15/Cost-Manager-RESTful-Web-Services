# Cost Manager Project Specification

## 1. Project Overview
We are building a RESTful Web Service for a "Cost Manager" application using Node.js, Express, and MongoDB (Mongoose).
The system allows users to manage expenses and generate monthly reports.

## 2. Tech Stack & Requirements
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (using Mongoose ODM).
- **Logging:** Pino (Must log every request and error to a 'logs' collection/file).
- **Folder Structure:** All Mongoose schemas must be in a `models` folder.
- **Architecture:** The application must be split into **4 separate processes** (entry points):
    1. `app_users.js` (User management)
    2. `app_costs.js` (Cost management)
    3. `app_report.js` (Report generation)
    4. `app_admin.js` (About / Team details)

## 3. Database Schemas (Mongoose)
Please create the schemas in `models/`. Note: `id` and `_id` are different properties.

### A. User Schema (`users` collection)
**Required Fields:**
- `id`: Number (Unique custom ID, required)
- `first_name`: String (Required)
- `last_name`: String (Required)
- `birthday`: Date (Required)

**Extra Fields (For realism):**
- `email`: String (Unique, required for contact validation)
- `phone_number`: String (Example: "050-1234567")

### B. Cost Schema (`costs` collection)
**Required Fields:**
- `description`: String (Required)
- `category`: String (Enum required: 'food', 'health', 'housing', 'sports', 'education')
- `userid`: Number (Required, matches User's `id`)
- `sum`: Number (Required)

**Extra Fields (For realism):**
- `created_at`: Date (Defaults to `Date.now` if not provided).
- `currency`: String (Default: 'ILS', Enum: 'ILS', 'USD', 'EUR') - To support future multi-currency.
- `payment_method`: String (Enum: 'credit_card', 'cash', 'bit', 'check') - To track how money was spent.

### C. Report Schema (`reports` collection)
*Used for the Computed Design Pattern.*
- `userid`: Number
- `year`: Number
- `month`: Number
- `data`: Object (Stores the calculated JSON report structure)
- `saved_at`: Date (To know when this cache was created)

## 4. API Logic & Computed Pattern
The system uses the **Computed Design Pattern** for the `/api/report` endpoint.

**Logic for `GET /api/report`:**
1. Check if the requested month/year is in the past OR the current month.
2. If it is a **past month** (e.g., requesting Feb when now is March):
   - Check if a document exists in the `reports` collection for this user+month+year.
   - If YES -> Return the saved JSON (do not recalculate).
   - If NO -> Calculate the report from the `costs` collection, SAVE it to `reports` collection, and then return it.
3. If it is the **current month**:
   - Always calculate from scratch (do not save to cache yet).

## 5. API Endpoints
- `POST /api/add` (in `app_users.js`): Create User. returns JSON of the user.
- `POST /api/add` (in `app_costs.js`): Create Cost. returns JSON of the cost.
- `GET /api/report` (in `app_report.js`): Returns detailed JSON grouped by category.
- `GET /api/users/:id` (in `app_users.js`): Returns `{ first_name, last_name, id, total }` (Total = sum of all costs for this user).
- `GET /api/about` (in `app_admin.js`): Returns team members list.

## 6. Instructions for Copilot
1. Generate the **Mongoose Schemas** first, including the validations and enums.
2. Generate a `database.js` file for the connection string (process.env.MONGO_URI).
3. Scaffold the 4 entry files (`app_users.js`, etc.) with the basic Express setup and Pino logger integration.