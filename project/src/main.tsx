import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// One-time seeding and enforcement of a single admin
(() => {
  try {
    const ADMIN_EMAIL = 'IAI_Admin';
    const ADMIN_NAME = 'Administrateur';
    // Note: Password is not verified by the current Auth flow (MVP).
    // It is provided separately in a note for reference.

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let admin = users.find((u: any) => u.email === ADMIN_EMAIL);
    // Create admin if missing
    if (!admin) {
      admin = {
        id: `admin-${Date.now()}`,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        enrolledCourses: [],
        isAdmin: true,
      };
      users.push(admin);
    }
    // Enforce only this identifier is admin
    const normalized = users.map((u: any) => ({ ...u, isAdmin: u.email === ADMIN_EMAIL }));
    localStorage.setItem('users', JSON.stringify(normalized));

    // Keep a single whitelist for admin identifiers
    localStorage.setItem('adminEmails', JSON.stringify([ADMIN_EMAIL]));

    // If a currentUser exists and is not the designated admin, ensure isAdmin is false
    const cuRaw = localStorage.getItem('currentUser');
    if (cuRaw) {
      const cu = JSON.parse(cuRaw);
      const synced = { ...cu, isAdmin: cu.email === ADMIN_EMAIL };
      localStorage.setItem('currentUser', JSON.stringify(synced));
    }
  } catch {
    // silent fail; seeding is best-effort
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
