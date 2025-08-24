import React, { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  });

  const save = (notifs: Notification[]) => {
    setNotifications(notifs);
    localStorage.setItem('notifications', JSON.stringify(notifs));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      read: false,
    };
    save([newNotif, ...notifications]);
  };

  const markAsRead = (id: string) => {
    save(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    save(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    save(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, deleteNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}; 