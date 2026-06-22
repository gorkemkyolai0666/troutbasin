'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function FeedPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'types' | 'logs'>('types');

  useEffect(() => {
    Promise.all([api.getFeedTypes(), api.getFeedLogs(), api.getFeedStats()])
      .then(([t, l, s]) => { setTypes(t); setLogs(l); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Yem Yönetimi</h1>
        <p className="text-depth-400 text-sm mt-1">Yem stoku ve yemleme kayıtları</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Toplam Yem Stoku</p>
            <p className="text-2xl font-bold text-white">{stats.totalFeedStockKg?.toLocaleString('tr-TR')} kg</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Bugünkü Tüketim</p>
            <p className="text-2xl font-bold text-aqua-amber">{stats.todayConsumptionKg} kg</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Haftalık Tüketim</p>
            <p className="text-2xl font-bold text-ocean-400">{stats.weekConsumptionKg} kg</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('types')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'types' ? 'bg-ocean-600 text-white' : 'text-depth-400 hover:text-white bg-depth-800/40'}`}>
          Yem Türleri
        </button>
        <button onClick={() => setTab('logs')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'logs' ? 'bg-ocean-600 text-white' : 'text-depth-400 hover:text-white bg-depth-800/40'}`}>
          Yemleme Kayıtları
        </button>
      </div>

      {tab === 'types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((t) => (
            <div key={t.id} className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-5 hover:border-depth-600/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                  <p className="text-sm text-depth-400">{t.brand || 'Marka belirtilmemiş'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.isActive ? 'bg-aqua-green/20 text-aqua-green' : 'bg-depth-600/20 text-depth-400'}`}>
                  {t.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-depth-900/40 rounded-lg p-2.5">
                  <p className="text-depth-500 text-xs">Protein</p>
                  <p className="text-white font-mono">%{t.proteinPct}</p>
                </div>
                <div className="bg-depth-900/40 rounded-lg p-2.5">
                  <p className="text-depth-500 text-xs">Yağ</p>
                  <p className="text-white font-mono">%{t.fatPct}</p>
                </div>
                <div className="bg-depth-900/40 rounded-lg p-2.5">
                  <p className="text-depth-500 text-xs">Pelet Boyutu</p>
                  <p className="text-white font-mono">{t.pelletSize} mm</p>
                </div>
                <div className="bg-depth-900/40 rounded-lg p-2.5">
                  <p className="text-depth-500 text-xs">Fiyat</p>
                  <p className="text-white font-mono">₺{t.pricePerKg}/kg</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-depth-700/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-depth-400">Stok</span>
                  <span className={`text-sm font-bold ${t.stockKg < 100 ? 'text-aqua-red' : 'text-aqua-green'}`}>{t.stockKg?.toLocaleString('tr-TR')} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'logs' && (
        <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-depth-700/50">
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Tarih</th>
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Saat</th>
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Havuz</th>
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Yem</th>
                  <th className="text-right px-4 py-3 text-depth-400 font-medium">Miktar (kg)</th>
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Not</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-depth-700/30 hover:bg-depth-800/40 transition-colors">
                    <td className="px-4 py-3 text-depth-200">{new Date(l.feedDate).toLocaleDateString('tr-TR')}</td>
                    <td className="px-4 py-3 text-depth-300 font-mono">{l.feedTime}</td>
                    <td className="px-4 py-3 text-white">{l.pool?.name}</td>
                    <td className="px-4 py-3 text-depth-300">{l.feedType?.name}</td>
                    <td className="px-4 py-3 text-right text-depth-200 font-mono font-bold">{l.quantityKg}</td>
                    <td className="px-4 py-3 text-depth-500 text-xs max-w-xs truncate">{l.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-depth-500">
                <p className="text-sm">Henüz yemleme kaydı yok</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
