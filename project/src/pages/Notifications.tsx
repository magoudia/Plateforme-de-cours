import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
  // Supabase metadata (optional)
  _table?: 'notifications' | 'user_notifications';
  _sid?: string; // Supabase row id (uuid or number)
  _targeted?: boolean; // true if from user_notifications
}

const readJSON = (key: string) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};
const writeJSON = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const iconByType = {
  success: (
    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  ),
  error: (
    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  info: (
    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
  ),
};

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifs] = useState<Notification[]>([]);
  const userKey = useMemo(() => {
    const id = (user as any)?.id || (user as any)?.email || '';
    return id ? `notifications:${id}` : '';
  }, [user]);
  const userId = useMemo(() => (user as any)?.id || (user as any)?.email || '', [user]);

  useEffect(() => {
    if (!user) navigate('/login');

    // No Supabase subscriptions; rely on window events only

    const load = async () => {
      let targeted: Notification[] = userKey ? readJSON(userKey) : [];
      const broadcasts: Notification[] = readJSON('notifications');

      setNotifs([...(targeted || []), ...(broadcasts || [])]);
    };

    load();

    const onUpd = () => load();
    window.addEventListener('notifications:updated', onUpd);
    if (userKey) window.addEventListener(`notifications:updated:${userKey.split(':')[1]}`, onUpd);

    // No Supabase realtime; events above handle UI updates

    return () => {
      window.removeEventListener('notifications:updated', onUpd);
      if (userKey) window.removeEventListener(`notifications:updated:${userKey.split(':')[1]}`, onUpd);
      // nothing to unsubscribe beyond window events
    };
  }, [user, navigate, userKey, userId]);

  const markAsRead = async (id: string) => {
    const item = notifications.find(n => n.id === id);
    // try targeted first
    if (userKey) {
      const targeted: Notification[] = readJSON(userKey);
      if (Array.isArray(targeted) && targeted.some(n => n.id === id)) {
        const next = targeted.map(n => n.id === id ? { ...n, read: true } : n);
        writeJSON(userKey, next);
        setNotifs([...(next || []), ...(readJSON('notifications') || [])]);
        return;
      }
    }
    // fallback to broadcast
    const broadcast: Notification[] = readJSON('notifications');
    const nextB = broadcast.map(n => n.id === id ? { ...n, read: true } : n);
    writeJSON('notifications', nextB);
    setNotifs([...(userKey ? readJSON(userKey) : []), ...nextB]);
  };

  const deleteNotif = async (id: string) => {
    const item = notifications.find(n => n.id === id);
    if (userKey) {
      const targeted: Notification[] = readJSON(userKey);
      if (Array.isArray(targeted) && targeted.some(n => n.id === id)) {
        const next = targeted.filter(n => n.id !== id);
        writeJSON(userKey, next);
        setNotifs([...(next || []), ...(readJSON('notifications') || [])]);
        return;
      }
    }
    const broadcast: Notification[] = readJSON('notifications');
    const nextB = broadcast.filter(n => n.id !== id);
    writeJSON('notifications', nextB);
    setNotifs([...(userKey ? readJSON(userKey) : []), ...nextB]);
  };

  const markAllAsRead = () => {
    // mark both stores as read
    const broadcast: Notification[] = readJSON('notifications').map((n: any) => ({ ...n, read: true }));
    writeJSON('notifications', broadcast);
    if (userKey) {
      const targeted: Notification[] = readJSON(userKey).map((n: any) => ({ ...n, read: true }));
      writeJSON(userKey, targeted);
    }
    const merged = [...(userKey ? readJSON(userKey) : []), ...readJSON('notifications')];
    setNotifs(merged);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <button onClick={markAllAsRead} className="text-sm text-iai-blue hover:underline">Tout marquer comme lu</button>
        </div>
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400 py-16">Aucune notification</div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start bg-white rounded-lg shadow p-4 gap-4 border-l-4 ${n.type === 'success' ? 'border-green-600' : n.type === 'error' ? 'border-red-600' : 'border-blue-600'} ${!n.read ? 'opacity-100' : 'opacity-70'}`}>
                <div className="mt-1">{iconByType[n.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className={`font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-500'}`}>{n.title}</h2>
                    <span className="text-xs text-gray-400 ml-2">{new Date(n.date).toLocaleString()}</span>
                  </div>
                  <p className={`text-sm mt-1 ${!n.read ? 'text-gray-700' : 'text-gray-400'}`}>{n.message}</p>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="mt-2 text-xs text-iai-blue hover:underline">Marquer comme lu</button>
                  )}
                </div>
                <button onClick={() => deleteNotif(n.id)} className="ml-2 text-gray-400 hover:text-red-600" title="Supprimer">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 