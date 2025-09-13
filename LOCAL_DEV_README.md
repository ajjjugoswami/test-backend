# Local Development Setup

## Quick Start for Local Development

1. **Navigate to backend directory:**
   ```bash
   cd test-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend in development mode:**
   ```bash
   npm run dev
   ```

## What happens in development mode:

- ✅ Uses **in-memory storage** (no database required)
- ✅ Runs on `http://localhost:5000`
- ✅ All API endpoints work locally
- ✅ JWT authentication works
- ✅ No external database connection needed

## API Endpoints for Testing:

- **Health Check:** `GET http://localhost:5000/api/health`
- **Sign Up:** `POST http://localhost:5000/api/signup`
- **Sign In:** `POST http://localhost:5000/api/signin`

## Testing with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Sign in
curl -X POST http://localhost:5000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting:

- If port 5000 is busy, check what's using it: `netstat -ano | findstr :5000`
- Make sure you're in the `test-backend` directory when running `npm run dev`
- The server should show: "No DATABASE_URL provided, using in-memory storage for development"