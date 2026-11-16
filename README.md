# FinTech Smart Invoice, Expense & Supplier Payment System

A full-stack accounting platform for small businesses. The project is being built in phased, reviewable commits. See the roadmap and setup notes below.

## Product scope

- Sales invoices, client receipts and accounts receivable
- Supplier bills, supplier payments and accounts payable
- Expense submission and approval
- Role-based access for Admin, Accountant, Supplier and Employee
- Financial dashboard, audit trail, PDF invoices and email reminders

## Architecture

- `frontend/`: React, Vite, TypeScript, Tailwind CSS
- `backend/`: Node.js, Express, TypeScript, Mongoose
- MongoDB Atlas for persistence

## Financial integrity

All monetary input is validated and calculations are performed on the server in integer minor units (paise). Payment creation and invoice balance updates are transactional. Supplier access is scoped to the supplier account linked to the authenticated user.

## Development status

Initial foundation: repository structure, API foundation, authentication, role guards, financial domain models and core UI. Production deployment requires environment secrets, MongoDB replica-set support for transactions, email credentials and hosting configuration.
