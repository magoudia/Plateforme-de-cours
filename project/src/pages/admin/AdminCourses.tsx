import React, { useEffect, useMemo, useState } from 'react';
import { Course, CourseSettings, MediaFile } from '../../types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getAllCoursesAsync, newCourseTemplate, saveCourseAsync, deleteCourseAsync } from '../../services/adminCourses';
import { useNotification } from '../../contexts/NotificationContext';

const defaultSettings: CourseSettings = {
  passingScore: 70,
  quizRequired: true,
  finalProjectRequired: true,
  accentColor: '#4f46e5',
  status: 'draft',
  accessLevel: 'all'
};

const AdminCourses: React.FC = () => {
  const { addNotification } = useNotification();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  
  const selectedBase = useMemo(() => 
    courses.find(c => c.id === selectedId) || null, 
    [courses, selectedId]
  );

  const reload = async () => {
    const list = await getAllCoursesAsync();
    setCourses(list);
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    if (selectedBase) setDraft({ ...selectedBase });
    else setDraft(null);
  }, [selectedBase]);

  const extractVimeoId = (input: string): string | null => {
    if (!input) return null;
    const trimmed = input.trim();
    if (/^\d{6,}$/.test(trimmed)) return trimmed;
    const m = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return m && m[1] ? m[1] : null;
  };

  const onAdd = () => {
    const c = newCourseTemplate();
    const now = new Date().toISOString();
    const newCourse: Course = {
      ...c,
      settings: { ...defaultSettings },
      recommendedResources: [],
      modulesSchedule: [],
      createdAt: now,
      updatedAt: now,
      certificate: true,
      detailedDescription: ''
    };
    setDraft(newCourse);
    setSelectedId(newCourse.id);
  };

  const onSave = async () => {
    if (!draft) return;
    const valid = (draft.title || '').trim().length > 0 && (draft.category || '').trim().length > 0;
    if (!valid) {
      addNotification({
        type: 'error',
        title: 'Validation requise',
        message: 'Le titre et la catégorie sont obligatoires pour enregistrer le cours.'
      } as any);
      return;
    }
    try {
      setSaving(true);
      const totalModules = draft.modules?.length || 0;
      const flatLessons = (draft.modules || []).flatMap(m => m.lessons || []);
      const totalLessons = flatLessons.length;
      await saveCourseAsync({ ...draft, lessons: flatLessons, totalModules, totalLessons });
      await reload();
      addNotification({
        type: 'success',
        title: 'Cours enregistré',
        message: `« ${draft.title || 'Sans titre'} » a été enregistré avec succès.`
      } as any);
    } catch (e) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'enregistrer le cours. Réessayez.'
      } as any);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!selectedId) return;
    const ok = window.confirm('Supprimer ce cours ? Cette action est irréversible.');
    if (!ok) return;
    await deleteCourseAsync(selectedId);
    setSelectedId(null);
    setDraft(null);
    await reload();
    addNotification({
      type: 'info',
      title: 'Cours supprimé',
      message: 'Le cours a été supprimé.'
    } as any);
  };

  const handleAddMediaFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'document') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (type === 'video' && !file.type.startsWith('video/')) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez sélectionner un fichier vidéo valide.'
      });
      return;
    }
    if (type === 'document' && !file.type.endsWith('pdf')) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez sélectionner un fichier PDF valide.'
      });
      return;
    }
    const newFile: MediaFile = {
      id: uuidv4(),
      type,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      mimeType: file.type
    };
    setDraft({ ...draft, mediaFiles: [...draft.mediaFiles, newFile] });
  };

  const onSave = async () => {
    if (!draft) return;
    
    setSaving(true);
    try {
      const savedCourse = await saveCourseAsync(draft);
      addNotification({
        type: 'success',
        title: 'Succès',
        message: 'Cours enregistré avec succès',
      });
      
      if (draft.id) {
        setCourses(courses.map(c => c.id === draft.id ? savedCourse : c));
      } else {
        setCourses([...courses, savedCourse]);
        setSelectedId(savedCourse.id);
      }
      setDraft(null);
    } catch (error) {
      console.error('Error saving course:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'enregistrement du cours',
      });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!draft?.id) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
      try {
        await deleteCourseAsync(draft.id);
        setCourses(courses.filter(c => c.id !== draft.id));
        setDraft(null);
        setSelectedId(null);
        addNotification({
          type: 'success',
          title: 'Succès',
          message: 'Cours supprimé avec succès',
        });
      } catch (error) {
        console.error('Error deleting course:', error);
        addNotification({
          type: 'error',
          title: 'Erreur',
          message: 'Une erreur est survenue lors de la suppression du cours',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des cours</h1>
          <button
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nouveau cours
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {draft ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {draft.id ? 'Modifier le cours' : 'Nouveau cours'}
              </h3>
            </div>
            <div className="border-t border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre du cours</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={draft.title || ''}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={draft.description || ''}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setDraft(null)}
                    disabled={saving}
                  >
                    Annuler
                  </button>
                  {draft.id && (
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={onDelete}
                      disabled={saving}
                    >
                      Supprimer
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onSave}
                    disabled={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Liste des cours</h3>
            </div>
            <div className="border-t border-gray-200">
              {courses.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Aucun cours disponible. Cliquez sur "Nouveau cours" pour en créer un.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <li key={course.id}>
                      <button
                        className="w-full text-left p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={() => setDraft({ ...course })}
                      >
                        <h4 className="text-lg font-medium text-gray-900">{course.title}</h4>
                        <p className="mt-1 text-sm text-gray-500">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{c.title || 'Sans titre'}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100">{c.level}</span>
                            {c.settings?.status === 'published' && (
                              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">Publié</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {c.category} • {c.totalModules} modules • {c.totalLessons} leçons
                          {c.settings?.publishDate && (
                            <span> • Publié le {new Date(c.settings.publishDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </button>
                    ))}
                    {courses.length === 0 && (
                      <div className="text-sm text-gray-500">Aucun cours pour le moment.</div>
                    )}
                  </aside>

                  <section className="md:col-span-2">
                    {!draft && (
                      <div className="text-sm text-gray-500">Sélectionnez un cours à gauche ou créez-en un nouveau.</div>
                    )}
                    {draft && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Titre</label>
                            <input
                              className="mt-1 w-full rounded border-gray-300"
                              value={draft.title}
                              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                            />
                            {(!draft.title || !draft.title.trim()) && (
                              <p className="mt-1 text-xs text-red-600">Le titre est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                            <input
                              className="mt-1 w-full rounded border-gray-300"
                              value={draft.category}
                              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                            />
                            {(!draft.category || !draft.category.trim()) && (
                              <p className="mt-1 text-xs text-red-600">La catégorie est requise</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Prix (CFA)</label>
                            <input
                              type="number"
                              className="mt-1 w-full rounded border-gray-300"
                              min={0}
                              step={100}
                              value={typeof draft.price === 'number' ? draft.price : 0}
                              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value || 0) })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image (URL)</label>
                            <div className="mt-1 flex gap-2">
                              <input
                                className="w-full rounded border-gray-300"
                                placeholder="https://..."
                                value={draft.imageUrl || ''}
                                onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                              />
                              <button
                                type="button"
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCourses;
