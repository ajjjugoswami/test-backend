# test-backend

Backend API for the test application with authentication.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

The server will run on http://localhost:5000

## API Endpoints

- `POST /api/signin` - Sign in with email and password
- `POST /api/signup` - Create a new user account (for testing)

## Testing

You can test the sign-in with any email/password combination after creating an account via signup.
