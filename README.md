# PitStop — Car Service Appointment Booking (Frontend)

Live: <https://pitstop-web-delta.vercel.app> · UI flow (Figma): <https://www.figma.com/design/IF9u1rdahGoXWR4SGDeXi9>

Project 4 frontend · **Tinnapat Sittisuwan**

Next.js 16 (App Router) + next-auth (Credentials / JWT) + MUI + Tailwind CSS 4 + dayjs.
UI is in Thai with a minimal white design and the Anuphan font (MUI and the date picker use the Thai locale).
Built for the backend at <https://github.com/SWDevPrac2-69-1/PJ04-CarServiceAppoint>.

## Run

1. **Backend** (`~/PJ04-CarServiceAppoint`): in `config/config.env` set
   `PORT=5050` and `MONGO_URI=mongodb://127.0.0.1:27017/carservice`, then `npm ci && npm run dev`.
   (Port 5000 is taken by macOS AirPlay Receiver, so 5050 is used.)
2. **Frontend** (this folder): create `.env.local` from `.env.example`:

   ```dotenv
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=<openssl rand -base64 32>
   BACKEND_URL=http://localhost:5050
   ```

3. `npm install`, then `npm run dev -- -p 3001`, and open <http://localhost:3001>.
   You can use any port, as long as `NEXTAUTH_URL` matches it.

Browser requests go to `/backend/*` on the frontend, and Next.js forwards them to `BACKEND_URL`
(the `rewrites` in `next.config.ts`). Because of this, CORS never comes into play, and the frontend can run on any port.

The backend limits each IP to **100 requests per 10 minutes**. If you see "Too many requests", restart the backend.

If a backend token is no longer valid (expired, or the database was reset), protected pages send you to
`/login?expired=1`. That page clears the stale session.

## Features → pages

| Requirement | Where |
|---|---|
| Register (name, email, tel, role, password) | `/register` — signs you in automatically afterwards |
| Login with email + password, JWT issued | `/login` — next-auth stores the backend JWT in the session |
| Logout | "Sign out" button in the top menu (also calls `GET /auth/logout`) |
| Protected routes / roles | `requireSession()` checks pages on the server; guests go to `/login`, wrong role goes to `/` |
| Anyone can view service packages | `/services`, `/services/[id]` |
| Admin add / update / delete / view packages | `/admin/services`, `/admin/services/new`, `/admin/services/[id]/edit` (the package ID is shown) |
| Member creates an appointment (service id, plate, brand/model, date + time) | `/appointments/new?service=<id>` |
| Member view / edit / delete own; admin manages everyone's | `/appointments`, `/appointments/[id]/edit` |

## Extra features

| Feature | Where |
|---|---|
| Admin dashboard: today / upcoming counts, expected revenue, customers with bookings, appointments per day for the next 7 days (hover a bar for the number), most booked packages, next 5 appointments | `/admin/dashboard` (`src/libs/stats.ts`, `src/components/DayBarChart.tsx`) |
| Search and filter appointments: search by plate, car, package, or (admin) the booker's name/email/phone; filter by package, date and status | `/appointments` (`src/components/AppointmentList.tsx`) |

Dates and times are always shown in Thai time (`Asia/Bangkok`), so pages rendered on Vercel's servers (UTC) show the same time as the browser.

## Booking conditions

The form checks these first (`src/libs/rules.ts`) and also shows the backend's own error message if it rejects the request:

- The date cannot be before today (the date picker blocks past days)
- 1 appointment per car per day
- The same car cannot have overlapping times
- Exactly 1 service package per appointment
- At most 3 upcoming appointments (the counter is shown and booking is blocked when you reach 3)

**Time zones:** the backend reads `appointmentDate` + `startTime` as UTC. The form uses your local time and converts it
to UTC before sending. Times shown on the page come from `startsAt`/`endsAt` and are displayed in local time.

## Structure

```
interface.ts               global types (ServiceItem, AppointmentItem, ...)
src/libs/                  API calls (auth, services, appointments), format + rule helpers
src/app/api/auth/...       next-auth config
src/app/                   pages (see table above)
src/components/            TopMenu, forms, cards, delete buttons
```
