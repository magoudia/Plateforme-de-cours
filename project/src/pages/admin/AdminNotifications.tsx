import React, { useEffect, useMemo, useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const AdminNotifications: React.FC = () => {
  const { notifications, addNotification, markAsRead, deleteNotification, markAllAsRead } = useNotification();
  const [users, setUsers] = useState<any[]>([]);
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState<string>('all');
  const [justSent, setJustSent] = useState<string>('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(Array.isArray(stored) ? stored : []);
    } catch {
      setUsers([]);
    }
  }, []);

  const userOptions = useMemo(() => {
    const opts = users.map((u: any) => ({
      id: u?.id || u?.email || '',
      label: (u?.name && u?.email) ? `${u.name} (${u.email})` : (u?.name || u?.email || 'Utilisateur'),
    })).filter(o => !!o.id);
    return opts;
  }, [users]);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    const payload = { type, title: title.trim(), message: message.trim() } as const;
    if (recipient === 'all') {
      // broadcast via context
      addNotification(payload);
      setJustSent('Notification envoyée à tous les utilisateurs.');
    } else {
      // targeted to user-specific bucket
      try {
        const key = `notifications:${recipient}`;
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const newNotif = {
          ...payload,
          id: Math.random().toString(36).slice(2),
          date: new Date().toISOString(),
          read: false,
        };
        const next = Array.isArray(arr) ? [newNotif, ...arr] : [newNotif];
        localStorage.setItem(key, JSON.stringify(next));
        // notify listening UIs
        window.dispatchEvent(new Event('notifications:updated'));
        window.dispatchEvent(new Event(`notifications:updated:${recipient}`));
        setJustSent('Notification envoyée à l’utilisateur sélectionné.');
      } catch {
        setJustSent('Erreur lors de l’envoi.');
      }
    }
    setTitle('');
    setMessage('');
    setType('info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-sm text-gray-500">Envoyer et gérer les notifications (stockées localement).</p>
        </div>
        <button onClick={markAllAsRead} className="px-3 py-2 rounded border text-sm hover:bg-gray-50">Tout marquer comme lu</button>
      </div>

      <form onSubmit={onSend} className="p-4 rounded border bg-white space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Destinataire</label>
            <select className="mt-1 w-full rounded border-gray-300" value={recipient} onChange={(e)=>setRecipient(e.target.value)}>
              <option value="all">Tous (broadcast)</option>
              {userOptions.map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select className="mt-1 w-full rounded border-gray-300" value={type} onChange={(e)=>setType(e.target.value as any)}>
              <option value="info">info</option>
              <option value="success">success</option>
              <option value="error">error</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium">Titre</label>
            <input className="mt-1 w-full rounded border-gray-300" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Titre de la notification" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea className="mt-1 w-full rounded border-gray-300" rows={3} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Contenu du message" />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{justSent}</div>
          <div className="flex justify-end">
            <button type="submit" className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700">Envoyer</button>
          </div>
        </div>
      </form>

      <div className="space-y-2">
        <h3 className="font-medium">Historique</h3>
        <div className="grid grid-cols-1 gap-3">
          {notifications.length === 0 && (
            <div className="text-sm text-gray-500">Aucune notification pour le moment.</div>
          )}
          {notifications.map(n => (
            <div key={n.id} className={`p-4 rounded border ${n.read ? 'bg-white' : 'bg-indigo-50/40'} `}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide ${n.type==='success' ? 'bg-green-100 text-green-700' : n.type==='error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{n.type}</span>
                    <h4 className="font-medium truncate">{n.title}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{n.message}</p>
                  <div className="text-xs text-gray-500 mt-1">{new Date(n.date).toLocaleString()}</div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {!n.read && (
                    <button onClick={()=>markAsRead(n.id)} className="px-2 py-1 rounded border text-xs hover:bg-gray-50">Marquer lu</button>
                  )}
                  <button onClick={()=>deleteNotification(n.id)} className="px-2 py-1 rounded border text-xs hover:bg-gray-50">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
