import React, { useEffect, useMemo, useState } from 'react';
import { getAllCourses } from '../../services/adminCourses';

interface HeartbeatInfo {
  userId: string;
  lastSeen: number;
}

// NOTE: Active window constant removed; using simplistic connected count without expiry window for MVP

const AdminDashboard: React.FC = () => {
  const [now, setNow] = useState(Date.now());
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadRange, setLeadRange] = useState<'today' | '7' | '30' | 'all'>('7');
  const [leadCourse, setLeadCourse] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState<string>('');
  const [leadSortKey, setLeadSortKey] = useState<'date_desc' | 'date_asc' | 'course' | 'name' | 'status'>('date_desc');
  const [leadStatus, setLeadStatus] = useState<'all' | 'new' | 'in_progress' | 'contacted' | 'converted' | 'archived'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'new' | 'in_progress' | 'contacted' | 'converted' | 'archived'>('in_progress');

  // Removed course progression CSV export (admin view focuses on leads)

  

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(interval);
  }, []);

  // refresh when enrollments/leads are updated in another view
  useEffect(() => {
    const onUpdate = () => setNow(Date.now());
    window.addEventListener('leads:updated', onUpdate); // legacy
    window.addEventListener('enrollments:updated', onUpdate);
    return () => {
      window.removeEventListener('leads:updated', onUpdate);
      window.removeEventListener('enrollments:updated', onUpdate);
    };
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(Array.isArray(stored) ? stored : []);
    } catch {
      setUsers([]);
    }
    // courses (mock + custom)
    try {
      setCourses(getAllCourses());
    } catch {
      setCourses([]);
    }
    // enrollments (ex-quoteRequests) with migration fallback
    try {
      const enrollmentsRaw = localStorage.getItem('enrollments');
      const qRaw = localStorage.getItem('quoteRequests');
      const enrollments = enrollmentsRaw ? JSON.parse(enrollmentsRaw) : [];
      const legacy = qRaw ? JSON.parse(qRaw) : [];
      if (Array.isArray(enrollments) && enrollments.length > 0) {
        setLeads(enrollments);
      } else if (Array.isArray(legacy) && legacy.length > 0) {
        // migrate legacy to new key for consistency
        localStorage.setItem('enrollments', JSON.stringify(legacy));
        setLeads(legacy);
      } else {
        setLeads([]);
      }
    } catch {
      setLeads([]);
    }
    return () => {};
  }, [now]);

  const STATUS_OPTIONS: { value: 'new' | 'in_progress' | 'contacted' | 'converted' | 'archived'; label: string; color: string }[] = [
    { value: 'new', label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
    { value: 'in_progress', label: 'En cours', color: 'bg-amber-100 text-amber-700' },
    { value: 'contacted', label: 'Contacté', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'converted', label: 'Converti', color: 'bg-green-100 text-green-700' },
    { value: 'archived', label: 'Archivé', color: 'bg-gray-100 text-gray-700' },
  ];

  const statusLabel = (val?: string) => STATUS_OPTIONS.find(s => s.value === val)?.label || '—';


  const bulkChangeStatus = () => {
    if (selectedIds.length === 0) return;
    try {
      const raw = localStorage.getItem('enrollments');
      const arr = raw ? JSON.parse(raw) : [];
      const idSet = new Set(selectedIds);
      const next = Array.isArray(arr) ? arr.map((e: any) => (idSet.has(e?.id) ? { ...e, status: bulkStatus } : e)) : [];
      localStorage.setItem('enrollments', JSON.stringify(next));
      setLeads(next);
      window.dispatchEvent(new Event('enrollments:updated'));
    } catch {}
  };

  const bulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Supprimer ${selectedIds.length} inscription(s) ?`)) return;
    try {
      const raw = localStorage.getItem('enrollments');
      const arr = raw ? JSON.parse(raw) : [];
      const idSet = new Set(selectedIds);
      const next = Array.isArray(arr) ? arr.filter((e: any) => !idSet.has(e?.id)) : [];
      localStorage.setItem('enrollments', JSON.stringify(next));
      setLeads(next);
      setSelectedIds([]);
      window.dispatchEvent(new Event('enrollments:updated'));
    } catch {}
  };

  const exportSelectedCSV = () => {
    if (selectedIds.length === 0) return;
    const selected = leadsSorted.filter(l => selectedIds.includes(l.id));
    const rows = [
      ['ID', 'Date', 'Cours', 'CourseId', 'Nom', 'Email', 'Téléphone', 'Niveau', 'Début', 'Message', 'Source', 'Statut'],
      ...selected.map(l => [
        l.id || '',
        l.createdAt ? new Date(l.createdAt).toISOString() : '',
        l.courseTitle || '',
        l.courseId || '',
        l.name || '',
        l.email || '',
        l.phone || '',
        l.level || '',
        l.startDate || '',
        (l.message || '').replace(/\n/g, ' '),
        l.source || '',
        l.status || ''
      ])
    ];
    const csv = rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscriptions_selection.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeUsers = useMemo(() => {
    const entries: HeartbeatInfo[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!;
        if (!k) continue;
        if (k.startsWith('userHeartbeat:')) {
          const userId = k.split(':')[1] || '';
          const lastSeenStr = localStorage.getItem(k) || '';
          const lastSeen = Number(lastSeenStr) || 0;
          // exclure l'admin des utilisateurs actifs
          if (!userId || userId.toLowerCase().includes('admin')) continue;
          entries.push({ userId, lastSeen });
        }
      }
    } catch {}
    // de-duplicate by userId
    const setIds = new Set(entries.map((e) => e.userId));
    return setIds.size;
  }, [now]);

  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalEnrollments = users.reduce((acc, u) => acc + (Array.isArray(u?.enrolledCourses) ? u.enrolledCourses.length : 0), 0);
  const totalLeads = leads.length;
  const start7 = now - 7 * 24 * 60 * 60 * 1000;
  const startDay = new Date(new Date(now).getFullYear(), new Date(now).getMonth(), new Date(now).getDate()).getTime();
  const leadsLast7Days = leads.filter(l => (l?.createdAt || 0) >= start7).length;
  const leadsToday = leads.filter(l => (l?.createdAt || 0) >= startDay).length;

  // Removed course progression and recent activity (student-focused widgets)

  // Leads helpers
  const leadsSorted = useMemo(() => {
    return [...leads].sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0));
  }, [leads]);

  const leadsByCourse = useMemo(() => {
    const map: Record<string, { title: string; count: number }> = {};
    for (const l of leads) {
      const key = l.courseId || 'unknown';
      if (!map[key]) map[key] = { title: l.courseTitle || '—', count: 0 };
      map[key].count += 1;
    }
    return Object.entries(map)
      .map(([id, v]) => ({ id, title: v.title, count: v.count }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  // Leads filtering and chart data (placed after leadsSorted definition)
  const filteredLeads = useMemo(() => {
    let list = leadsSorted;
    if (leadCourse !== 'all') list = list.filter(l => l.courseId === leadCourse);
    if (leadRange !== 'all') {
      const start = (() => {
        const d = new Date(now);
        d.setHours(0,0,0,0);
        if (leadRange === 'today') return d.getTime();
        const days = leadRange === '7' ? 7 : 30;
        return now - days * 24 * 60 * 60 * 1000;
      })();
      list = list.filter(l => (l?.createdAt || 0) >= start);
    }
    if (leadStatus !== 'all') {
      list = list.filter(l => (l?.status || 'new') === leadStatus);
    }
    return list;
  }, [leadsSorted, leadCourse, leadRange, leadStatus, now]);

  const chartDays = useMemo(() => (leadRange === '30' ? 30 : 7), [leadRange]);
  const leadSeries = useMemo(() => {
    const buckets: { label: string; dayStart: number; count: number }[] = [];
    const base = new Date(now);
    base.setHours(0,0,0,0);
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(base.getTime() - i * 24 * 60 * 60 * 1000);
      const label = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;
      buckets.push({ label, dayStart: d.getTime(), count: 0 });
    }
    for (const l of filteredLeads) {
      const t = l?.createdAt || 0;
      for (let i = buckets.length - 1; i >= 0; i--) {
        const start = buckets[i].dayStart;
        const end = start + 24 * 60 * 60 * 1000;
        if (t >= start && t < end) { buckets[i].count += 1; break; }
      }
    }
    const max = buckets.reduce((m, b) => Math.max(m, b.count), 0) || 1;
    return { buckets, max };
  }, [filteredLeads, chartDays, now]);

  // Leads recherche + tri pour le tableau détaillé
  const displayedLeads = useMemo(() => {
    const term = leadSearch.trim().toLowerCase();
    let list = term
      ? filteredLeads.filter((l) => {
        const hay = `${l.courseTitle || ''} ${l.name || ''} ${l.email || ''} ${l.phone || ''} ${l.message || ''}`.toLowerCase();
        return hay.includes(term);
      })
      : filteredLeads;
    const sorted = [...list].sort((a, b) => {
      if (leadSortKey === 'date_desc') return (b?.createdAt || 0) - (a?.createdAt || 0);
      if (leadSortKey === 'date_asc') return (a?.createdAt || 0) - (b?.createdAt || 0);
      if (leadSortKey === 'course') return (a.courseTitle || '').localeCompare(b.courseTitle || '');
      if (leadSortKey === 'name') return (a.name || '').localeCompare(b.name || '');
      if (leadSortKey === 'status') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });
    return sorted;
  }, [filteredLeads, leadSearch, leadSortKey]);

  const isAllDisplayedSelected = useMemo(() => displayedLeads.length > 0 && displayedLeads.every(l => selectedIds.includes(l.id)), [displayedLeads, selectedIds]);
  const toggleSelectAllDisplayed = () => {
    if (isAllDisplayedSelected) {
      const ids = new Set(selectedIds);
      displayedLeads.forEach(l => ids.delete(l.id));
      setSelectedIds(Array.from(ids));
    } else {
      const ids = new Set(selectedIds);
      displayedLeads.forEach(l => ids.add(l.id));
      setSelectedIds(Array.from(ids));
    }
  };
  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const updateEnrollmentStatus = (id: string, status: 'new' | 'in_progress' | 'contacted' | 'converted' | 'archived') => {
    try {
      const raw = localStorage.getItem('enrollments');
      const arr = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(arr)
        ? arr.map((e: any) => (e?.id === id ? { ...e, status } : e))
        : [];
      localStorage.setItem('enrollments', JSON.stringify(next));
      setLeads(next);
      window.dispatchEvent(new Event('enrollments:updated'));
    } catch {}
  };

  const exportFilteredLeadsCSV = () => {
    const rows = [
      ['ID', 'Date', 'Cours', 'CourseId', 'Nom', 'Email', 'Téléphone', 'Niveau', 'Début', 'Message', 'Source', 'Statut'],
      ...displayedLeads.map(l => [
        l.id || '',
        l.createdAt ? new Date(l.createdAt).toISOString() : '',
        l.courseTitle || '',
        l.courseId || '',
        l.name || '',
        l.email || '',
        l.phone || '',
        l.level || '',
        l.startDate || '',
        (l.message || '').replace(/\n/g, ' '),
        l.source || '',
        l.status || ''
      ])
    ];
    const csv = rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscriptions_filtrees.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportLeadsCSV = () => {
    const rows = [
      ['ID', 'Date', 'Cours', 'CourseId', 'Nom', 'Email', 'Téléphone', 'Niveau', 'Début', 'Message', 'Source', 'Statut'],
      ...leadsSorted.map(l => [
        l.id || '',
        l.createdAt ? new Date(l.createdAt).toISOString() : '',
        l.courseTitle || '',
        l.courseId || '',
        l.name || '',
        l.email || '',
        l.phone || '',
        l.level || '',
        l.startDate || '',
        (l.message || '').replace(/\n/g, ' '),
        l.source || '',
        l.status || ''
      ])
    ];
    const csv = rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscriptions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tableau de bord</h2>
          <p className="text-sm text-gray-500">Aperçu global de l'activité</p>
        </div>
        <span className="text-xs text-gray-400">Actualisé: {new Date(now).toLocaleTimeString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="rounded-lg border p-4 bg-sky-50/60 border-l-4 border-sky-500">
          <div className="text-sm text-sky-700">Utilisateurs</div>
          <div className="mt-1 text-2xl font-semibold text-sky-900">{totalUsers}</div>
        </div>
        <div className="rounded-lg border p-4 bg-violet-50/60 border-l-4 border-violet-500">
          <div className="text-sm text-violet-700">Connectés (2 min)</div>
          <div className="mt-1 text-2xl font-semibold text-violet-900">{activeUsers}</div>
        </div>
        <div className="rounded-lg border p-4 bg-cyan-50/60 border-l-4 border-cyan-500">
          <div className="text-sm text-cyan-700">Cours</div>
          <div className="mt-1 text-2xl font-semibold text-cyan-900">{totalCourses}</div>
        </div>
        <div className="rounded-lg border p-4 bg-emerald-50/60 border-l-4 border-emerald-500">
          <div className="text-sm text-emerald-700">Inscriptions</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-900">{totalEnrollments}</div>
        </div>
        <div className="rounded-lg border p-4 bg-gray-50 md:col-span-2 lg:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Inscriptions (total)</div>
              <div className="mt-1 text-2xl font-semibold">{totalLeads}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Inscriptions (7 jours)</div>
              <div className="mt-1 text-2xl font-semibold">{leadsLast7Days}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Inscriptions (aujourd'hui)</div>
              <div className="mt-1 text-2xl font-semibold">{leadsToday}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau détaillé des inscriptions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-indigo-700">Inscriptions — tableau détaillé</h3>
          <div className="flex items-center gap-2">
            <input
              value={leadSearch}
              onChange={(e) => setLeadSearch(e.target.value)}
              placeholder="Rechercher (nom, email, cours, message)"
              className="px-3 py-2 rounded border text-sm w-64"
            />
            <select
              className="px-2 py-2 rounded border text-sm"
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value as any)}
              title="Filtrer par statut"
            >
              <option value="all">Tous les statuts</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              className="px-2 py-2 rounded border text-sm"
              value={leadSortKey}
              onChange={(e) => setLeadSortKey(e.target.value as any)}
              title="Trier par"
            >
              <option value="date_desc">Date (récent→ancien)</option>
              <option value="date_asc">Date (ancien→récent)</option>
              <option value="course">Cours (A→Z)</option>
              <option value="name">Nom (A→Z)</option>
              <option value="status">Statut (A→Z)</option>
            </select>
            <button
              onClick={exportFilteredLeadsCSV}
              className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              title="Exporter le tableau filtré en CSV"
            >
              Export CSV (filtré)
            </button>
          </div>
        </div>
        {selectedIds.length > 0 && (
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sélection: {selectedIds.length}</span>
            <select className="border rounded px-2 py-1" value={bulkStatus} onChange={(e)=>setBulkStatus(e.target.value as any)}>
              {STATUS_OPTIONS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
            </select>
            <button onClick={bulkChangeStatus} className="px-2 py-1 rounded border hover:bg-gray-50">Changer statut</button>
            <button onClick={exportSelectedCSV} className="px-2 py-1 rounded border hover:bg-gray-50">Exporter CSV (sélection)</button>
            <button onClick={bulkDelete} className="px-2 py-1 rounded border hover:bg-red-50 text-red-600">Supprimer</button>
          </div>
        )}
        <div className="rounded-lg border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-3"><input type="checkbox" checked={isAllDisplayedSelected} onChange={toggleSelectAllDisplayed} /></th>
                <th className="text-left p-3 font-medium text-gray-600">Date</th>
                <th className="text-left p-3 font-medium text-gray-600">Cours</th>
                <th className="text-left p-3 font-medium text-gray-600">Nom</th>
                <th className="text-left p-3 font-medium text-gray-600">Email</th>
                <th className="text-left p-3 font-medium text-gray-600">Téléphone</th>
                <th className="text-left p-3 font-medium text-gray-600">Niveau</th>
                <th className="text-left p-3 font-medium text-gray-600">Début</th>
                <th className="text-left p-3 font-medium text-gray-600">Message</th>
                <th className="text-left p-3 font-medium text-gray-600">Source</th>
                <th className="text-left p-3 font-medium text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {displayedLeads.map((l) => (
                <tr key={l.id} className="border-t align-top odd:bg-white even:bg-slate-50 hover:bg-indigo-50/40 transition-colors">
                  <td className="p-3"><input type="checkbox" checked={selectedIds.includes(l.id)} onChange={()=>toggleSelectOne(l.id)} /></td>
                  <td className="p-3 whitespace-nowrap">{l.createdAt ? new Date(l.createdAt).toLocaleString() : '—'}</td>
                  <td className="p-3 min-w-[200px]">{l.courseTitle || '—'}</td>
                  <td className="p-3 whitespace-nowrap">{l.name || '—'}</td>
                  <td className="p-3 whitespace-nowrap">{l.email || '—'}</td>
                  <td className="p-3 whitespace-nowrap">{l.phone || '—'}</td>
                  <td className="p-3 whitespace-nowrap">{l.level || '—'}</td>
                  <td className="p-3 whitespace-nowrap">{l.startDate || '—'}</td>
                  <td className="p-3 max-w-[360px] text-gray-700">{l.message || '—'}</td>
                  <td className="p-3 whitespace-nowrap text-gray-600">{l.source || '—'}</td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${STATUS_OPTIONS.find(s=>s.value===l.status)?.color || 'bg-gray-100 text-gray-700'}`}>{statusLabel(l.status)}</span>
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={l.status || 'new'}
                        onChange={(e)=>updateEnrollmentStatus(l.id, e.target.value as any)}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedLeads.length === 0 && (
                <tr>
                  <td className="p-3 text-sm text-gray-500" colSpan={10}>Aucune inscription selon les filtres</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6 lg:col-span-2">
          {/* Widgets étudiants masqués pour l'admin */}
          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Inscriptions — évolution</h4>
              <div className="flex items-center gap-2">
                <select value={leadRange} onChange={(e) => setLeadRange(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                  <option value="today">Aujourd'hui</option>
                  <option value="7">7 jours</option>
                  <option value="30">30 jours</option>
                  <option value="all">Tout</option>
                </select>
                <select value={leadCourse} onChange={(e) => setLeadCourse(e.target.value)} className="border rounded px-2 py-1 text-sm max-w-[200px]">
                  <option value="all">Tous les cours</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs text-gray-500">Total filtré: {filteredLeads.length}</div>
            <div className="mt-3">
              <div className="h-32 grid" style={{ gridTemplateColumns: `repeat(${leadSeries.buckets.length}, minmax(0, 1fr))` }}>
                {leadSeries.buckets.map((b, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end">
                    <div className="w-4 sm:w-5 bg-indigo-500 rounded-t" style={{ height: `${(b.count / (leadSeries.max || 1)) * 100}%` }} title={`${b.label}: ${b.count}`} />
                  </div>
                ))}
              </div>
              <div className="mt-1 grid text-[10px] text-gray-500" style={{ gridTemplateColumns: `repeat(${leadSeries.buckets.length}, minmax(0, 1fr))` }}>
                {leadSeries.buckets.map((b, idx) => (
                  <div key={idx} className="text-center truncate">{b.label}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Inscriptions récentes</h4>
              <div className="flex items-center gap-2">
                <button onClick={exportLeadsCSV} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-700">Exporter CSV</button>
              </div>
            </div>
            <ul className="mt-2 space-y-2">
              {leadsSorted.slice(0,5).map((l) => (
                <li key={l.id} className="text-sm text-gray-700">
                  <div className="font-medium truncate">{l.courseTitle || '—'}</div>
                  <div className="text-xs text-gray-500 truncate">{l.name || '—'} • {l.email || '—'}</div>
                  <div className="text-xs text-gray-400">{l.createdAt ? new Date(l.createdAt).toLocaleString() : '—'}</div>
                </li>
              ))}
              {leadsSorted.length === 0 && (
                <li className="text-sm text-gray-500">Aucune inscription pour l'instant</li>
              )}
            </ul>
          </div>
          <div className="rounded-lg border p-4 bg-white">
            <h4 className="font-medium mb-2">Top cours par inscriptions</h4>
            <ul className="space-y-2">
              {leadsByCourse.slice(0,5).map((c) => (
                <li key={c.id} className="text-sm text-gray-700 flex items-center justify-between">
                  <span className="truncate mr-2">{c.title}</span>
                  <span className="text-xs text-gray-600">{c.count}</span>
                </li>
              ))}
              {leadsByCourse.length === 0 && (
                <li className="text-sm text-gray-500">Pas encore de données</li>
              )}
            </ul>
          </div>
          {/* Widget Accès récents retiré (non pertinent pour l'admin) */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
