'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const typeLabels: Record<string, string> = { ROUTINE_CHECK: 'Rutin Kontrol', DISEASE: 'Hastalık', TREATMENT: 'Tedavi', MORTALITY: 'Mortalite', VACCINATION: 'Aşılama' };
const typeColors: Record<string, string> = { ROUTINE_CHECK: 'bg-aqua-green/20 text-aqua-green', DISEASE: 'bg-aqua-red/20 text-aqua-red', TREATMENT: 'bg-aqua-amber/20 text-aqua-amber', MORTALITY: 'bg-red-700/20 text-red-400', VACCINATION: 'bg-violet-500/20 text-violet-400' };

export default function HealthPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getHealthRecords(), api.getHealthStats()])
      .then(([r, s]) => { setRecords(r); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Sağlık Takibi</h1>
        <p className="text-depth-400 text-sm mt-1">Hastalık, tedavi ve mortalite kayıtları</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Aylık Mortalite</p>
            <p className={`text-2xl font-bold ${stats.monthlyMortality > 50 ? 'text-aqua-red' : 'text-aqua-green'}`}>{stats.monthlyMortality} adet</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Hastalık Vakası</p>
            <p className="text-2xl font-bold text-aqua-amber">{stats.monthlyDiseaseCount}</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Aylık Kayıt</p>
            <p className="text-2xl font-bold text-white">{stats.monthlyRecordCount}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {records.map((r) => (
          <div key={r.id} className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-5 hover:border-depth-600/50 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[r.recordType]}`}>
                  {typeLabels[r.recordType]}
                </span>
                <span className="text-sm text-depth-400">{new Date(r.recordDate).toLocaleDateString('tr-TR')}</span>
              </div>
              {r.mortality > 0 && (
                <span className="text-sm text-aqua-red font-medium">⚠ {r.mortality} ölüm</span>
              )}
            </div>
            <div className="mb-2">
              <p className="text-sm text-depth-300"><span className="text-depth-500">Stok:</span> {r.stock?.pool?.name}</p>
              <p className="text-sm text-depth-300"><span className="text-depth-500">Denetçi:</span> {r.inspector}</p>
            </div>
            {r.diagnosis && <p className="text-sm text-white mb-1"><span className="text-depth-500">Tanı:</span> {r.diagnosis}</p>}
            {r.treatment && <p className="text-sm text-aqua-cyan"><span className="text-depth-500">Tedavi:</span> {r.treatment}</p>}
            {r.notes && <p className="mt-2 text-xs text-depth-500 border-t border-depth-700/30 pt-2">{r.notes}</p>}
          </div>
        ))}
        {records.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-depth-500 bg-depth-800/40 rounded-xl border border-depth-700/50">
            <svg className="w-12 h-12 mb-3 text-depth-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <p className="text-sm">Henüz sağlık kaydı yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
