'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function WaterQualityPage() {
  const [readings, setReadings] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [averages, setAverages] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWaterQuality(), api.getLatestWaterQuality(), api.getWaterQualityAverages()])
      .then(([r, l, a]) => { setReadings(r); setLatest(l); setAverages(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (param: string, value: number | null) => {
    if (value === null) return 'text-depth-500';
    const limits: Record<string, [number, number]> = {
      temperature: [10, 18],
      dissolvedOxygen: [7, 14],
      ph: [6.5, 8.5],
      ammonia: [0, 0.05],
      nitrite: [0, 0.1],
    };
    const range = limits[param];
    if (!range) return 'text-white';
    return value >= range[0] && value <= range[1] ? 'text-aqua-green' : 'text-aqua-red';
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Su Kalitesi</h1>
        <p className="text-depth-400 text-sm mt-1">Havuz bazlı su parametreleri ve ölçüm geçmişi</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Havuz Bazlı Son Okumalar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latest.map((item, i) => (
            <div key={i} className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-5">
              <h3 className="text-lg font-semibold text-white mb-3">{item.pool.name}</h3>
              {item.latestReading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Sıcaklık', value: item.latestReading.temperature, unit: '°C', param: 'temperature' },
                    { label: 'Çöz. O₂', value: item.latestReading.dissolvedOxygen, unit: 'mg/L', param: 'dissolvedOxygen' },
                    { label: 'pH', value: item.latestReading.ph, unit: '', param: 'ph' },
                    { label: 'NH₃', value: item.latestReading.ammonia, unit: 'mg/L', param: 'ammonia' },
                    { label: 'NO₂', value: item.latestReading.nitrite, unit: 'mg/L', param: 'nitrite' },
                    { label: 'Bulanıklık', value: item.latestReading.turbidity, unit: 'NTU', param: 'turbidity' },
                  ].map((p, j) => (
                    <div key={j} className="bg-depth-900/50 rounded-lg p-2.5">
                      <p className="text-xs text-depth-500">{p.label}</p>
                      <p className={`text-lg font-mono font-bold ${getStatusColor(p.param, p.value)}`}>
                        {p.value !== null && p.value !== undefined ? p.value : '—'}
                        <span className="text-xs font-normal text-depth-500 ml-0.5">{p.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-depth-500">Henüz ölçüm yapılmamış</p>
              )}
              {item.latestReading && (
                <p className="mt-3 text-xs text-depth-500">
                  Son ölçüm: {new Date(item.latestReading.measureDate).toLocaleString('tr-TR')} — {item.latestReading.inspector}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Ölçüm Geçmişi</h2>
        <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-depth-700/50">
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Tarih</th>
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Havuz</th>
                  <th className="text-right px-4 py-3 text-depth-400 font-medium">°C</th>
                  <th className="text-right px-4 py-3 text-depth-400 font-medium">O₂</th>
                  <th className="text-right px-4 py-3 text-depth-400 font-medium">pH</th>
                  <th className="text-right px-4 py-3 text-depth-400 font-medium">NH₃</th>
                  <th className="text-right px-4 py-3 text-depth-400 font-medium">NO₂</th>
                  <th className="text-left px-4 py-3 text-depth-400 font-medium">Denetçi</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.id} className="border-b border-depth-700/30 hover:bg-depth-800/40 transition-colors">
                    <td className="px-4 py-3 text-depth-300">{new Date(r.measureDate).toLocaleString('tr-TR')}</td>
                    <td className="px-4 py-3 text-white">{r.pool?.name}</td>
                    <td className={`px-4 py-3 text-right font-mono ${getStatusColor('temperature', r.temperature)}`}>{r.temperature}</td>
                    <td className={`px-4 py-3 text-right font-mono ${getStatusColor('dissolvedOxygen', r.dissolvedOxygen)}`}>{r.dissolvedOxygen}</td>
                    <td className={`px-4 py-3 text-right font-mono ${getStatusColor('ph', r.ph)}`}>{r.ph}</td>
                    <td className={`px-4 py-3 text-right font-mono ${getStatusColor('ammonia', r.ammonia)}`}>{r.ammonia ?? '—'}</td>
                    <td className={`px-4 py-3 text-right font-mono ${getStatusColor('nitrite', r.nitrite)}`}>{r.nitrite ?? '—'}</td>
                    <td className="px-4 py-3 text-depth-400">{r.inspector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
