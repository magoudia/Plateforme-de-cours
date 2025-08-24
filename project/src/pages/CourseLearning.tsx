import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Users, Star, Crown } from 'lucide-react';
import { getAllCourses } from '../services/adminCourses';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNotification } from '../contexts/NotificationContext';
import CourseModules from '../components/Course/CourseModules';
import LessonViewer from '../components/Course/LessonViewer';
import { Course, Lesson } from '../types';

const CourseLearning: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isEnrolled } = useAuth();
  const { getCourseProgress, updateCurrentLesson, getLessonProgress, isLessonLocked, isQuizLocked } = useProgress();
  const { addNotification } = useNotification();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>(getAllCourses());

  useEffect(() => {
    const onStorage = () => setCourses(getAllCourses());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === id);
    if (!foundCourse) {
      navigate('/courses');
      return;
    }

    // Vérifier si l'utilisateur est inscrit
    if (!isEnrolled(foundCourse.id)) {
      addNotification({
        type: 'error',
        title: 'Accès refusé',
        message: 'Vous devez être inscrit à ce cours pour y accéder'
      });
      navigate(`/course/${foundCourse.id}`);
      return;
    }

    setCourse(foundCourse);
    
    // Récupérer toutes les leçons de tous les modules
    const lessons = foundCourse.modules.flatMap(module => module.lessons);
    setAllLessons(lessons);

    // Récupérer la progression de l'utilisateur
    const progress = getCourseProgress(foundCourse.id);
    if (progress?.currentLesson) {
      const lessonIndex = lessons.findIndex(lesson => lesson.id === progress.currentLesson);
      if (lessonIndex !== -1) {
        setCurrentLessonIndex(lessonIndex);
        setCurrentLesson(lessons[lessonIndex]);
      } else {
        setCurrentLesson(lessons[0]);
      }
    } else {
      setCurrentLesson(lessons[0]);
    }
  }, [id, navigate, isEnrolled, getCourseProgress, addNotification, courses]);

  const handleLessonSelect = (lesson: Lesson) => {
    // Bloquer la sélection si la leçon est verrouillée par séquence ou par règle de quiz
    if (isLessonLocked(course!.id, lesson.id, allLessons)) {
      addNotification({
        type: 'error',
        title: 'Leçon verrouillée',
        message: 'Cette leçon sera débloquée après avoir terminé la précédente.'
      });
      return;
    }
    if (lesson.type === 'quiz' && isQuizLocked(course!.id, lesson.id, allLessons)) {
      addNotification({
        type: 'error',
        title: 'Quiz verrouillé',
        message: 'Vous devez d\'abord réussir le premier quiz pour débloquer les autres.'
      });
      return;
    }

    const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
    setCurrentLesson(lesson);
    setCurrentLessonIndex(lessonIndex);
    updateCurrentLesson(course!.id, lesson.id);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex >= allLessons.length - 1) return;

    // Exiger que la leçon courante soit complétée avant d'aller à la suivante
    const isCurrentCompleted = getLessonProgress(course!.id, currentLesson!.id);
    if (!isCurrentCompleted) {
      addNotification({
        type: 'error',
        title: 'Progression étape par étape',
        message: 'Veuillez terminer la leçon actuelle avant de passer à la suivante.'
      });
      return;
    }

    const nextLesson = allLessons[currentLessonIndex + 1];
    // Empêcher si la prochaine leçon est verrouillée (sécurité supplémentaire)
    if (isLessonLocked(course!.id, nextLesson.id, allLessons)) {
      addNotification({
        type: 'error',
        title: 'Leçon verrouillée',
        message: 'Cette leçon sera débloquée après avoir terminé la précédente.'
      });
      return;
    }
    // Empêcher si la prochaine est un quiz verrouillé par la règle "premier quiz d'abord"
    if (nextLesson.type === 'quiz' && isQuizLocked(course!.id, nextLesson.id, allLessons)) {
      addNotification({
        type: 'error',
        title: 'Quiz verrouillé',
        message: 'Vous devez d\'abord réussir le premier quiz pour débloquer les autres.'
      });
      return;
    }

    handleLessonSelect(nextLesson);
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = allLessons[currentLessonIndex - 1];
      handleLessonSelect(previousLesson);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);
  const completedLessons = progress?.completedLessons.length || 0;
  const totalLessons = allLessons.length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                to={`/course/${course.id}`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au cours
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">
                  Leçon {currentLessonIndex + 1} sur {totalLessons}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {completedLessons}/{totalLessons} leçons terminées
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-sm font-medium text-gray-900 w-12">
                {progressPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Lesson Viewer */}
          <div className="lg:col-span-2">
            <LessonViewer
              lesson={currentLesson}
              course={course}
              onNextLesson={handleNextLesson}
              onPreviousLesson={handlePreviousLesson}
              hasNextLesson={currentLessonIndex < allLessons.length - 1}
              hasPreviousLesson={currentLessonIndex > 0}
            />
          </div>

          {/* Sidebar - Course Modules */}
          <div className="lg:col-span-1">
            <CourseModules
              course={course}
              onLessonSelect={handleLessonSelect}
              currentLessonId={currentLesson.id}
            />

            {/* Course Info Card */}
            <div className="bg-white rounded-lg shadow-sm border mt-6 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informations du cours</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.category}</p>
                    <p className="text-xs text-gray-500">Catégorie</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.duration}</p>
                    <p className="text-xs text-gray-500">Durée totale</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.studentsCount.toLocaleString('fr-FR')}</p>
                    <p className="text-xs text-gray-500">Étudiants inscrits</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.rating}/5</p>
                    <p className="text-xs text-gray-500">Note moyenne</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeColor(course.level)}`}>
                    {course.level}
                  </span>
                  {course.isPremium && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning; 