import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const heartbeatRef = useRef<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      return;
    }
    // Support dedicated admin session that does not mark the platform user as connected
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admin = users.find((u: any) => u?.isAdmin);
        if (admin) setUser(admin);
      } catch {}
    }
  }, []);

  // Heartbeat for "connected users" (client-side only)
  useEffect(() => {
    // clear any existing interval
    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (user && !user.isAdmin && !String(window.location.pathname).toLowerCase().includes('admin')) {
      const sendBeat = () => {
        try {
          localStorage.setItem(`userHeartbeat:${user.id}`, JSON.stringify({ userId: user.id, lastSeen: Date.now() }));
        } catch {}
      };
      sendBeat();
      heartbeatRef.current = window.setInterval(sendBeat, 60000); // every 60s
    }
    return () => {
      if (heartbeatRef.current) {
        window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [user]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulation d'une vérification d'authentification
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      // Ensure admin flag stays in sync with adminEmails list if present
      const adminEmails: string[] = JSON.parse(localStorage.getItem('adminEmails') || '[]');
      const updatedUser: User = { ...existingUser, isAdmin: !!(existingUser.isAdmin || adminEmails.includes(existingUser.email)) };
      setUser(updatedUser);
      if (updatedUser.isAdmin) {
        // Do NOT mark as platform user; persist a dedicated admin session only
        localStorage.setItem('adminSession', '1');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      // persist back to users list
      const idx = users.findIndex((u: User) => u.id === updatedUser.id);
      if (idx !== -1) {
        users[idx] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      return true;
    }
    return false;
  };

  const register = async (email: string, _password: string, name: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      return false; // Utilisateur déjà existant
    }
    
    const adminEmails: string[] = JSON.parse(localStorage.getItem('adminEmails') || '[]');
    const noAdminsYet = !users.some((u: User) => u.isAdmin === true);
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      enrolledCourses: [],
      // First user becomes admin, or if email is listed in adminEmails
      isAdmin: noAdminsYet || adminEmails.includes(email)
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    const wasAdmin = !!user?.isAdmin;
    setUser(null);
    if (wasAdmin) {
      localStorage.removeItem('adminSession');
    } else {
      localStorage.removeItem('currentUser');
    }
    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  const enrollInCourse = (courseId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, courseId]
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Mise à jour dans le localStorage des utilisateurs
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const isEnrolled = (courseId: string): boolean => {
    return user ? user.enrolledCourses.includes(courseId) : false;
  };

  const unenrollFromCourse = (courseId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        enrolledCourses: user.enrolledCourses.filter(id => id !== courseId)
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Mise à jour dans le localStorage des utilisateurs
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    enrollInCourse,
    isEnrolled,
    unenrollFromCourse
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};