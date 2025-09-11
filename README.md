# Grupo13 Backend - IFTS ComA

A Node.js + Express backend project with MVC (Model-View-Controller) structure.

## Project Structure

```
├── app.js                  # Main Express server application
├── config/                 # Configuration files
│   ├── app.js             # Application configuration
│   └── database.js        # Database configuration
├── controllers/           # Request handlers (Controller layer)
│   ├── indexController.js # Index route controllers
│   └── userController.js  # User route controllers
├── data/                  # Data access layer
│   ├── indexData.js      # Index data operations
│   └── userData.js       # User data operations
├── models/               # Data models and validation
│   └── User.js          # User model with validation
├── routes/              # Route definitions
│   ├── index.js        # Index routes
│   └── users.js        # User routes
├── services/           # Business logic layer (Service layer)
│   ├── indexService.js # Index business logic
│   └── userService.js  # User business logic
└── views/             # Response formatting
    └── apiViews.js   # API response formatting helpers
```

## MVC Flow

The application follows the MVC pattern with this flow:
**Controller → Service → Data**

1. **Controllers** handle HTTP requests and responses
2. **Services** contain business logic and validation
3. **Data** layer handles data persistence and retrieval

## Installation

```bash
npm install
```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon (auto-restart)

## API Endpoints

### Index Routes
- `GET /` - Welcome message with system info
- `GET /health` - Health check endpoint

### User Routes (RESTful API)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

## Example Usage

### Get welcome message
```bash
curl http://localhost:3000/
```

### Create a new user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john.doe@example.com"}'
```

### Get all users
```bash
curl http://localhost:3000/api/users
```

## Dependencies

- **express**: Web framework for Node.js
- **nodemon** (dev): Automatic server restart during development

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Development

The project includes placeholder files with comments for each layer, demonstrating the MVC pattern and providing a foundation for further development.