# StayWell Hotel Booking Management System

StayWell is a full-stack hotel booking foundation built with React, Vite, Express,
MongoDB, Mongoose, JWT cookies, and feature-based modules.

## Current features

- Responsive hotel-search landing page
- Registration, login, logout, and current-user session
- HTTP-only JWT cookies with hashed token blacklisting and TTL cleanup
- Backend validation, rate limiting, Helmet, CORS, centralized errors, and admin middleware foundation
- Hotel search and detail pages with room availability checks
- Customer booking creation, listing, and cancellation
- Hotel reviews and an admin dashboard statistics endpoint

The hotel, room, booking, review, and admin modules are structured to be added without
coupling HTTP handlers to the React presentation layer.

## Setup

1. Install Node.js 20+ and MongoDB.
2. Copy `backend/.env.example` to `backend/.env` and set a long random `JWT_SECRET`.
3. Copy `frontend/HotelBooking/.env.example` to `frontend/HotelBooking/.env`.
4. Install and run each application:

```powershell
cd backend
npm install
npm run dev

cd ..\frontend\HotelBooking
npm install
npm run dev
```

The API runs at `http://localhost:5000` and Vite at `http://localhost:5173`.

## Deploy the frontend to Netlify

The repository includes [`netlify.toml`](./netlify.toml), which configures Netlify
to build the Vite app from `frontend/HotelBooking`. Import the repository into
Netlify without changing the build command or publish directory. The frontend
also includes an SPA fallback so refreshing a client-side route does not return
a Netlify 404.

Set `VITE_API_BASE_URL` in the Netlify site environment variables to the deployed
backend URL followed by `/api`, for example `https://api.example.com/api`.
Do not set it to `localhost` in a deployed site: the browser would try to connect
to the visitor's computer. Trigger a new Netlify deploy after changing this
variable.

The backend must also be deployed separately to a Node-compatible host with a
reachable MongoDB database. Configure its environment variables before starting
it:

- `NODE_ENV=production`
- `MONGODB_URI=<your production MongoDB connection string>`
- `JWT_SECRET=<a long random secret>`
- `FRONTEND_URL=https://<your-netlify-site>.netlify.app`

`FRONTEND_URL` must exactly match the deployed frontend origin (without a
trailing slash), or the browser's credentialed authentication requests will be
blocked by CORS. After deployment, verify `<backend-url>/api/health` returns a
healthy response, then set `VITE_API_BASE_URL=<backend-url>/api` in Netlify.

## API

Implemented authentication endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/health`

Hotel and booking endpoints:

- `GET /api/hotels` and `GET /api/hotels/:id`
- `GET /api/rooms?hotel=<hotelId>`
- `GET /api/bookings`, `POST /api/bookings`, and `PATCH /api/bookings/:id/cancel`
- `GET /api/reviews/hotel/:hotelId` and `POST /api/reviews/hotel/:hotelId`
- `GET /api/admin/dashboard` (administrator only)

Administrators can manage hotels and rooms through the corresponding protected
`POST`, `PATCH`, and `DELETE` routes.

## Import the hotel dataset

The supplied hotel dataset is available in `backend/data/hotels.js`. It can be
loaded into MongoDB with the idempotent seed command below. Use a dedicated
administrator account for local/demo data:

```powershell
cd backend
$env:SEED_ADMIN_EMAIL="dataset-admin@example.com"
$env:SEED_ADMIN_PASSWORD="change-this-demo-password"
npm run seed:dataset
```

Running the command again updates the same dataset hotels and rooms instead of
creating duplicates. Hotel searches match hotel name, city, country, category,
and amenities. Do not use a production administrator account for demo data.

Successful responses use `{ success, message, data }`; errors use
`{ success: false, message, details? }`.

## Security

Passwords are bcrypt hashes and are never selected in normal user responses. JWTs are
never stored raw in the blacklist. Production cookies are secure and use the configured
frontend origin. Do not commit `.env` files or production credentials.

## Validation

Backend tests use Node's built-in test runner; frontend production output is checked
with `npm run build`.

## Roadmap

Future work includes integration tests against a disposable MongoDB instance,
payment processing, and richer administrator CRUD screens.
