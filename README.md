# MenteCart

# MenteCart — Service Booking App

A full-stack service booking application where users can browse services, add them to a cart with date/time slots, and complete bookings.


---

## Tech Stack

**Backend**
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

**Frontend**
- Flutter (Dart)
- BLoC State Management
- Dio (HTTP Client)
- Shared Preferences

---

## Project Structure
mentecart/
├── backend/         → Node.js + Express API
└── mobile/          → Flutter mobile app

---

## Prerequisites

- Node.js v18+
- Flutter SDK (latest stable)
- MongoDB Atlas account
- Postman (for API testing)

---

## Backend Setup

**1. Navigate to backend folder**
```bash
cd backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create .env file**
PORT=3000
MONGO_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_jwt_secret_here

**4. Seed sample services**
```bash
npm run seed
```

**5. Run the server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## Flutter Setup

**1. Navigate to mobile folder**
```bash
cd mobile
```

**2. Install dependencies**
```bash
flutter pub get
```

**3. Run the app**
```bash
flutter run
```

> Note: For Android emulator, the API base URL is set to `http://10.0.2.2:3000` which maps to localhost on Mac.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/signup | Register new user |
| POST | /auth/login | Login, returns JWT |
| GET | /auth/me | Get current user (protected) |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /services | List services (paginated, filterable) |
| GET | /services/:id | Service detail |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /cart | Get current user's cart |
| POST | /cart/items | Add item to cart |
| PATCH | /cart/items/:itemId | Update item slot |
| DELETE | /cart/items/:itemId | Remove item |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /bookings/checkout | Convert cart to booking |
| GET | /bookings | List user's bookings |
| GET | /bookings/:id | Booking detail |
| POST | /bookings/:id/cancel | Cancel booking |

---

## Key Features Implemented

- JWT authentication with bcrypt password hashing
- Paginated services with category filter and search
- Cart system with date/time slot selection
- Atomic capacity check using MongoDB findOneAndUpdate — prevents overbooking race conditions
- Booking status lifecycle: pending → confirmed → completed / cancelled / failed
- Status history audit log on every booking
- Slot capacity released on cancellation
- Daily booking limit (max 3 per day)
- Cart expiry after 15 minutes

---

## Done

-  Full backend API (Auth, Services, Cart, Bookings)
-  MongoDB models with proper relationships
- JWT middleware for protected routes
-  Atomic overbooking prevention
-  Flutter project with BLoC architecture
-  API client with Dio and JWT interceptor
-  Login and Signup screens



---

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default 3000) |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for JWT signing |


---

## Developer

**Ilham Faiz**
