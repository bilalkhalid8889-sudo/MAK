# MAK Hotel Management System — MongoDB Backend

A full-stack hotel management system with a Node.js/Express API backed by MongoDB Atlas (free tier) or a local MongoDB instance.

---

## Project Structure

```
mak-hotel/
├── server/
│   ├── index.js      — Express API server
│   ├── models.js     — Mongoose schemas & models
│   └── seed.js       — One-time database seed script
├── public/
│   └── hotel1.html   — Frontend (unchanged UI + MongoDB bridge injected)
├── .env              — Environment variables
└── package.json
```

---

## Quick Start (Local MongoDB)

### 1. Install MongoDB Community (Free)
- **Windows / macOS / Linux**: https://www.mongodb.com/try/download/community
- Or use **MongoDB Atlas Free Tier** (cloud) — see below.

### 2. Install dependencies
```bash
npm install
```

### 3. Configure `.env`
```env
# Local MongoDB
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/mak_hotel

# OR — MongoDB Atlas (paste your connection string)
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mak_hotel
```

### 4. Seed the database (run ONCE)
```bash
npm run seed
```
This populates MongoDB with the hotel's default data (rooms, guests, reservations, etc.).

### 5. Start the server
```bash
npm start
```

### 6. Open the app
```
http://localhost:3000
```

---

## MongoDB Atlas Free Tier (Cloud — Recommended for production)

1. Go to https://www.mongodb.com/atlas/database → **Try Free**
2. Create a free **M0 cluster** (512 MB, always free)
3. Create a database user (username + password)
4. Whitelist your IP (or use `0.0.0.0/0` for all)
5. Click **Connect → Drivers** and copy the connection string
6. Paste it in `.env`:
   ```
   MONGO_URI=mongodb+srv://yourUser:yourPass@cluster0.abc123.mongodb.net/mak_hotel
   ```
7. Run `npm run seed` then `npm start`

---

## API Endpoints

All endpoints follow the pattern `/api/<resource>`.

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | `/api/reservations`         | Get all reservations         |
| POST   | `/api/reservations`         | Create a reservation         |
| PUT    | `/api/reservations/:id`     | Update a reservation         |
| DELETE | `/api/reservations/:id`     | Delete a reservation         |
| POST   | `/api/reservations/bulk`    | Replace entire array         |

Same pattern applies to: `rooms`, `guests`, `billing`, `menu`, `hkTasks`, `maintTasks`, `staff`.

| GET | `/api/health` | Server + DB health check |

---

## How the MongoDB Bridge Works

The frontend (`hotel1.html`) is **100% untouched** in its UI, CSS, HTML, and business logic.

A thin bridge script is injected at the end of the file that:

1. **On page load** — fetches all 8 data collections from MongoDB and hydrates the `data` object
2. **On every write** — patches each mutation function (`createBooking`, `addRoom`, `deleteGuest`, etc.) to also call the corresponding REST endpoint after the original in-memory operation completes

This means:
- All data persists across browser refreshes and sessions
- Multiple users/devices see the same data
- The original frontend logic is preserved exactly

---

## Technology Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Vanilla HTML/CSS/JS (unchanged)   |
| Backend    | Node.js + Express 5               |
| Database   | MongoDB (Mongoose ODM)            |
| Auth       | Existing login screen (unchanged) |

---

## Notes

- The server serves `hotel1.html` as a static file from `public/`
- If MongoDB is unreachable, the app falls back gracefully to in-memory data (with a console warning)
- All existing animations, dark mode, lamp intro, and UI features work exactly as before
