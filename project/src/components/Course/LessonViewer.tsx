import React, { useState, useEffect, useRef } from 'react';

import { PlayCircle, FileText, HelpCircle, Download, ExternalLink, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Lesson, Course, VideoSection } from '../../types';
import { useProgress } from '../../contexts/ProgressContext';
import { useNotification } from '../../contexts/NotificationContext';
import { courseContent } from '../../data/courseContent';
import { extractVimeoId, getVimeoEmbedUrl } from '../../utils/vimeo';

interface LessonViewerProps {
  lesson: Lesson;
  course: Course;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  hasNextLesson?: boolean;
  hasPreviousLesson?: boolean;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  course,
  onNextLesson,
  onPreviousLesson,
  hasNextLesson = false,
  hasPreviousLesson = false
}) => {
  const { markLessonAsCompleted, getLessonProgress } = useProgress();
  const { addNotification } = useNotification();
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    setIsCompleted(getLessonProgress(course.id, lesson.id));
  }, [lesson.id, course.id, getLessonProgress]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'exercise':
        return <HelpCircle className="h-4 w-4 text-red-500" />;
      default:
        return <PlayCircle className="h-4 w-4 text-gray-500" />;
    }
  };

// Render a single video section (for multi-video lessons)
const VideoSectionPlayer: React.FC<{ section: VideoSection; fallbackLesson: Lesson; onVideoEnd: () => void }> = ({ section, fallbackLesson, onVideoEnd }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const extractVimeoId = (input: string): string | null => {
    if (!input) return null;
    const trimmed = input.trim();
    if (/^\d{6,}$/.test(trimmed)) return trimmed;
    const m = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return m && m[1] ? m[1] : null;
  };

  // Determine effective provider/ids with fallback to lesson-level fields for backward compatibility
  const effectiveProvider = section.videoProvider || fallbackLesson.videoProvider || 'vimeo';
  
  // Extraire l'ID Vimeo en priorité depuis la section, puis depuis la leçon
  const vimeoId = section.vimeoId || 
                 extractVimeoId(section.videoUrl || '') || 
                 fallbackLesson.vimeoId || 
                 extractVimeoId(fallbackLesson.videoUrl || '') ||
                 extractVimeoId(fallbackLesson.content || '') || '';
  // Traiter comme Vimeo si l'ID est valide, quelle que soit la valeur de effectiveProvider
  const treatAsVimeo = !!vimeoId;
  const fileSrc = !treatAsVimeo ? (section.videoUrl || fallbackLesson.videoUrl || fallbackLesson.content) : undefined;
  const vimeoSrc = treatAsVimeo && vimeoId ? 
    getVimeoEmbedUrl(vimeoId, {
      autoplay: false,
      title: false,
      byline: false,
      portrait: false,
      muted: false
    }) : undefined;

  // État pour gérer les erreurs de chargement
  const [vimeoError, setVimeoError] = useState(false);

  useEffect(() => {
    let player: any = null;
    let cleanup: (() => void) | null = null;
    
    if (treatAsVimeo && iframeRef.current) {
      setVimeoError(false); // Réinitialiser l'état d'erreur
      
      // Ajouter un écouteur d'erreur sur l'iframe
      const handleIframeError = () => setVimeoError(true);
      iframeRef.current.addEventListener('error', handleIframeError);
      const ensureScript = () => new Promise<void>((resolve) => {
        if ((window as any).Vimeo && (window as any).Vimeo.Player) return resolve();
        const existing = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]') as HTMLScriptElement | null;
        if (existing) { existing.addEventListener('load', () => resolve()); return; }
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
      ensureScript().then(() => {
        const Vimeo = (window as any).Vimeo;
        player = new Vimeo.Player(iframeRef.current);
        player.on('ended', onVideoEnd);
        cleanup = () => { try { player && player.unload && player.unload(); } catch {} };
      });
    }
    return () => { 
      if (cleanup) cleanup(); 
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('error', handleIframeError);
      }
    };
  }, [treatAsVimeo, vimeoId, onVideoEnd]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      {treatAsVimeo ? (
        vimeoSrc ? (
          <iframe
            ref={iframeRef}
            src={vimeoSrc}
            frameBorder={0}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title="Vimeo Player Section"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <PlayCircle className="h-16 w-16" />
            <span className="ml-4">Vimeo non configuré</span>
          </div>
        )
      ) : (
        fileSrc ? (
          <video ref={videoRef} controls className="w-full h-full" onEnded={onVideoEnd}>
            <source src={fileSrc} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <PlayCircle className="h-16 w-16" />
            <span className="ml-4">Vidéo non disponible</span>
          </div>
        )
      )}
    </div>
  );
};

  const handleMarkAsCompleted = () => {
    if (!isCompleted) {
      markLessonAsCompleted(course.id, lesson.id);
      setIsCompleted(true);
      addNotification({
        type: 'success',
        title: 'Leçon complétée',
        message: `Vous avez terminé : ${lesson.title}`
      });
    }
  };

  const handleQuizSubmit = () => {
    if (!lesson.quiz) return;

    let correctAnswers = 0;
    lesson.quiz.questions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / lesson.quiz.questions.length) * 100);
    setQuizScore(score);
    setShowQuizResults(true);

    if (score >= lesson.quiz.passingScore) {
      handleMarkAsCompleted();
    }
  };

  // Track completed sections for multi-video lessons
  const completedSectionsRef = useRef<Set<string>>(new Set());
  const handleSectionEnded = (sectionId: string, total: number) => {
    const set = completedSectionsRef.current;
    if (!set.has(sectionId)) set.add(sectionId);
    if (set.size >= total && !isCompleted) {
      handleMarkAsCompleted();
    }
  };

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        // If multiple video sections are provided, render each with its own text and player
        if (lesson.videoSections && lesson.videoSections.length > 0) {
          return (
            <div className="space-y-8">
              {lesson.videoSections.slice(0, 3).map((section, idx) => {
                const total = Math.min(lesson.videoSections?.length || 0, 3);
                const effId = section.id || `sec-${idx}`;
                return (
                <div key={effId} className="space-y-4">
                  {section.description && (
                    <div className="prose max-w-none">
                      <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.description }}
                      />
                    </div>
                  )}
                  <VideoSectionPlayer section={section} fallbackLesson={lesson} onVideoEnd={() => handleSectionEnded(effId, total)} />
                </div>
                );
              })}
            </div>
          );
        }
        // Fallback: single video + one description above
        return (
          <div className="space-y-4">
            {lesson.description && (
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: lesson.description }}
                />
              </div>
            )}
            <VideoContent lesson={lesson} onVideoEnd={handleMarkAsCompleted} />
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.content || (courseContent as any)[lesson.id]?.content || 'Contenu non disponible' }}
            />
          </div>
        );

      case 'quiz':
        if (!lesson.quiz) return <div>Quiz non disponible</div>;

        return (
          <div className="space-y-6">
            {!showQuizResults ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Instructions du quiz</h4>
                  <p className="text-blue-700 text-sm">
                    Répondez à toutes les questions. Vous devez obtenir au moins {lesson.quiz.passingScore}% pour réussir.
                  </p>
                </div>

                <div className="space-y-6">
                  {lesson.quiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-white border rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Question {index + 1}: {question.text}
                      </h4>

                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={quizAnswers[question.id] === option}
                                onChange={(e) => setQuizAnswers({
                                  ...quizAnswers,
                                  [question.id]: e.target.value
                                })}
                                className="h-4 w-4 text-blue-600"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <div className="space-y-3">
                          {['Vrai', 'Faux'].map((option) => (
                            <label key={option} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={quizAnswers[question.id] === option}
                                onChange={(e) => setQuizAnswers({
                                  ...quizAnswers,
                                  [question.id]: e.target.value
                                })}
                                className="h-4 w-4 text-blue-600"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'text' && (
                        <textarea
                          value={quizAnswers[question.id] || ''}
                          onChange={(e) => setQuizAnswers({
                            ...quizAnswers,
                            [question.id]: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Votre réponse..."
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleQuizSubmit}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Soumettre le quiz
                </button>
              </>
            ) : (
              <div className="bg-white border rounded-lg p-6">
                <div className="text-center">
                  <div className={`text-6xl mb-4 ${quizScore! >= lesson.quiz.passingScore ? 'text-green-500' : 'text-red-500'}`}>{quizScore}%</div>
                  <h3 className={`text-xl font-medium mb-2 ${quizScore! >= lesson.quiz.passingScore ? 'text-green-600' : 'text-red-600'}`}>{quizScore! >= lesson.quiz.passingScore ? 'Quiz réussi !' : 'Quiz échoué'}</h3>
                  <p className="text-gray-600 mb-4">Score minimum requis : {lesson.quiz.passingScore}%</p>
                  {quizScore! >= lesson.quiz.passingScore && (
                    <div className="flex items-center justify-center text-green-600 mb-4">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      <span>Leçon marquée comme complétée</span>
                    </div>
                  )}
                </div>
                {/* Corrections détaillées */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Corrections du quiz</h4>
                  <div className="space-y-6">
                    {lesson.quiz.questions.map((question, idx) => {
                      const userAnswer = quizAnswers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;
                      return (
                        <div key={question.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}> 
                          <div className="flex items-center mb-2">
                            <span className={`inline-block w-6 h-6 mr-2 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>{isCorrect ? '✔' : '✗'}</span>
                            <span className="font-medium text-gray-900">Question {idx + 1} : {question.text}</span>
                          </div>
                          <div className="ml-8">
                            <div className="mb-1">
                              <span className="font-semibold">Votre réponse :</span> <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>{userAnswer || <em>Non répondu</em>}</span>
                            </div>
                            {!isCorrect && (
                              <div className="mb-1">
                                <span className="font-semibold">Bonne réponse :</span> <span className="text-green-700">{question.correctAnswer}</span>
                              </div>
                            )}
                            {question.explanation && (
                              <div className="text-gray-700 mt-1"><span className="font-semibold">Explication :</span> {question.explanation}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Bouton pour recommencer le quiz si échec */}
                {quizScore! < lesson.quiz.passingScore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setShowQuizResults(false);
                        setQuizScore(null);
                      }}
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Recommencer le quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Type de contenu non supporté</p>
          </div>
        );
    }
  };

  const renderResources = () => {
    if (!lesson.resources || lesson.resources.length === 0) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Ressources</h4>
        <div className="space-y-2">
          {lesson.resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Download className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{resource.title}</div>
                {resource.size && (
                  <div className="text-sm text-gray-500">{resource.size}</div>
                )}
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Lesson Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getLessonIcon(lesson.type)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{lesson.title}</h2>
              <p className="text-sm text-gray-600">{lesson.duration}</p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Terminé</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPreviousLesson}
            disabled={!hasPreviousLesson}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              hasPreviousLesson
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Précédent</span>
          </button>

          <button
            onClick={onNextLesson}
            disabled={!hasNextLesson}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              hasNextLesson
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Suivant</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="p-6">
        {renderContent()}
        {renderResources()}

        {/* Complete Button */}
        {lesson.type !== 'quiz' && !isCompleted && (
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleMarkAsCompleted}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Marquer comme terminé
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoContent: React.FC<{ lesson: Lesson; onVideoEnd: () => void }> = ({ lesson, onVideoEnd }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { addNotification } = useNotification();
  const [, setVimeoError] = useState(false);

  useEffect(() => {
    // If Vimeo provider, load API and attach listeners
    const inferredVimeoId = lesson.vimeoId || extractVimeoId(lesson.videoUrl || lesson.content || '') || '';
    const isVimeo = (lesson.videoProvider === 'vimeo' && !!inferredVimeoId) || (!lesson.videoProvider && !!inferredVimeoId);
    
    setVimeoError(false); // Réinitialiser l'état d'erreur interne
    let player: any = null;
    let cleanup: (() => void) | null = null;

    const handleIframeError = () => {
      setVimeoError(true);
      addNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger la vidéo Vimeo. Veuillez réessayer plus tard.'
      });
    };

    if (isVimeo && iframeRef.current) {
      if (iframeRef.current) {
        iframeRef.current.addEventListener('error', handleIframeError);
      }
      
      const ensureScript = () => new Promise<void>((resolve) => {
        if ((window as any).Vimeo && (window as any).Vimeo.Player) return resolve();
        const existing = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]') as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener('load', () => resolve());
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

      ensureScript().then(() => {
        const Vimeo = (window as any).Vimeo;
        player = new Vimeo.Player(iframeRef.current);
        player.on('ended', onVideoEnd);
        cleanup = () => {
          try { player && player.unload && player.unload(); } catch {}
        };
      });
    }

    // Créer une copie de la référence pour la fonction de nettoyage
    const currentIframe = iframeRef.current;
    
    return () => {
      if (cleanup) cleanup();
      if (currentIframe) {
        currentIframe.removeEventListener('error', handleIframeError);
      }
    };
  }, [lesson.videoProvider, lesson.vimeoId, lesson.videoUrl, lesson.content, onVideoEnd]);

  const inferredVimeoId = lesson.vimeoId || extractVimeoId(lesson.videoUrl || lesson.content || '') || '';
  const treatAsVimeo = (lesson.videoProvider === 'vimeo' && !!inferredVimeoId) || (!lesson.videoProvider && !!inferredVimeoId);
  const fileSrc = !treatAsVimeo ? (lesson.videoUrl || lesson.content) : undefined;
  const vimeoSrc = treatAsVimeo && inferredVimeoId 
    ? getVimeoEmbedUrl(inferredVimeoId, {
        autoplay: false,
        title: false,
        byline: false,
        portrait: false,
        muted: false
      })
    : undefined;

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      {treatAsVimeo ? (
        vimeoSrc ? (
          <iframe
            ref={iframeRef}
            src={vimeoSrc}
            frameBorder={0}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title="Vimeo Player"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <PlayCircle className="h-16 w-16" />
            <span className="ml-4">Vimeo non configuré</span>
          </div>
        )
      ) : (
        fileSrc ? (
          <video ref={videoRef} controls className="w-full h-full" onEnded={onVideoEnd}>
            <source src={fileSrc} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <PlayCircle className="h-16 w-16" />
            <span className="ml-4">Vidéo non disponible</span>
          </div>
        )
      )}
    </div>
  );
};

export default LessonViewer;