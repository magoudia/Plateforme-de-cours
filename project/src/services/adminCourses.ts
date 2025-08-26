import { Course } from '../types';
import { mockCourses } from '../data/mockData';

const STORAGE_KEY = 'customCourses';
const STORAGE_DELETED_KEY = 'deletedCourseIds';

function readStore(): Course[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(courses: Course[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch {}
}

function readDeleted(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeDeleted(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(ids));
  } catch {}
}

function mergeCourses(base: Course[], overrides: Course[]): Course[] {
  const byId: Record<string, Course> = {};
  for (const c of base) byId[c.id] = c;
  for (const o of overrides) byId[o.id] = { ...byId[o.id], ...o } as Course;
  return Object.values(byId);
}

export function getAllCourses(): Course[] {
  const custom = readStore();
  const deleted = new Set(readDeleted());
  // Merge base + overrides, then filter out deleted ids
  return mergeCourses(mockCourses, custom).filter(c => !deleted.has(c.id));
}

// --- Supabase helpers (async) ---

export async function getAllCoursesAsync(): Promise<Course[]> {
  // Pure local: merge base + custom and filter deleted
  return Promise.resolve(getAllCourses());
}

export async function saveCourseAsync(course: Course): Promise<void> {
  // Normalize and save locally only
  const totalModules = Array.isArray(course.modules) ? course.modules.length : (course.totalModules || 0);
  const flatLessons = Array.isArray(course.modules) ? (course.modules || []).flatMap(m => m.lessons || []) : (course.lessons || []);
  const totalLessons = flatLessons.length;
  const normalized: Course = {
    ...course,
    duration: course.duration || '0min',
    studentsCount: typeof course.studentsCount === 'number' ? course.studentsCount : 0,
    rating: typeof course.rating === 'number' ? course.rating : 0,
    price: typeof course.price === 'number' && course.price > 0 ? course.price : 60000,
    imageUrl: course.imageUrl || 'https://placehold.co/400x250?text=Cours',
    totalModules,
    totalLessons,
    lessons: flatLessons,
  };
  saveCourse(normalized);
}

export async function deleteCourseAsync(courseId: string): Promise<void> {
  // Local delete only
  deleteCourse(courseId);
}

export function saveCourse(course: Course): void {
  const custom = readStore();
  const idx = custom.findIndex((c) => c.id === course.id);
  if (idx >= 0) custom[idx] = course; else custom.push(course);
  writeStore(custom);
  // If previously deleted, un-delete
  const deleted = readDeleted();
  const nextDeleted = deleted.filter(id => id !== course.id);
  if (nextDeleted.length !== deleted.length) writeDeleted(nextDeleted);
}

export function deleteCourse(courseId: string): void {
  const custom = readStore();
  const next = custom.filter((c) => c.id !== courseId);
  writeStore(next);
  // Add to tombstones so even base/mock course disappears
  const deleted = new Set(readDeleted());
  deleted.add(courseId);
  writeDeleted(Array.from(deleted));
}

export function newCourseTemplate(partial?: Partial<Course>): Course {
  const id = Date.now().toString();
  return {
    id,
    title: 'Nouveau cours',
    description: '',
    duration: '0min',
    level: 'Débutant',
    category: 'Général',
    price: 60000,
    rating: 0,
    studentsCount: 0,
    imageUrl: 'https://placehold.co/400x250?text=Cours',
    isPremium: false,
    lessons: [],
    modules: [],
    modulesSchedule: [],
    totalModules: 0,
    totalLessons: 0,
    certificate: false,
    ...(partial || {}),
  };
}
