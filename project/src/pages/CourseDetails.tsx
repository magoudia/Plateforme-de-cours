import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Crown, PlayCircle, FileText, HelpCircle, ArrowLeft, Lock } from 'lucide-react';
import { getAllCourses } from '../services/adminCourses';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNotification } from '../contexts/NotificationContext';
import { Course } from '../types';
import waveLogo from '../assets/wave.jpeg';
import orangeLogo from '../assets/orange(2).jpeg';
import visaLogo from '../assets/visa.jpeg';
import mixbyyasLogo from '../assets/mixbyyas.jpeg';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isEnrolled, enrollInCourse, unenrollFromCourse } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { isLessonLocked, getCourseProgress } = useProgress();
  
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  useEffect(() => {
    const onStorage = () => setCourses(getAllCourses());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const course = courses.find(c => c.id === id);
  // Calculer si le cours est entièrement terminé
  const progress = course ? getCourseProgress(course.id) : null;
  const completedCount = progress?.completedLessons
    ? Array.from(new Set(progress.completedLessons)).filter(id =>
        course?.lessons.some(l => l.id === id)
      ).length
    : 0;
  const totalLessons = course?.lessons.length || 0;
  const isCourseCompleted = totalLessons > 0 && completedCount >= totalLessons;
  
  // Montant formaté & téléphone officiel de paiement
  const formattedPrice = `${Number(course?.price || 0).toLocaleString('fr-FR')} CFA`;
  const PAYMENT_PHONE = '783079445'; // Remplace par ton numéro officiel si besoin

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cours non trouvé</h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isUserEnrolled = isEnrolled(course.id);
  // Utilise uniquement le contexte d'authentification pour la cohérence
  const isActuallyEnrolled = isUserEnrolled;
  // Force la mise à jour quand forceUpdate change
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [form, setForm] = useState({ name: '', email: '', phone: '', card: '', level: '', message: '', startDate: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  // Utilise le contexte d'authentification pour l'inscription
  const addCourseToLocalStorage = (courseId: string) => {
    enrollInCourse(courseId);
  };

  // Enregistrer une inscription (ex-"demande de devis") dans le localStorage
  const saveQuoteRequest = () => {
    try {
      const key = 'enrollments';
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      const entry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
        courseId: course.id,
        courseTitle: course.title,
        name: form.name || '',
        email: form.email || '',
        phone: form.phone || '',
        level: form.level || '',
        startDate: form.startDate || '',
        message: form.message || '',
        source: 'course_details',
        status: 'new'
      };
      const next = Array.isArray(arr) ? [...arr, entry] : [entry];
      localStorage.setItem(key, JSON.stringify(next));
      // notifier l'admin en temps réel si la page est ouverte
      window.dispatchEvent(new Event('enrollments:updated'));
      // Compatibilité ascendante (listeners existants)
      window.dispatchEvent(new Event('leads:updated'));
    } catch (e) {
      console.error('saveQuoteRequest error', e);
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

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <PlayCircle className="h-4 w-4" />;
    }
  };

  const handleEnroll = () => {
    if (user) {
      enrollInCourse(course.id);
    }
  };

  const handleFakePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
      setShowPaymentModal(false);
      addCourseToLocalStorage(course.id);
      setShowToast({ type: 'success', message: 'Paiement réussi ! Vous êtes inscrit à ce cours.' });
      addNotification({
        type: 'success',
        title: 'Inscription réussie',
        message: `Vous êtes inscrit au cours : ${course.title}`
      });
      setTimeout(() => {
        setShowToast(null);
        navigate(`/course/${course.id}`);
      }, 2000);
    }, 2000);
  };

  // Validation simple
  const isStep2Valid = form.name.trim() && form.email.trim();
  // Validation stricte numéro SN (Orange/Wave/Mixbyyas): 70/75/76/77/78 + 7 chiffres
  const normalizePhone = (p: string) => p.replace(/\D/g, '');
  const snPhoneRegex = /^(70|75|76|77|78)\d{7}$/;
  const isPhoneValid = () => {
    if (paymentMethod === 'card') return true;
    const digits = normalizePhone(form.phone);
    return snPhoneRegex.test(digits);
  };
  const isStep3Valid = paymentMethod === 'card' ? Boolean(form.card.trim()) : isPhoneValid();

  // Fonction pour vérifier si on doit passer aux instructions de paiement
  const shouldShowPaymentInstructions = () => {
    return (paymentMethod === 'wave' || paymentMethod === 'orange' || paymentMethod === 'mixbyyas') && isPhoneValid();
  };

  // Fonction pour obtenir les instructions de paiement
  const getPaymentInstructions = () => {
    const amountNumber = Number(course.price || 0);
    const amountLabel = `${amountNumber.toLocaleString('fr-FR')} CFA`;
    if (paymentMethod === 'wave') {
      return {
        title: 'Paiement Wave',
        instructions: [
          `Envoyez ${amountLabel} au numéro : ${PAYMENT_PHONE}`,
          'Ou scannez le QR code Wave ci-dessous',
          'Attendez la confirmation de paiement',
          'Cliquez sur "J\'ai payé" une fois le paiement effectué'
        ],
        // Placeholder sans montant numérique
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wave://pay?phone=${PAYMENT_PHONE}&amount=${amountNumber}`
      };
    } else if (paymentMethod === 'orange') {
      return {
        title: 'Paiement Orange Money',
        instructions: [
          `Envoyez ${amountLabel} au numéro : ${PAYMENT_PHONE}`,
          `Ou utilisez le code USSD : #150*1*${PAYMENT_PHONE}*${amountNumber}#`,
          'Attendez la confirmation de paiement',
          'Cliquez sur "J\'ai payé" une fois le paiement effectué'
        ],
        // Placeholder sans montant numérique
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=orange://pay?phone=${PAYMENT_PHONE}&amount=${amountNumber}`
      };
    } else if (paymentMethod === 'mixbyyas') {
      return {
        title: 'Paiement Mixbyyas',
        instructions: [
          `Envoyez ${amountLabel} via Mixbyyas au numéro : ${PAYMENT_PHONE}`,
          'Indiquez en référence votre email d\'inscription',
          'Attendez la confirmation de paiement',
          'Cliquez sur "J\'ai payé" une fois le paiement effectué'
        ],
        // Placeholder sans montant numérique
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=mixbyyas://pay?phone=${PAYMENT_PHONE}&amount=${amountNumber}`
      };
    }
    return null;
  };

  // Fonction de désinscription
  const handleUnenroll = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir vous désinscrire de ce cours ?')) return;
    
    try {
      unenrollFromCourse(course.id);
      
      // Force la mise à jour de l'interface
      setForceUpdate(prev => prev + 1);
      
      setShowToast({ type: 'success', message: 'Vous vous êtes désinscrit de ce cours.' });
      
      setTimeout(() => {
        setShowToast(null);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      setShowToast({ type: 'error', message: 'Erreur lors de la désinscription.' });
      setTimeout(() => {
        setShowToast(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/courses"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="text-sm text-blue-600 font-medium">{course.category}</span>
                    {course.isPremium && (
                      <div className="flex items-center text-yellow-600">
                        <Crown className="h-4 w-4" />
                        <span className="text-sm font-medium ml-1">Premium</span>
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {course.title}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {course.description}
                  </p>
                </div>
                {isActuallyEnrolled && (
                  <button
                    onClick={handleUnenroll}
                    className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-semibold"
                  >
                    Se désinscrire
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{course.studentsCount.toLocaleString('fr-FR')} étudiants</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                  <span>{course.rating} ({Math.floor(course.studentsCount * 0.3).toLocaleString('fr-FR')} avis)</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Contenu du cours</h2>
                {isActuallyEnrolled && (
                  <span className="text-sm text-blue-600 font-medium">
                    Cliquez sur une leçon pour commencer l'apprentissage
                  </span>
                )}
              </div>
              {course.modulesSchedule && course.modulesSchedule.length > 0 && (
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">Dates</th>
                        <th className="px-4 py-2 border">Module</th>
                        <th className="px-4 py-2 border">Titre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.modulesSchedule.map((mod, idx) => (
                        <tr key={idx} className="text-gray-700">
                          <td className="px-4 py-2 border">{mod.start} - {mod.end}</td>
                          <td className="px-4 py-2 border font-semibold">{mod.module}</td>
                          <td className="px-4 py-2 border">{mod.title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => {
                  const locked = isLessonLocked(course.id, lesson.id, course.lessons);
                  const rowClasses = `flex items-center justify-between p-3 rounded-lg border ${
                    isActuallyEnrolled ? (locked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer') : 'opacity-60'
                  }`;
                  return (
                  <div
                    key={lesson.id}
                    className={rowClasses}
                    onClick={() => {
                      if (!isActuallyEnrolled) return;
                      if (locked) {
                        addNotification({
                          type: 'error',
                          title: 'Leçon verrouillée',
                          message: 'Terminez d\'abord la leçon précédente pour débloquer celle-ci.'
                        });
                        return;
                      }
                      navigate(`/course/${course.id}/learn`);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        {getLessonIcon(lesson.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{lesson.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{lesson.duration}</span>
                      {isActuallyEnrolled && (
                        <span className="text-blue-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                  );
                })}
                {/* Accès au quiz : seulement si le cours est terminé */}
                {course.id === '3' && (
                  <button
                    onClick={() => {
                      if (!isCourseCompleted) {
                        addNotification({
                          type: 'error',
                          title: 'Quiz verrouillé',
                          message: 'Terminez toutes les leçons du cours avant d\'accéder au quiz.'
                        });
                        return;
                      }
                      navigate('/quiz-python-interactif');
                    }}
                    disabled={!isCourseCompleted}
                    className={`mt-6 w-full text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                      isCourseCompleted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCourseCompleted ? 'Accéder au Quiz interactif en Python' : (
                      <span className="inline-flex items-center">
                        <Lock className="h-4 w-4 mr-2" /> Quiz verrouillé
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {course.price > 0 ? formattedPrice : 'Gratuit'}
                </div>
                <p className="text-gray-600 text-sm">Prix fixe</p>
              </div>

              {user ? (
                isActuallyEnrolled || paymentSuccess ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 text-green-800 p-3 rounded-lg text-center font-medium">
                      ✓ Vous êtes inscrit à ce cours
                    </div>
                    <Link
                      to={`/course/${course.id}/learn`}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                    >
                      Commencer le cours
                    </Link>
                    <button
                      onClick={handleUnenroll}
                      className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                    >
                      Se désinscrire
                    </button>
                  </div>
                ) : (
                  course.price > 0 ? (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-iai-bordeaux text-white py-3 px-4 rounded-lg hover:bg-iai-blue transition-colors font-medium"
                    >
                      Payer {formattedPrice} et s'inscrire
                    </button>
                ) : (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-iai-blue text-white py-3 px-4 rounded-lg hover:bg-iai-bordeaux transition-colors font-medium"
                  >
                      Payer {formattedPrice} et s'inscrire
                  </button>
                  )
                )
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                  >
                    Se connecter pour s'inscrire
                  </Link>
                  <p className="text-sm text-gray-600 text-center">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800">
                      Créer un compte
                    </Link>
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Ce cours inclut :</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration} de contenu vidéo
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    {course.lessons.length} leçons
                  </li>
                  <li className="flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    Accès à vie
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Communauté d'apprenants
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modale - Demande de devis / Inscription */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full text-left relative max-h-[85vh] min-h-[520px] flex flex-col">
      
      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto px-6">
        {/* Étape 1 : Résumé du cours */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Inscription et paiement</h2>
            <div className="mb-2 font-semibold">{course.title}</div>
            <div className="mb-2 text-sm text-gray-600">Catégorie : {course.category}</div>
            <div className="mb-2 text-sm text-gray-600">Prix : <span className="font-bold">{formattedPrice}</span></div>
            <div className="mb-4 text-gray-600 text-sm">{course.description.slice(0, 100)}...</div>
            <button onClick={() => setStep(2)} className="bg-iai-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-iai-bordeaux transition-colors w-full">Suivant</button>
          </div>
        )}
        {/* Étape 4 : Confirmation */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Inscription enregistrée !</h2>
            <p className="text-gray-600 mb-6">Votre inscription au cours <strong>{course.title}</strong> a été enregistrée. Procédez au paiement pour finaliser votre inscription.</p>
            <button onClick={() => setShowPaymentModal(false)} className="bg-iai-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-iai-bordeaux transition-colors">Fermer</button>
          </div>
        )}
        {/* Étape 2 : Infos personnelles */}
        {step === 2 && (
          <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
            <h2 className="text-xl font-bold mb-4">Vos informations</h2>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Nom</label>
              <input type="text" required className="w-full px-3 py-2 border rounded" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Email</label>
              <input type="email" required className="w-full px-3 py-2 border rounded" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900">Précédent</button>
              <button type="submit" disabled={!isStep2Valid} className="bg-iai-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-iai-bordeaux transition-colors disabled:opacity-50">Suivant</button>
            </div>
          </form>
        )}
        {/* Étape 3 : Choix paiement */}
        {step === 3 && (
          <form onSubmit={e => { 
            e.preventDefault(); 
            saveQuoteRequest();
            setStep(4);
          }}>
            <h2 className="text-xl font-bold mb-4">Informations supplémentaires</h2>

            {/* Sélection du moyen de paiement */}
            <div className="mb-5">
              <label className="block mb-2 font-medium">Choisissez votre moyen de paiement</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'orange', label: 'Orange Money', img: orangeLogo },
                  { key: 'wave', label: 'Wave', img: waveLogo },
                  { key: 'card', label: 'Carte bancaire', img: visaLogo },
                  { key: 'mixbyyas', label: 'Mixbyyas', img: mixbyyasLogo },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.key}
                    onClick={() => setPaymentMethod(opt.key)}
                    className={`border rounded-lg p-3 flex flex-col items-center justify-center hover:shadow transition ${paymentMethod === opt.key ? 'ring-2 ring-iai-blue border-iai-blue' : ''}`}
                    aria-pressed={paymentMethod === opt.key}
                  >
                    <img src={opt.img} alt={opt.label} className="h-10 w-auto object-contain mb-2" />
                    <span className="text-sm font-medium text-gray-800 text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Quel est votre niveau actuel dans ce domaine ?</label>
              <select 
                className="w-full border rounded-lg px-3 py-2" 
                value={form.level || ''} 
                onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
              >
                <option value="">Sélectionnez votre niveau</option>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Avez-vous des questions spécifiques ?</label>
              <textarea 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Décrivez vos attentes, objectifs ou questions..." 
                rows={3}
                value={form.message || ''} 
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Quand souhaitez-vous commencer ?</label>
              <select 
                className="w-full border rounded-lg px-3 py-2" 
                value={form.startDate || ''} 
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
              >
                <option value="">Sélectionnez une période</option>
                <option value="immediatement">Immédiatement</option>
                <option value="1-2-semaines">Dans 1-2 semaines</option>
                <option value="1-mois">Dans 1 mois</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            {paymentMethod !== 'card' && (
              <div className="mb-3">
                <label className="block mb-1 font-medium">Numéro de téléphone</label>
                <input 
                  type="tel" 
                  required 
                  className="w-full px-3 py-2 border rounded" 
                  value={form.phone} 
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                />
                {shouldShowPaymentInstructions() && (
                  <p className="text-sm text-green-600 mt-1">✓ Numéro valide - Vous serez redirigé vers les instructions de paiement</p>
                )}
                {!isPhoneValid() && form.phone && (
                  <p className="text-sm text-red-600 mt-1">Numéro invalide. Format SN: 70/75/76/77/78 + 7 chiffres.</p>
                )}
              </div>
            )}
            {paymentMethod === 'card' && (
              <>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Numéro de carte</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded" value={form.card} onChange={e => setForm(f => ({ ...f, card: e.target.value }))} />
                </div>
                <div className="mb-3 flex gap-2">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Date d'expiration</label>
                    <input type="text" required placeholder="MM/AA" className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">CVC</label>
                    <input type="text" required placeholder="CVC" className="w-full px-3 py-2 border rounded" />
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between mt-6">
              <button type="button" onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-900">Précédent</button>
              <button type="submit" disabled={!isStep3Valid} className="bg-iai-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-iai-bordeaux transition-colors disabled:opacity-50">
                {shouldShowPaymentInstructions() ? 'Voir les instructions' : 'Suivant'}
              </button>
            </div>
          </form>
        )}
        {/* Étape 4 : Instructions de paiement mobile */}
        {step === 4 && (paymentMethod === 'wave' || paymentMethod === 'orange' || paymentMethod === 'mixbyyas') && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">{getPaymentInstructions()?.title}</h2>
            
            {/* QR Code fixe en haut */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <img 
                  src={getPaymentInstructions()?.qrCode} 
                  alt="QR Code de paiement" 
                  className="mx-auto w-40 h-40 border-2 border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">Scannez ce QR code pour payer</p>
              </div>
            </div>
            
            {/* Instructions scrollables */}
            <div className="space-y-3 mb-4">
              {getPaymentInstructions()?.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-iai-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10">
                <svg className="animate-spin h-10 w-10 text-iai-blue mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span className="text-iai-blue font-medium">Envoi en cours...</span>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Informations importantes :</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Le paiement doit être effectué depuis le numéro : {form.phone}</li>
                <li>• Conservez la confirmation de paiement</li>
                <li>• Votre inscription sera validée après confirmation</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-center">
                <h3 className="font-semibold text-green-900 mb-2">Prêt à finaliser ?</h3>
                <p className="text-sm text-green-800">
                  Une fois votre paiement effectué, cliquez sur le bouton ci-dessous
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Étape 5 : Récapitulatif et paiement */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            <div className="mb-2"><span className="font-medium">Nom :</span> {form.name}</div>
            <div className="mb-2"><span className="font-medium">Email :</span> {form.email}</div>
            <div className="mb-2"><span className="font-medium">Paiement :</span> {
              paymentMethod === 'card' ? 'Carte bancaire' :
              paymentMethod === 'wave' ? 'Wave' :
              paymentMethod === 'orange' ? 'Orange Money' :
              'Mixbyyas'
            }</div>
            {paymentMethod !== 'card' && <div className="mb-2"><span className="font-medium">Téléphone :</span> {form.phone}</div>}
            {paymentMethod === 'card' && <div className="mb-2"><span className="font-medium">Carte :</span> **** **** **** {form.card.slice(-4)}</div>}
            <div className="mb-4"><span className="font-medium">Montant :</span> <span className="font-bold">{formattedPrice}</span></div>
            
            {(paymentMethod === 'wave' || paymentMethod === 'orange' || paymentMethod === 'mixbyyas') && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Paiement mobile confirmé</span>
                </div>
              </div>
            )}
            
            <button onClick={handleFakePayment} className="bg-iai-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-iai-bordeaux transition-colors w-full" disabled={loading}>
              {loading ? 'Finalisation en cours...' : 'Finaliser l\'inscription'}
            </button>
            <button type="button" onClick={() => setStep(paymentMethod === 'card' ? 3 : 4)} className="w-full mt-2 text-gray-500 hover:text-gray-900">
              Précédent
            </button>
          </div>
        )}
      </div>
            
            {/* Boutons fixes en bas pour l'étape 4 */}
            {step === 4 && (paymentMethod === 'wave' || paymentMethod === 'orange' || paymentMethod === 'mixbyyas') && (
              <div className="p-6 pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(3)} 
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Retour
                  </button>
                  <button 
                    onClick={() => setStep(5)} 
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg shadow-lg"
                  >
                    ✅ J'ai payé - Finaliser
                  </button>
                </div>
              </div>
            )}
            
            {/* Fermeture modale */}
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;