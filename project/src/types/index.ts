export interface User {
  id: string;
  email: string;
  name: string;
  enrolledCourses: string[];
  isAdmin?: boolean;
}

export interface ModuleSchedule {
  start: string; // ex: '1 avril'
  end: string;   // ex: '12 avril'
  module: string; // ex: 'Module 1'
  title: string;  // ex: 'Introduction à React'
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  isCompleted?: boolean;
  progress?: number; // 0-100
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'document' | 'exercise';
  content?: string; // URL de la vidéo (legacy) ou contenu texte
  // Nouveau: support de plusieurs providers vidéo
  videoProvider?: 'file' | 'vimeo';
  videoUrl?: string; // URL directe vers le fichier vidéo (mp4) si provider = 'file'
  vimeoId?: string;  // Identifiant Vimeo si provider = 'vimeo'
  // Optionnel: plusieurs segments vidéo par leçon, chacun avec son texte au-dessus
  videoSections?: VideoSection[];
  isCompleted?: boolean;
  isLocked?: boolean; // Pour les leçons qui nécessitent de compléter les précédentes
  resources?: Resource[];
  quiz?: Quiz;
}

export interface VideoSection {
  id: string;
  description?: string; // HTML affiché au-dessus de la vidéo
  videoProvider?: 'file' | 'vimeo';
  videoUrl?: string; // mp4 si provider = 'file'
  vimeoId?: string;  // ID Vimeo si provider = 'vimeo'
  duration?: string; // optionnel, si différent de la durée globale de la leçon
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'video' | 'link';
  url: string;
  size?: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // en minutes
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'text';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  price: number;
  rating: number;
  studentsCount: number;
  imageUrl: string;
  lessons: Lesson[];
  modules: Module[];
  isPremium: boolean;
  modulesSchedule?: ModuleSchedule[];
  totalModules: number;
  totalLessons: number;
  certificate?: boolean;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  currentLesson?: string;
  progress: number; // 0-100
  lastAccessed: string;
  quizScores: Record<string, number>; // lessonId -> score
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  unenrollFromCourse: (courseId: string) => void;
}