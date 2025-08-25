import React, { useEffect, useMemo, useState } from 'react';
import { Course } from '../../types';
import { getAllCourses, getAllCoursesAsync, newCourseTemplate, saveCourse, saveCourseAsync, deleteCourse, deleteCourseAsync } from '../../services/adminCourses';
import { useNotification } from '../../contexts/NotificationContext';

const levels: Course['level'][] = ['Débutant', 'Intermédiaire', 'Avancé'];

const AdminCourses: React.FC = () => {
  const { addNotification } = useNotification();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'meta' | 'modules'>('meta');
  const [saving, setSaving] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const selectedBase = useMemo(() => courses.find(c => c.id === selectedId) || null, [courses, selectedId]);

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

  // Resize an image file on client side and return a data URL (base64)
  const resizeImageFile = (file: File, opts?: { maxW?: number; maxH?: number; qualityJpeg?: number }): Promise<string> => {
    const { maxW = 1200, maxH = 750, qualityJpeg = 0.85 } = opts || {};
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          const ratio = Math.min(maxW / width, maxH / height, 1);
          const targetW = Math.round(width * ratio);
          const targetH = Math.round(height * ratio);
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('Canvas non supporté')); return; }
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
          const mime = isJpeg ? 'image/jpeg' : (file.type || 'image/png');
          try {
            const dataUrl = canvas.toDataURL(mime, isJpeg ? qualityJpeg : undefined);
            resolve(dataUrl);
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsDataURL(file);
    });
  };

  // Helper: extraire l'ID Vimeo depuis une URL ou un ID (ex: https://vimeo.com/123456789)
  const extractVimeoId = (input: string): string | null => {
    if (!input) return null;
    const trimmed = input.trim();
    // Déjà un numérique d'au moins 6 chiffres
    if (/^\d{6,}$/.test(trimmed)) return trimmed;
    const m = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return m && m[1] ? m[1] : null;
  };

  const onAdd = () => {
    const c = newCourseTemplate();
    setDraft(c);
    setSelectedId(c.id);
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
      // keep totals in sync with modules/lessons counts (basic for now)
      const totalModules = draft.modules?.length || 0;
      const flatLessons = (draft.modules || []).flatMap(m => m.lessons || []);
      const totalLessons = flatLessons.length;
      // Important: also persist the flat lessons array for components relying on course.lessons
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gestion des cours</h2>
          <p className="text-sm text-gray-500">Créer, modifier ou supprimer des cours (métadonnées, modules, leçons, quiz).</p>
        </div>
        <button onClick={onAdd} className="px-3 py-2 rounded text-white text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-95 transition duration-200">+ Nouveau cours</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 space-y-2 max-h-[60vh] overflow-auto">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left p-3 rounded border ${selectedId === c.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.title || 'Sans titre'}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100">{c.level}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{c.category} • {c.totalModules} modules • {c.totalLessons} leçons</div>
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
                      className="px-2 py-2 rounded border text-sm hover:bg-gray-50"
                      title="Réinitialiser l'image par défaut"
                      onClick={() => setDraft({ ...draft, imageUrl: 'https://placehold.co/400x250?text=Cours' })}
                    >Par défaut</button>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs text-gray-600 mb-1">Ou téléverser une image (jpg, png, &lt;= 1Mo)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          addNotification({ type: 'error', title: 'Fichier invalide', message: 'Veuillez sélectionner une image.' } as any);
                          return;
                        }
                        // Autoriser un fichier brut jusqu'à 8 Mo, puis compresser/redimensionner côté client
                        const maxRaw = 8 * 1024 * 1024;
                        if (file.size > maxRaw) {
                          addNotification({ type: 'error', title: 'Fichier trop volumineux', message: 'Veuillez choisir une image de 8Mo maximum.' } as any);
                          return;
                        }
                        resizeImageFile(file, { maxW: 1200, maxH: 750, qualityJpeg: 0.85 })
                          .then((dataUrl) => {
                            // Vérifier la taille du dataURL (~ approximation)
                            const approxBytes = Math.ceil((dataUrl.length - 'data:image/jpeg;base64,'.length) * 3 / 4);
                            const limit = 1 * 1024 * 1024; // 1MB
                            if (approxBytes > limit) {
                              addNotification({ type: 'error', title: 'Image trop lourde', message: 'Après compression, l\'image dépasse 1Mo. Essayez une image plus petite.' } as any);
                              return;
                            }
                            setDraft({ ...draft, imageUrl: dataUrl });
                          })
                          .catch(() => {
                            addNotification({ type: 'error', title: 'Erreur', message: 'Impossible de traiter l\'image.' } as any);
                          });
                      }}
                    />
                  </div>
                  {draft.imageUrl && (
                    <img
                      src={draft.imageUrl}
                      alt="Aperçu du cours"
                      className="mt-2 h-24 w-full object-cover rounded border"
                      onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x250?text=Cours'; }}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Niveau</label>
                  <select
                    className="mt-1 w-full rounded border-gray-300"
                    value={draft.level}
                    onChange={(e) => setDraft({ ...draft, level: e.target.value as Course['level'] })}
                  >
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Premium</label>
                  <select
                    className="mt-1 w-full rounded border-gray-300"
                    value={draft.isPremium ? '1' : '0'}
                    onChange={(e) => setDraft({ ...draft, isPremium: e.target.value === '1' })}
                  >
                    <option value="0">Non</option>
                    <option value="1">Oui</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 w-full rounded border-gray-300"
                  rows={4}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-4">
                  {[
                    { key: 'meta', label: 'Métadonnées' },
                    { key: 'modules', label: 'Modules / Leçons / Quiz' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      className={`px-3 py-2 text-sm border-b-2 ${activeTab === (t.key as any) ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab(t.key as any)}
                      type="button"
                    >
                      {t.label}
                    </button>
                  ))}
                </nav>
              </div>

              {activeTab === 'modules' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Modules list */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Modules</h4>
                      <button
                        className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95 transition"
                        onClick={() => {
                          const newMod = { id: Date.now().toString(), title: 'Nouveau module', description: '', order: (draft.modules?.length || 0) + 1, lessons: [] };
                          setDraft({ ...draft, modules: [...(draft.modules || []), newMod] });
                          setSelectedModuleId(newMod.id);
                          setSelectedLessonId(null);
                        }}
                      >+ Ajouter</button>
                    </div>
                    <div className="space-y-2 max-h-[40vh] overflow-auto">
                      {(draft.modules || []).sort((a,b)=>a.order-b.order).map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedModuleId(m.id); setSelectedLessonId(null); }}
                          className={`w-full text-left p-3 rounded border ${selectedModuleId===m.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{m.title}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">#{m.order}</span>
                          </div>
                          <div className="text-xs text-gray-500 truncate">{m.description || '—'}</div>
                        </button>
                      ))}
                      {(draft.modules || []).length === 0 && (
                        <div className="text-sm text-gray-500">Aucun module.</div>
                      )}
                    </div>
                  </div>

                  {/* Module editor + lessons list */}
                  <div className="lg:col-span-2 space-y-4">
                    {!selectedModuleId && (
                      <div className="text-sm text-gray-500">Sélectionnez un module pour l'éditer.</div>
                    )}
                    {selectedModuleId && (
                      (() => {
                        const modIndex = (draft.modules || []).findIndex(m => m.id === selectedModuleId);
                        if (modIndex === -1) return <div className="text-sm text-gray-500">Module introuvable.</div>;
                        const m = (draft.modules || [])[modIndex];
                        const updateModule = (next: Partial<typeof m>) => {
                          const nextModules = [...(draft.modules || [])];
                          nextModules[modIndex] = { ...m, ...next };
                          setDraft({ ...draft, modules: nextModules });
                        };
                        const removeModule = () => {
                          const ok = window.confirm('Supprimer ce module et ses leçons ?');
                          if (!ok) return;
                          const nextModules = (draft.modules || []).filter(x => x.id !== m.id);
                          setDraft({ ...draft, modules: nextModules });
                          setSelectedModuleId(null);
                          setSelectedLessonId(null);
                        };
                        const lessons = m.lessons || [];
                        const lessonIndex = lessons.findIndex(l => l.id === selectedLessonId);
                        const lesson = lessonIndex >= 0 ? lessons[lessonIndex] : null;
                        const updateLesson = (next: any) => {
                          const nextLessons = [...lessons];
                          nextLessons[lessonIndex] = { ...lessons[lessonIndex], ...next } as any;
                          updateModule({ lessons: nextLessons });
                        };
                        const addLesson = () => {
                          const nl = { id: Date.now().toString(), title: 'Nouvelle leçon', description: '', duration: '5min', type: 'text' as const };
                          updateModule({ lessons: [...lessons, nl] });
                          setSelectedLessonId(nl.id);
                        };
                        const removeLesson = () => {
                          if (!lesson) return;
                          const ok = window.confirm('Supprimer cette leçon ?');
                          if (!ok) return;
                          const nextLessons = lessons.filter(l => l.id !== lesson.id);
                          updateModule({ lessons: nextLessons });
                          setSelectedLessonId(null);
                        };
                        return (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Titre du module</label>
                                <input className="mt-1 w-full rounded border-gray-300" value={m.title} onChange={(e)=>updateModule({ title: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">Ordre</label>
                                <input type="number" className="mt-1 w-full rounded border-gray-300" value={m.order} onChange={(e)=>updateModule({ order: Number(e.target.value) })} />
                              </div>
                              <div className="flex items-end justify-end gap-2">
                                <button onClick={removeModule} className="px-3 py-2 rounded border text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 transition">Supprimer module</button>
                              </div>
                              <div className="md:col-span-4">
                                <label className="block text-sm font-medium">Description</label>
                                <textarea className="mt-1 w-full rounded border-gray-300" rows={3} value={m.description} onChange={(e)=>updateModule({ description: e.target.value })} />
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <h5 className="font-medium">Leçons</h5>
                              <button onClick={addLesson} className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95 transition">+ Ajouter une leçon</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-2 max-h-[32vh] overflow-auto md:col-span-1">
                                {lessons.map(l => (
                                  <button key={l.id} onClick={()=>setSelectedLessonId(l.id)} className={`w-full text-left p-3 rounded border ${selectedLessonId===l.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium truncate">{l.title}</span>
                                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{l.type}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">{l.duration}</div>
                                  </button>
                                ))}
                                {lessons.length === 0 && <div className="text-sm text-gray-500">Aucune leçon.</div>}
                              </div>
                              <div className="md:col-span-2">
                                {!lesson && <div className="text-sm text-gray-500">Sélectionnez une leçon pour l'éditer.</div>}
                                {lesson && (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <div className="md:col-span-2">
                                        <label className="block text-sm font-medium">Titre de la leçon</label>
                                        <input className="mt-1 w-full rounded border-gray-300" value={lesson.title} onChange={(e)=>updateLesson({ title: e.target.value })} />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium">Durée</label>
                                        <input className="mt-1 w-full rounded border-gray-300" value={lesson.duration} onChange={(e)=>updateLesson({ duration: e.target.value })} />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium">Type</label>
                                        <select
                                          className="mt-1 w-full rounded border-gray-300"
                                          value={lesson.type}
                                          onChange={(e)=>{
                                            const val = e.target.value as 'text' | 'video' | 'document' | 'exercise' | 'quiz';
                                            updateLesson({ type: val });
                                          }}
                                        >
                                          <option value="text">text</option>
                                          <option value="video">video</option>
                                          <option value="document">document</option>
                                          <option value="exercise">exercise</option>
                                          <option value="quiz">quiz</option>
                                        </select>
                                      </div>
                                      <div className="flex items-end justify-end">
                                        <button onClick={removeLesson} className="px-3 py-2 rounded border text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 transition">Supprimer leçon</button>
                                      </div>
                                    </div>
                                    {lesson.type !== 'quiz' && (
                                      <>
                                        <label className="block text-sm font-medium">Description {lesson.type !== 'video' ? '/ Contenu' : ''}</label>
                                        <textarea
                                          className="mt-1 w-full rounded border-gray-300"
                                          rows={4}
                                          value={lesson.description || ''}
                                          onChange={(e)=>updateLesson({ description: e.target.value })}
                                        />
                                      </>
                                    )}
                                    {lesson.type === 'video' && (
                                      <div className="space-y-4">
                                        {/* Toggle multi-video mode */}
                                        <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium">Activer plusieurs vidéos (1 à 3)</label>
                                          <button
                                            type="button"
                                            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                                            onClick={() => {
                                              const hasSections = !!(lesson.videoSections && lesson.videoSections.length);
                                              if (hasSections) {
                                                updateLesson({ videoSections: [] });
                                              } else {
                                                const base = { id: Date.now().toString(), description: '', videoProvider: lesson.videoProvider || 'file', videoUrl: lesson.videoUrl || lesson.content || '', vimeoId: lesson.vimeoId || '' };
                                                updateLesson({ videoSections: [base] });
                                              }
                                            }}
                                          >{(lesson.videoSections && lesson.videoSections.length > 0) ? 'Désactiver' : 'Activer'}</button>
                                        </div>

                                        {/* Multi sections editor */}
                                        {lesson.videoSections && lesson.videoSections.length > 0 ? (
                                          <div className="space-y-4">
                                            {(lesson.videoSections || []).slice(0,3).map((sec, si) => (
                                              <div key={sec.id} className="p-3 border rounded space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="text-sm font-medium">Section vidéo #{si+1}</div>
                                                  <div className="flex items-center gap-2">
                                                    {lesson.videoSections!.length < 3 && si === lesson.videoSections!.length - 1 && (
                                                      <button
                                                        type="button"
                                                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                                                        onClick={() => {
                                                          const next = [...(lesson.videoSections || [])];
                                                          next.push({ id: (Date.now()+si+1).toString(), description: '', videoProvider: 'file', videoUrl: '' } as any);
                                                          updateLesson({ videoSections: next });
                                                        }}
                                                      >+ Ajouter une section</button>
                                                    )}
                                                    <button
                                                      type="button"
                                                      className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                                                      onClick={() => {
                                                        const next = (lesson.videoSections || []).filter((_, idx) => idx !== si);
                                                        updateLesson({ videoSections: next });
                                                      }}
                                                    >Supprimer</button>
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="block text-sm font-medium">Texte au-dessus de la vidéo</label>
                                                  <textarea
                                                    className="mt-1 w-full rounded border-gray-300"
                                                    rows={3}
                                                    value={sec.description || ''}
                                                    onChange={(e) => {
                                                      const next = [...(lesson.videoSections || [])];
                                                      next[si] = { ...sec, description: e.target.value } as any;
                                                      updateLesson({ videoSections: next });
                                                    }}
                                                  />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                  <div>
                                                    <label className="block text-sm font-medium">Provider vidéo</label>
                                                    <select
                                                      className="mt-1 w-full rounded border-gray-300"
                                                      value={sec.videoProvider || 'file'}
                                                      onChange={(e)=>{
                                                        const provider = e.target.value as 'file' | 'vimeo';
                                                        const next = [...(lesson.videoSections || [])];
                                                        next[si] = provider === 'vimeo'
                                                          ? { ...sec, videoProvider: 'vimeo', vimeoId: '', videoUrl: '' }
                                                          : { ...sec, videoProvider: 'file', videoUrl: '', vimeoId: '' } as any;
                                                        updateLesson({ videoSections: next });
                                                      }}
                                                    >
                                                      <option value="file">Fichier/URL direct</option>
                                                      <option value="vimeo">Vimeo</option>
                                                    </select>
                                                  </div>
                                                  {(sec.videoProvider || 'file') === 'file' && (
                                                    <div className="md:col-span-2">
                                                      <label className="block text-sm font-medium">URL vidéo (mp4)</label>
                                                      <input
                                                        className="mt-1 w-full rounded border-gray-300"
                                                        placeholder="https://exemple.com/video.mp4"
                                                        value={sec.videoUrl || ''}
                                                        onChange={(e)=>{
                                                          const next = [...(lesson.videoSections || [])];
                                                          next[si] = { ...sec, videoUrl: e.target.value } as any;
                                                          updateLesson({ videoSections: next });
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                  {sec.videoProvider === 'vimeo' && (
                                                    <div className="md:col-span-2">
                                                      <label className="block text-sm font-medium">URL ou ID Vimeo</label>
                                                      <input
                                                        className="mt-1 w-full rounded border-gray-300"
                                                        placeholder="https://vimeo.com/123456789 ou 123456789"
                                                        value={sec.vimeoId || ''}
                                                        onChange={(e)=>{
                                                          const id = extractVimeoId(e.target.value) || e.target.value.trim();
                                                          const next = [...(lesson.videoSections || [])];
                                                          next[si] = { ...sec, vimeoId: id } as any;
                                                          updateLesson({ videoSections: next });
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                </div>

                                                {/* Aperçu section */}
                                                <div>
                                                  <label className="block text-sm font-medium mb-1">Aperçu section</label>
                                                  <div className="aspect-video bg-black rounded overflow-hidden">
                                                    {sec.videoProvider === 'vimeo' ? (
                                                      sec.vimeoId ? (
                                                        <iframe
                                                          src={`https://player.vimeo.com/video/${sec.vimeoId}?title=0&byline=0&portrait=0`}
                                                          className="w-full h-full"
                                                          frameBorder={0}
                                                          allow="autoplay; fullscreen; picture-in-picture"
                                                          allowFullScreen
                                                          title={`Vimeo Preview Section ${si+1}`}
                                                        />
                                                      ) : (
                                                        <div className="flex items-center justify-center h-full text-white text-sm">Entrez un ID/URL Vimeo valide</div>
                                                      )
                                                    ) : (
                                                      (sec.videoUrl) ? (
                                                        <video controls className="w-full h-full">
                                                          <source src={sec.videoUrl} type="video/mp4" />
                                                        </video>
                                                      ) : (
                                                        <div className="flex items-center justify-center h-full text-white text-sm">Entrez une URL vidéo</div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          // Single video editor (legacy)
                                          <div className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <div>
                                                <label className="block text-sm font-medium">Provider vidéo</label>
                                                <select
                                                  className="mt-1 w-full rounded border-gray-300"
                                                  value={lesson.videoProvider || 'file'}
                                                  onChange={(e)=>{
                                                    const provider = e.target.value as 'file' | 'vimeo';
                                                    const reset: any = provider === 'vimeo' ? { videoProvider: 'vimeo', vimeoId: '', videoUrl: '' } : { videoProvider: 'file', videoUrl: '', vimeoId: '' };
                                                    updateLesson(reset);
                                                  }}
                                                >
                                                  <option value="file">Fichier/URL direct</option>
                                                  <option value="vimeo">Vimeo</option>
                                                </select>
                                              </div>
                                              { (lesson.videoProvider || 'file') === 'file' && (
                                                <div className="md:col-span-2">
                                                  <label className="block text-sm font-medium">URL vidéo (mp4)</label>
                                                  <input
                                                    className="mt-1 w-full rounded border-gray-300"
                                                    placeholder="https://exemple.com/video.mp4"
                                                    value={lesson.videoUrl || lesson.content || ''}
                                                    onChange={(e)=>updateLesson({ videoUrl: e.target.value, content: e.target.value })}
                                                  />
                                                </div>
                                              )}
                                              { lesson.videoProvider === 'vimeo' && (
                                                <div className="md:col-span-2">
                                                  <label className="block text-sm font-medium">URL ou ID Vimeo</label>
                                                  <input
                                                    className="mt-1 w-full rounded border-gray-300"
                                                    placeholder="https://vimeo.com/123456789 ou 123456789"
                                                    value={lesson.vimeoId || ''}
                                                    onChange={(e)=>{
                                                      const id = extractVimeoId(e.target.value) || e.target.value.trim();
                                                      updateLesson({ vimeoId: id });
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                            {/* Aperçu */}
                                            <div className="mt-1">
                                              <label className="block text-sm font-medium mb-1">Aperçu</label>
                                              <div className="aspect-video bg-black rounded overflow-hidden">
                                                {lesson.videoProvider === 'vimeo' ? (
                                                  lesson.vimeoId ? (
                                                    <iframe
                                                      src={`https://player.vimeo.com/video/${lesson.vimeoId}?title=0&byline=0&portrait=0`}
                                                      className="w-full h-full"
                                                      frameBorder={0}
                                                      allow="autoplay; fullscreen; picture-in-picture"
                                                      allowFullScreen
                                                      title="Vimeo Preview"
                                                    />
                                                  ) : (
                                                    <div className="flex items-center justify-center h-full text-white text-sm">Entrez un ID/URL Vimeo valide</div>
                                                  )
                                                ) : (
                                                  (lesson.videoUrl || lesson.content) ? (
                                                    <video controls className="w-full h-full">
                                                      <source src={lesson.videoUrl || lesson.content} type="video/mp4" />
                                                    </video>
                                                  ) : (
                                                    <div className="flex items-center justify-center h-full text-white text-sm">Entrez une URL vidéo</div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {lesson.type === 'quiz' && (
                                      (() => {
                                        const quiz = lesson.quiz || { id: `quiz-${lesson.id}`, questions: [], passingScore: 70, timeLimit: 10 };
                                        const setQuiz = (next: any) => updateLesson({ quiz: { ...quiz, ...next } });
                                        const questions = quiz.questions || [] as any[];
                                        return (
                                          <div className="space-y-2">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <div>
                                                <label className="block text-sm font-medium">Passing score (%)</label>
                                                <input type="number" className="mt-1 w-full rounded border-gray-300" value={quiz.passingScore} onChange={(e)=>setQuiz({ passingScore: Number(e.target.value) })} />
                                              </div>
                                              <div>
                                                <label className="block text-sm font-medium">Durée (min)</label>
                                                <input type="number" className="mt-1 w-full rounded border-gray-300" value={quiz.timeLimit || 0} onChange={(e)=>setQuiz({ timeLimit: Number(e.target.value) })} />
                                              </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <h6 className="font-medium">Questions</h6>
                                              <button
                                                className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95 transition"
                                                onClick={() => setQuiz({ questions: [...questions, { id: Date.now().toString(), text: 'Nouvelle question', type: 'multiple-choice', options: ['Option A','Option B'], correctAnswer: 'Option A' }] })}
                                              >+ Ajouter</button>
                                            </div>
                                            <div className="space-y-3 max-h-[30vh] overflow-auto">
                                              {questions.map((q, qi) => (
                                                <div key={q.id} className="p-3 border rounded">
                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div className="md:col-span-2">
                                                      <label className="block text-sm font-medium">Intitulé</label>
                                                      <input className="mt-1 w-full rounded border-gray-300" value={q.text} onChange={(e)=>{
                                                        const next = [...questions]; next[qi] = { ...q, text: e.target.value }; setQuiz({ questions: next });
                                                      }} />
                                                    </div>
                                                    <div>
                                                      <label className="block text-sm font-medium">Type</label>
                                                      <select
                                                        className="mt-1 w-full rounded border-gray-300"
                                                        value={q.type as 'multiple-choice' | 'true-false'}
                                                        onChange={(e)=>{
                                                          const v = e.target.value;
                                                          const val: 'multiple-choice' | 'true-false' = v === 'true-false' ? 'true-false' : 'multiple-choice';
                                                          const next=[...questions];
                                                          next[qi]={...q, type: val};
                                                          setQuiz({ questions: next });
                                                        }}
                                                      >
                                                      <option value="multiple-choice">multiple-choice</option>
                                                      <option value="true-false">true-false</option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                  {q.type === 'multiple-choice' && (
                                                    <>
                                                      <label className="block text-sm font-medium mt-2">Options (séparées par |)</label>
                                                      <input className="mt-1 w-full rounded border-gray-300" value={(q.options || []).join(' | ')} onChange={(e)=>{
                                                        const opts = e.target.value.split('|').map((s)=>s.trim()).filter(Boolean);
                                                        const next=[...questions]; next[qi]={...q, options: opts}; setQuiz({ questions: next });
                                                      }} />
                                                    </>
                                                  )}
                                                  <label className="block text-sm font-medium mt-2">Bonne réponse</label>
                                                  <input className="mt-1 w-full rounded border-gray-300" value={(q.correctAnswer as string) || ''} onChange={(e)=>{ const next=[...questions]; next[qi]={...q, correctAnswer: e.target.value}; setQuiz({ questions: next }); }} />
                                                  <div className="flex justify-end mt-2">
                                                    <button className="text-sm px-2 py-1 rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 transition" onClick={()=>{ const next = questions.filter((_,i)=>i!==qi); setQuiz({ questions: next }); }}>Supprimer</button>
                                                  </div>
                                                </div>
                                              ))}
                                              {questions.length === 0 && <div className="text-sm text-gray-500">Aucune question.</div>}
                                            </div>
                                          </div>
                                        );
                                      })()
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">ID: {draft.id}</div>
                <div className="flex gap-2">
                  <button onClick={onDelete} className="px-3 py-2 rounded border text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 transition">Supprimer</button>
                  <button
                    onClick={onSave}
                    disabled={saving || !draft.title?.trim() || !draft.category?.trim()}
                    aria-disabled={saving || !draft.title?.trim() || !draft.category?.trim()}
                    className={`px-3 py-2 rounded text-sm text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-95 ${ (saving || !draft.title?.trim() || !draft.category?.trim()) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500'}`}
                  >
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500">Astuce: utilisez l'onglet “Modules / Leçons / Quiz” pour gérer la structure pédagogique.</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminCourses;
