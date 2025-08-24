import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PlayCircle, FileText, HelpCircle, Lock, CheckCircle, Clock } from 'lucide-react';
import { Module, Lesson, Course } from '../../types';
import { useProgress } from '../../contexts/ProgressContext';
import { useNotification } from '../../contexts/NotificationContext';

interface CourseModulesProps {
  course: Course;
  onLessonSelect: (lesson: Lesson) => void;
  currentLessonId?: string;
}

const CourseModules: React.FC<CourseModulesProps> = ({ course, onLessonSelect, currentLessonId }) => {
  const { getLessonProgress, isLessonLocked, calculateModuleProgress, isModuleLocked, getCourseProgress, isQuizLocked } = useProgress();
  const { addNotification } = useNotification();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

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

  const getLessonStatus = (lesson: Lesson) => {
    const isCompleted = getLessonProgress(course.id, lesson.id);
    const isLocked = isLessonLocked(course.id, lesson.id, course.lessons);
    const isCurrent = currentLessonId === lesson.id;

    if (isCompleted) {
      return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, className: 'text-green-600' };
    } else if (isLocked) {
      return { icon: <Lock className="h-4 w-4 text-gray-400" />, className: 'text-gray-400' };
    } else if (isCurrent) {
      return { icon: <PlayCircle className="h-4 w-4 text-blue-500" />, className: 'text-blue-600 font-medium' };
    } else {
      return { icon: <Clock className="h-4 w-4 text-gray-400" />, className: 'text-gray-600' };
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    const lockedBySequence = isLessonLocked(course.id, lesson.id, course.lessons);
    const lockedByQuizRule = lesson.type === 'quiz' && isQuizLocked(course.id, lesson.id, course.lessons);
    const isLocked = lockedBySequence || lockedByQuizRule;
    if (isLocked) {
      addNotification({
        type: 'error',
        title: lockedByQuizRule ? 'Quiz verrouillé' : 'Leçon verrouillée',
        message: lockedByQuizRule
          ? 'Vous devez d\'abord réussir le premier quiz pour débloquer les autres.'
          : 'Cette leçon sera débloquée après avoir terminé la précédente.'
      });
      return;
    }
    onLessonSelect(lesson);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Contenu du cours</h3>
        <p className="text-sm text-gray-600 mt-1">
          {course.totalModules} modules • {course.totalLessons} leçons
        </p>
        {(() => {
          const progress = getCourseProgress(course.id);
          const completedUnique = progress?.completedLessons
            ? Array.from(new Set(progress.completedLessons)).filter(id =>
                course.lessons.some(l => l.id === id)
              ).length
            : 0;
          const total = course.lessons.length;
          const percent = total > 0 ? Math.max(0, Math.min(100, Math.round((completedUnique / total) * 100))) : 0;
          return (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>{completedUnique}/{total} leçons</span>
                <span>{percent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })()}
      </div>

      <div className="divide-y divide-gray-200">
        {course.modules.map((module) => {
          const moduleProgress = calculateModuleProgress(course.id, module.id, course.lessons);
          const isExpanded = expandedModules.has(module.id);
          const lockedModule = isModuleLocked(course.id, module.id, course.modules);
          const completedLessons = module.lessons.filter(lesson => 
            getLessonProgress(course.id, lesson.id)
          ).length;

          return (
            <div key={module.id} className="bg-white">
              {/* Module Header */}
              <button
                onClick={() => { if (!lockedModule) toggleModule(module.id); }}
                disabled={lockedModule}
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${lockedModule ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-3">
                  {lockedModule ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">{module.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">
                    {completedLessons}/{module.lessons.length} leçons
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{moduleProgress}%</span>
                  </div>
                </div>
              </button>

              {/* Module Lessons */}
              {isExpanded && (
                <div className="px-6 pb-4">
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => {
                      const status = getLessonStatus(lesson);
                      const isLocked = isLessonLocked(course.id, lesson.id, course.lessons) || (lesson.type === 'quiz' && isQuizLocked(course.id, lesson.id, course.lessons));

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          disabled={isLocked}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                            isLocked
                              ? 'cursor-not-allowed opacity-50'
                              : 'hover:bg-gray-50 cursor-pointer'
                          } ${status.className}`}
                        >
                          {status.icon}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{lesson.title}</span>
                              {lesson.type === 'quiz' && (
                                <span className={`px-2 py-1 text-xs rounded ${isLocked ? 'bg-gray-200 text-gray-600' : 'bg-purple-100 text-purple-700'}`}>
                                  {isLocked ? 'Quiz verrouillé' : 'Quiz'}
                                </span>
                              )}
                            </div>
                            {lesson.description && (
                              <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-1">
                              {getLessonIcon(lesson.type)}
                              <span className="text-xs text-gray-500">{lesson.duration}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseModules; 