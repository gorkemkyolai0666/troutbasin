'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const ageLabels: Record<string, string> = { FRY: 'Yavru', FINGERLING: 'Parmak Boy', JUVENILE: 'Genç', ADULT: 'Yetişkin', BROODSTOCK: 'Damızlık' };
const ageColors: Record<string, string> = { FRY: 'bg-sky-500/20 text-sky-400', FINGERLING: 'bg-aqua-cyan/20 text-aqua-cyan', JUVENILE: 'bg-aqua-amber/20 text-aqua-amber', ADULT: 'bg-aqua-green/20 text-aqua-green', BROODSTOCK: 'bg-violet-500/20 text-violet-400' };

export default function StockPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStocks(), api.getStockSummary()])
      .then(([s, sum]) => { setStocks(s); setSummary(sum); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Balık Stoku</h1>
        <p className="text-depth-400 text-sm mt-1">Tüm havuzlardaki balık envanteri</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Toplam Balık</p>
            <p className="text-2xl font-bold text-white">{summary.totalFish?.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Toplam Biyokütle</p>
            <p className="text-2xl font-bold text-white">{summary.totalBiomassKg?.toLocaleString('tr-TR')} kg</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Stok Partisi</p>
            <p className="text-2xl font-bold text-white">{summary.stockCount}</p>
          </div>
        </div>
      )}

      <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-depth-700/50">
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Tür</th>
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Havuz</th>
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Yaş Grubu</th>
                <th className="text-right px-4 py-3 text-depth-400 font-medium">Adet</th>
                <th className="text-right px-4 py-3 text-depth-400 font-medium">Ort. Ağırlık (g)</th>
                <th className="text-right px-4 py-3 text-depth-400 font-medium">Biyokütle (kg)</th>
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Giriş Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => (
                <tr key={s.id} className="border-b border-depth-700/30 hover:bg-depth-800/40 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{s.species}</td>
                  <td className="px-4 py-3 text-depth-300">{s.pool?.name}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ageColors[s.ageGroup]}`}>{ageLabels[s.ageGroup]}</span></td>
                  <td className="px-4 py-3 text-right text-depth-200 font-mono">{s.count?.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-right text-depth-200 font-mono">{s.avgWeight}</td>
                  <td className="px-4 py-3 text-right text-depth-200 font-mono">{((s.count * s.avgWeight) / 1000).toFixed(1)}</td>
                  <td className="px-4 py-3 text-depth-400">{new Date(s.entryDate).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-depth-500">
              <p className="text-sm">Henüz stok kaydı yok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
