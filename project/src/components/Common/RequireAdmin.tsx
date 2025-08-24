import React, { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      addNotification({ type: 'error', title: 'Accès restreint', message: 'Veuillez vous connecter pour accéder à l’administration.' });
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }
    if (!user.isAdmin) {
      addNotification({ type: 'error', title: 'Accès refusé', message: 'Vous devez être administrateur pour accéder à cette section.' });
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, addNotification, location.pathname]);

  if (!user || !user.isAdmin) return null;
  return <>{children}</>;
};

export default RequireAdmin;
