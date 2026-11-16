# FinTech Smart Invoice, Expense & Supplier Payment System

A finance operations platform for small businesses. **This is accounting software, not a marketplace.** Clients owe the business money against sales invoices; suppliers are parties the business pays for rent, utilities, materials and services.

## Stack
- Frontend: React 18, Vite, TypeScript, Recharts, Lucide
- Backend: Node.js, Express, TypeScript, Zod, JWT, bcrypt
- Database: MongoDB Atlas + Mongoose
- Security: Helmet, CORS, rate limiting, role middleware
- Hosting target: Vercel (frontend), Render (API), MongoDB Atlas

## Run locally
1. Install Node.js 20+ and MongoDB. MongoDB must run as a replica set for payment transactions.
2. Copy `backend/.env.example` to `backend/.env`; set a MongoDB URI and two independent JWT secrets of at least 32 characters.
3. Run `npm install` at repository root.
4. Run `npm run dev`.
5. Frontend runs at Vite's local URL; API health is at `http://localhost:4000/api/health`.

## API currently included
- POST /api/auth/register — public registration always creates Employee
- POST /api/auth/login and POST /api/auth/refresh
- GET/POST /api/clients and GET/POST /api/suppliers (Admin/Accountant)
- GET/POST /api/invoices (Admin/Accountant)
- POST /api/invoices/:id/payments (transactional receipt and balance update)
- GET/POST /api/expenses; PATCH /api/expenses/:id/review
- GET /api/dashboard; GET /api/audit-logs

## Financial integrity
All money is stored as integer paise and converted for display. Tax and discount are calculated on the server; this implementation applies discount before tax. Payment creation, invoice balance update and audit entry run inside one MongoDB transaction. A payment greater than the outstanding balance is rejected. Public registration cannot assign privileged roles.

## Roles
Admin and Accountant manage finance records. Employees submit expenses and see only their own. Supplier portal and supplier bill/payment workflows are next in the roadmap; sales invoices are not exposed to supplier accounts.

## Roadmap
- [x] Repository and responsive dashboard foundation
- [x] API bootstrap, authentication, role middleware and core data models
- [x] Client/supplier creation and listing endpoints
- [x] Invoice calculation and transactional payment recording
- [x] Expense submission/review, dashboard aggregates and audit endpoint
- [x] Supplier bill creation/listing and transactional supplier payments
- [ ] Full CRUD screens and supplier self-service portal
- [ ] PDF invoices, email delivery and scheduled due reminders
- [ ] Refresh token rotation/revocation, automated tests, CI and deployment

## Production checklist
Do not commit secrets. Configure HTTPS, refresh-token rotation/revocation, strict resource ownership checks, backups, monitoring and a replica-set database. Dashboard values are illustrative demo data until wired to the API. This is a development project, not certified accounting or tax software.
