import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-[70vh] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6 py-6">
        {/* Mobile header */}
        <div className="md:hidden -mt-2">
          <button
            onClick={() => setOpen(!open)}
            className="w-full px-3 py-2 rounded-md border text-sm bg-white hover:bg-gray-50"
            aria-expanded={open}
            aria-controls="admin-sidebar"
          >
            {open ? 'Fermer le menu' : 'Ouvrir le menu'}
          </button>
        </div>

        <aside id="admin-sidebar" className={`w-full md:w-64 shrink-0 bg-white rounded-lg shadow p-4 ${open ? '' : 'hidden md:block'}`}>
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Administration</h1>
            <p className="text-sm text-gray-500">Gérez la plateforme</p>
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              Tableau de bord
            </NavLink>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              Cours
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              Utilisateurs
            </NavLink>
            <NavLink
              to="/admin/notifications"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              Notifications
            </NavLink>
            <div className="pt-3 mt-3 border-t">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← Retour au site
              </Link>
            </div>
          </nav>
        </aside>
        <section className="flex-1">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
