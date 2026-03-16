# Smart Library Management

React + TypeScript + Vite frontend with an Express/MongoDB backend for library auth, catalog, reservations, borrowing, fines, and approvals. Backend details live in [../backend/README.md](../backend/README.md).

## Setup

Backend (`/backend`):
- Copy `.env.example` → `.env` and set `MONGODB_URI`, `JWT_SECRET`, `PORT` (optional).
- Install & run: `npm install` then `npm start`.

Frontend (`/frontend`):
- Copy `.env.example` → `.env` and set `VITE_API_BASE_URL` (default: `https://e2e-backend-1zjm.onrender.com`).
- Install & run: `npm install` then `npm run dev`.

## Key Features
- Auth: students, librarians, admins with JWT.
- Registrations: signup requests stored in `Registration`, approved into `Student`/`User`.
- Catalog: books from Mongo (`/books`) with copies, price, finePerWeek.
- Reservations: students request; librarians approve.
- Borrow log: every approval creates a `Borrow` record with due date and issuer.
- Fines: student fines view pulls live data.
- Analytics: admin/librarian dashboards fetch summary stats.

## API (high level)
- Auth & signup: `/login`, `/student/signup`, `/librarian/signup`, `/admin/signup`.
- Registrations (admin/librarian): `GET /registrations`, `PATCH /registrations/:id/approve`, `DELETE /registrations/:id`.
- Admin listings: `GET /admin/students`, `GET /admin/librarians`, utility `POST /admin/clear-student-borrows`.
- Catalog: `GET /books`, create book `POST /librarian/books` (librarian/admin).
- Reservations & borrowing: `POST /student/books/:bookId/request`, `GET /student/reservations`, `GET /librarian/reservations`, `PATCH /librarian/reservations/:id/approve`, `GET /librarian/borrowed-active`, `PATCH /librarian/borrowed/:id/return`.
- Student profile & fines: `GET /student/me`, `PUT /student/password`, `GET /student/borrowed`, `GET /student/notifications`.

Full endpoint details: [backend/README.md](../backend/README.md). Update both READMEs whenever a new endpoint is added.

## Models (backend/models)
- Book: title, author, category, isbn (unique), publisher, year, language, pages, price, finePerWeek, copiesAvailable.
- Reservation: book, studentId/email, status, approvedAt.
- Student: auth fields, roll/branch/section, borrowedBooks history.
- User: admin/librarian auth.
- Registration: pending signups for all roles.
- Borrow: approved checkouts (book, student, issuedBy, borrowedAt, dueDate, returned, returnDate, fineAmount).

## Admin/Librarian UI
- Admin: dashboards, manage books (live data with price/copies/fine), manage users (approve/reject pending registrations).
- Librarian: dashboards, manage books, manage students (approve/reject registrations).

## Student UI
- Login, book search/request, My Books (reservations), Fines (live from `/student/borrowed`).
