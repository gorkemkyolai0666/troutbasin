'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const statusLabels: Record<string, string> = { PLANNED: 'Planlı', IN_PROGRESS: 'Devam Ediyor', COMPLETED: 'Tamamlandı', CANCELLED: 'İptal' };
const statusColors: Record<string, string> = { PLANNED: 'bg-ocean-500/20 text-ocean-400', IN_PROGRESS: 'bg-aqua-amber/20 text-aqua-amber', COMPLETED: 'bg-aqua-green/20 text-aqua-green', CANCELLED: 'bg-aqua-red/20 text-aqua-red' };

export default function HarvestPage() {
  const [harvests, setHarvests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getHarvests(), api.getHarvestStats()])
      .then(([h, s]) => { setHarvests(h); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Hasat Yönetimi</h1>
        <p className="text-depth-400 text-sm mt-1">Hasat planlaması ve kayıtları</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Yıllık Hasat</p>
            <p className="text-2xl font-bold text-white">{stats.yearlyHarvestKg?.toLocaleString('tr-TR')} kg</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Toplam Balık</p>
            <p className="text-2xl font-bold text-ocean-400">{stats.yearlyHarvestFish?.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Tamamlanan</p>
            <p className="text-2xl font-bold text-aqua-green">{stats.completedHarvests}</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Planlanan</p>
            <p className="text-2xl font-bold text-aqua-amber">{stats.plannedHarvests}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {harvests.map((h) => (
          <div key={h.id} className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-5 hover:border-depth-600/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white font-mono">{h.harvestCode}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[h.status]}`}>
                    {statusLabels[h.status]}
                  </span>
                </div>
                <p className="text-sm text-depth-400 mt-1">{h.pool?.name} — {new Date(h.harvestDate).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-depth-900/40 rounded-lg p-3">
                <p className="text-xs text-depth-500">Toplam Balık</p>
                <p className="text-lg font-bold text-white font-mono">{h.totalFish?.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-depth-900/40 rounded-lg p-3">
                <p className="text-xs text-depth-500">Toplam Ağırlık</p>
                <p className="text-lg font-bold text-white font-mono">{h.totalWeightKg} kg</p>
              </div>
              <div className="bg-depth-900/40 rounded-lg p-3">
                <p className="text-xs text-depth-500">Ort. Ağırlık</p>
                <p className="text-lg font-bold text-ocean-400 font-mono">{h.avgWeightKg} kg</p>
              </div>
              <div className="bg-depth-900/40 rounded-lg p-3">
                <p className="text-xs text-depth-500">A Sınıfı</p>
                <p className="text-lg font-bold text-aqua-green font-mono">{h.gradeA} kg</p>
              </div>
              <div className="bg-depth-900/40 rounded-lg p-3">
                <p className="text-xs text-depth-500">B/C Sınıfı</p>
                <p className="text-lg font-bold text-aqua-amber font-mono">{h.gradeB + h.gradeC} kg</p>
              </div>
            </div>
            {h.notes && <p className="mt-3 text-xs text-depth-500 border-t border-depth-700/30 pt-3">{h.notes}</p>}
          </div>
        ))}
        {harvests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-depth-500 bg-depth-800/40 rounded-xl border border-depth-700/50">
            <p className="text-sm">Henüz hasat kaydı yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
