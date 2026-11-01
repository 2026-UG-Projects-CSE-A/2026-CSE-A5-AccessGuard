# AccessGuard — Banking Management

Frontend-only React preview of Role-Based Access Control (RBAC) across seven banking roles. It uses sample customer, balance, and employee records. There is no backend or banking integration, and browser-side authorization is not a security boundary.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

## Preview access

Choose a role from the **Quick sign-in** section on the login screen to populate its account credentials.

Suggested walkthrough: teller → submit a transaction → open Access Denied on Users → switch to manager → approve/complete → switch to customer → switch to auditor → switch to Super Admin.

## Reset

Use **Reset sample data** in the profile menu to restore the original dataset stored in `localStorage`.
