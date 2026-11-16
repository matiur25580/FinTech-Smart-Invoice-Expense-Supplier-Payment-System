# FinTech Smart Invoice, Expense & Supplier Payment System

A finance operations platform for small businesses. **This is accounting software, not a marketplace.** Clients owe the business money against sales invoices; suppliers are parties the business pays for rent, utilities, materials and services.

## Stack
- Frontend: React 18, Vite, TypeScript, Recharts, Lucide
- Backend: Node.js, Express, TypeScript, Zod, JWT, bcrypt, pdf-lib, Nodemailer, node-cron
- Database: MongoDB Atlas + Mongoose
- Hosting target: Vercel (frontend), Render (API), MongoDB Atlas

## Run locally
1. Install Node.js 20+ and MongoDB. MongoDB must run as a replica set for payment transactions.
2. Copy `backend/.env.example` to `backend/.env`; configure MongoDB and two independent JWT secrets of at least 32 characters.
3. Run `npm install` at repository root, then `npm run dev`.
4. API health: `http://localhost:4000/api/health`.
5. For a hosted API, set frontend `VITE_API_URL` to its origin (without a trailing slash).\n6. To send invoice emails and enable reminders, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in the backend environment. Never commit real SMTP credentials. The daily overdue reminder runs at `REMINDER_CRON` (default 09:00) in `REMINDER_TIMEZONE` (default `Asia/Kolkata`).

## Frontend integration
Includes login/register, role-aware navigation, live dashboard aggregates, searchable finance lists, client/supplier/expense/invoice/supplier-bill forms, expense approvals, and customer/supplier payment actions. Registration creates an Employee account; elevated roles must be granted by an administrator. The app uses the existing API endpoints and requires a running backend.

## API
- POST /api/auth/register, /api/auth/login, POST /api/auth/refresh
- GET/POST /api/clients and GET/POST /api/suppliers
- POST /api/suppliers/:id/portal-account (Admin only; creates a linked supplier login)
- GET/POST /api/invoices; POST /api/invoices/:id/payments\n- GET /api/invoices/:id/pdf (authenticated PDF download)\n- POST /api/invoices/:id/email (emails the PDF to the client email on file)
- GET/POST /api/expenses; PATCH /api/expenses/:id/review
- GET /api/dashboard; GET /api/audit-logs
- GET/POST /api/supplier-bills; POST /api/supplier-bills/:id/payments

## Financial integrity
Money is stored as integer paise. Invoice tax and discount are calculated server-side (discount before tax). Payment, balance update and audit entry use MongoDB transactions. Overpayments are rejected. Public registration cannot assign privileged roles.

## Limitations / production work
Safe edit/delete for clients, suppliers and pending expenses; unpaid invoices and supplier bills can be edited/deleted, while paid records and reviewed expenses are protected; refresh-token rotation/revocation, secure token storage, complete automated API tests and production deployment remain unfinished. SMTP must be configured before email delivery or scheduled reminders can run. The current frontend stores tokens in localStorage and is a development foundation, not production-hardened. This is not certified accounting or tax software.

## Roadmap
- [x] Core API, authentication, finance models and transactional payment endpoints
- [x] Live frontend auth, dashboard, searchable lists, create forms and payment/approval actions
- [x] Live frontend integration (PR #1)
- [x] Admin-provisioned supplier portal login with supplier-scoped bill listing
- [x] Safe edit/delete for clients, suppliers, pending expenses, and unpaid invoices/supplier bills
- [x] PDF invoice generation and authenticated download\n- [x] Email invoices to the client contact using configured SMTP\n- [x] Daily scheduled overdue reminders with per-invoice/per-day deduplication
- [ ] Token rotation/revocation and secure token storage
- [ ] Automated backend tests and CI verification
- [ ] Deployment configuration and production rollout
