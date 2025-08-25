import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getAllCourses, getAllCoursesAsync } from '../services/adminCourses';
import { useNotification } from '../contexts/NotificationContext';
import { useProgress } from '../contexts/ProgressContext';
import { Course } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Récupère les cours inscrits depuis localStorage (simulation front)
  const localEnrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

  const [_, forceUpdate] = useState(0);
  const { addNotification } = useNotification();
  const { getCourseProgress } = useProgress();

  if (!user) {
    return null;
  }

  const [courses, setCourses] = useState<Course[]>(getAllCourses());

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const list = await getAllCoursesAsync();
      if (mounted) setCourses(list);
    };
    load();
    const onStorage = () => load();
    window.addEventListener('storage', onStorage);
    return () => { mounted = false; window.removeEventListener('storage', onStorage); };
  }, []);

  // Fusionne les cours inscrits du user et du localStorage (évite les doublons)
  const enrolledCourses = courses.filter(course => 
    user.enrolledCourses.includes(course.id) || localEnrolled.includes(course.id)
  );

  const totalHours = enrolledCourses.reduce((acc, course) => {
    const hours = parseFloat(course.duration.split('h')[0]);
    return acc + hours;
  }, 0);

  const recentCourses = enrolledCourses.slice(0, 3);
  const recommendedCourses = courses
    .filter(course => !user.enrolledCourses.includes(course.id))
    .slice(0, 3);

  const getCourseCompletion = (course: Course) => {
    const progress = getCourseProgress(course.id);
    if (!progress || !Array.isArray(progress.completedLessons)) return 0;
    // Filtrer les doublons et les ids invalides
    const uniqueCompleted = Array.from(new Set(progress.completedLessons)).filter(id =>
      course.modules.flatMap(m => m.lessons).some(lesson => lesson.id === id)
    );
    const totalLessons = course.modules.flatMap(m => m.lessons).length;
    if (totalLessons === 0) return 0;
    const percent = Math.round((uniqueCompleted.length / totalLessons) * 100);
    // Clamp entre 0 et 100
    return Math.max(0, Math.min(percent, 100));
  };

  const getGlobalProgression = () => {
    if (enrolledCourses.length === 0) return 0;
    const totalPercent = enrolledCourses.reduce((acc, course) => acc + getCourseCompletion(course), 0);
    return Math.round(totalPercent / enrolledCourses.length);
  };

  // Fonction de désinscription
  const handleUnenroll = (courseId: string, courseTitle: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir vous désinscrire de ce cours ?')) return;
    
    try {
      // Debug : afficher le contenu actuel
      const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      console.log('Cours inscrits avant suppression:', enrolled);
      console.log('Tentative de suppression du cours ID:', courseId);
      
      const updated = enrolled.filter((id: string) => id !== courseId);
      console.log('Cours inscrits après suppression:', updated);
      
      localStorage.setItem('enrolledCourses', JSON.stringify(updated));
      
      // Force la mise à jour de l'interface sans recharger la page
      forceUpdate(x => x + 1);
      
      // Pas de notification pour éviter les problèmes de réapparition
      console.log(`Désinscription réussie du cours : ${courseTitle}`);
      
      // Recharger la page après un délai pour s'assurer de la cohérence
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      addNotification({ 
        type: 'error', 
        title: 'Erreur', 
        message: 'Erreur lors de la désinscription du cours.' 
      });
    }
  };

  // Fonction pour supprimer tous les cours - VERSION FORCÉE
  const handleUnenrollAll = () => {
    if (!window.confirm('SUPPRESSION FORCÉE : Êtes-vous sûr de vouloir supprimer TOUS les cours ? Cette action est irréversible.')) return;
    
    try {
      console.log('=== SUPPRESSION FORCÉE DE TOUS LES COURS ===');
      
      // 1. Supprimer complètement la clé enrolledCourses
      localStorage.removeItem('enrolledCourses');
      console.log('✓ Clé enrolledCourses supprimée');
      
      // 2. Supprimer aussi user.enrolledCourses si elle existe
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.enrolledCourses) {
        delete userData.enrolledCourses;
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✓ user.enrolledCourses supprimé');
      }
      
      // 3. Supprimer toutes les clés qui pourraient contenir des cours
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('course') || key.includes('enrolled') || key.includes('enrollment'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✓ Clé ${key} supprimée`);
      });
      
      // 4. Forcer la mise à jour de l'interface
      forceUpdate(x => x + 1);
      
      console.log('=== SUPPRESSION TERMINÉE ===');
      
      // 5. Recharger la page immédiatement
      window.location.reload();
      
    } catch (error) {
      console.error('Erreur lors de la suppression forcée:', error);
      // En cas d'erreur, forcer quand même le rechargement
      window.location.reload();
    }
  };

  // Fonction de debug pour vérifier le localStorage
  const debugLocalStorage = () => {
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    console.log('=== DEBUG LOCALSTORAGE ===');
    console.log('Cours inscrits:', enrolled);
    console.log('Nombre de cours:', enrolled.length);
    console.log('Type de données:', typeof enrolled);
    console.log('=======================');
  };

  // Fonction de suppression nucléaire - VIDE TOUT LE LOCALSTORAGE
  const nuclearClear = () => {
    if (!window.confirm('SUPPRESSION NUCLÉAIRE : Voulez-vous vraiment vider TOUT le localStorage ? Cela supprimera toutes les données (cours, notifications, etc.)')) return;
    
    try {
      console.log('=== SUPPRESSION NUCLÉAIRE ===');
      
      // Vider complètement le localStorage
      localStorage.clear();
      console.log('✓ localStorage complètement vidé');
      
      // Recharger immédiatement
      window.location.reload();
      
    } catch (error) {
      console.error('Erreur lors de la suppression nucléaire:', error);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user.name} !
          </h1>
          <p className="text-gray-600 mt-2">
            Continuez votre apprentissage et atteignez vos objectifs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {enrolledCourses.length}
                </h3>
                <p className="text-gray-600">Cours inscrits</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {totalHours.toFixed(0)}h
                </h3>
                <p className="text-gray-600">Temps total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {Math.floor(enrolledCourses.length * 0.6)}
                </h3>
                <p className="text-gray-600">Cours terminés</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {getGlobalProgression()}%
                </h3>
                <p className="text-gray-600">Progression</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Mes cours</h2>
                <div className="flex items-center gap-4">
                  {enrolledCourses.length > 0 && (
                    <button
                      onClick={handleUnenrollAll}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      title="Supprimer tous les cours"
                    >
                      Tout supprimer
                    </button>
                  )}
                  <button
                    onClick={debugLocalStorage}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    title="Debug localStorage"
                  >
                    Debug
                  </button>
                  <button
                    onClick={nuclearClear}
                    className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-300 px-2 py-1 rounded bg-red-50"
                    title="Vider le localStorage"
                  >
                    🗑️ Vider tout
                  </button>
                <Link
                  to="/courses"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Voir tout
                </Link>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Link to={`/course/${course.id}`} className="flex items-center flex-1">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.category}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${getCourseCompletion(course)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {getCourseCompletion(course)}%
                          </span>
                        </div>
                      </div>
                      <Play className="h-5 w-5 text-blue-600" />
                    </Link>
                      <button
                        onClick={() => handleUnenroll(course.id, course.title)}
                        className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-semibold transition-colors"
                        title="Se désinscrire de ce cours"
                      >
                        Se désinscrire
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun cours inscrit
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Explorez notre catalogue pour commencer votre apprentissage
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/courses"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Parcourir les cours
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recommandé pour vous</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">{course.category}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-blue-600 font-medium">
                          {course.price.toLocaleString('fr-FR')} CFA
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{course.level}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/courses"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Explorer les cours</h3>
                <p className="text-sm text-gray-600">Découvrez de nouveaux sujets</p>
              </div>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <Award className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Mes certificats</h3>
                <p className="text-sm text-gray-600">Voir vos accomplissements</p>
              </div>
            </Link>
            
            <div className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Objectifs</h3>
                <p className="text-sm text-gray-600">Définir vos objectifs d'apprentissage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;