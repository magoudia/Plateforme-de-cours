import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import { useNotification } from '../../contexts/NotificationContext';

interface RequireLessonCompletedProps {
  courseId: string;
  lessonId: string;
  redirectTo?: string;
  children: ReactNode;
}

const RequireLessonCompleted: React.FC<RequireLessonCompletedProps> = ({
  courseId,
  lessonId,
  redirectTo,
  children
}) => {
  const { getLessonProgress } = useProgress();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const completed = getLessonProgress(courseId, lessonId);
    if (!completed) {
      addNotification({
        type: 'error',
        title: 'Accès au quiz verrouillé',
        message: "Terminez d'abord la leçon correspondante pour accéder à ce quiz."
      });
      navigate(redirectTo || `/course/${courseId}/learn`, { replace: true });
    }
  }, [courseId, lessonId, getLessonProgress, navigate, addNotification, redirectTo]);

  const completed = getLessonProgress(courseId, lessonId);
  if (!completed) return null;

  return <>{children}</>;
};

export default RequireLessonCompleted;
