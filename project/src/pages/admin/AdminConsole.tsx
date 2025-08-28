import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import AdminDashboard from './AdminDashboard';
import AdminCourses from './AdminCourses';
import AdminNotifications from './AdminNotifications';

const AdminConsole: React.FC = () => {
  const { user, login, logout } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'notifications'>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAdmin = !!user?.isAdmin;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Strict credentials check (local only)
    const ADMIN_ID = 'IAI_Admin';
    const ADMIN_PWD = 'IAI@admin';
    if (email !== ADMIN_ID || password !== ADMIN_PWD) {
      addNotification({ type: 'error', title: 'Identifiants incorrects', message: 'Veuillez vérifier l\'identifiant et le mot de passe.' });
      return;
    }
    const ok = await login(email, password);
    if (ok) {
      addNotification({ type: 'success', title: 'Bienvenue', message: 'Connexion administrateur réussie.' });
    } else {
      addNotification({ type: 'error', title: 'Échec connexion', message: 'Impossible d\'établir la session.' });
    }
  };

  const header = (
    <div className="sticky top-0 z-10 shadow-sm">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/20 backdrop-blur grid place-items-center font-semibold">A</div>
            <div>
              <h1 className="font-semibold leading-5">Console d'administration</h1>
              <p className="text-xs text-white/80 -mt-0.5">Gérez la plateforme depuis un seul endroit</p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline text-white/90">{user?.email}</span>
              <button className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition duration-200" onClick={logout}>Se déconnecter</button>
            </div>
          )}
        </div>
      </div>
      {isAdmin && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="py-2">
              <div className="inline-flex rounded-lg bg-gray-100 p-1">
                <button
                  className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-95 ${activeTab==='dashboard' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:text-indigo-700'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-95 ${activeTab==='courses' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:text-indigo-700'}`}
                  onClick={() => setActiveTab('courses')}
                >
                  Gestion des cours
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-95 ${activeTab==='notifications' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:text-indigo-700'}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {header}
        <div className="max-w-md mx-auto mt-16">
          <div className="bg-white border rounded-2xl p-6 shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Connexion administrateur</h2>
              <p className="text-sm text-gray-500">Saisissez vos identifiants pour accéder à la console</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium">Identifiant</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="Identifiant admin"
                  type="text"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mot de passe</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">La console admin vérifie ces identifiants en local.</p>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg text-white shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-95 transition duration-200">Se connecter</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {header}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border rounded-2xl shadow-sm p-4">
          {activeTab === 'dashboard' ? (
            <AdminDashboard />
          ) : activeTab === 'courses' ? (
            <AdminCourses />
          ) : (
            <AdminNotifications />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
