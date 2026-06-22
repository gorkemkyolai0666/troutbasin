'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const statusLabels: Record<string, string> = { PENDING: 'Beklemede', CONFIRMED: 'Onaylandı', SHIPPED: 'Sevk Edildi', DELIVERED: 'Teslim Edildi', CANCELLED: 'İptal' };
const statusColors: Record<string, string> = { PENDING: 'bg-aqua-amber/20 text-aqua-amber', CONFIRMED: 'bg-ocean-500/20 text-ocean-400', SHIPPED: 'bg-violet-500/20 text-violet-400', DELIVERED: 'bg-aqua-green/20 text-aqua-green', CANCELLED: 'bg-aqua-red/20 text-aqua-red' };

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSales(), api.getSaleStats()])
      .then(([s, st]) => { setSales(s); setStats(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Satış Yönetimi</h1>
        <p className="text-depth-400 text-sm mt-1">Sipariş ve satış takibi</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Aylık Gelir</p>
            <p className="text-2xl font-bold text-aqua-green">₺{stats.monthlyRevenue?.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Yıllık Gelir</p>
            <p className="text-2xl font-bold text-white">₺{stats.yearlyRevenue?.toLocaleString('tr-TR')}</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Bekleyen Sipariş</p>
            <p className="text-2xl font-bold text-aqua-amber">{stats.pendingSales}</p>
          </div>
          <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-4">
            <p className="text-sm text-depth-400">Teslim Edilen (Bu Ay)</p>
            <p className="text-2xl font-bold text-ocean-400">{stats.deliveredThisMonth}</p>
          </div>
        </div>
      )}

      <div className="bg-depth-800/60 rounded-xl border border-depth-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-depth-700/50">
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Sipariş Kodu</th>
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Müşteri</th>
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Tarih</th>
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Durum</th>
                <th className="text-right px-4 py-3 text-depth-400 font-medium">Tutar</th>
                <th className="text-left px-4 py-3 text-depth-400 font-medium">Ürünler</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-b border-depth-700/30 hover:bg-depth-800/40 transition-colors">
                  <td className="px-4 py-3 text-white font-mono font-medium">{s.saleCode}</td>
                  <td className="px-4 py-3">
                    <p className="text-depth-200">{s.customer?.name}</p>
                    <p className="text-xs text-depth-500">{s.customer?.city}</p>
                  </td>
                  <td className="px-4 py-3 text-depth-300">{new Date(s.saleDate).toLocaleDateString('tr-TR')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>
                      {statusLabels[s.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white font-mono font-bold">₺{s.totalAmount?.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-depth-400 text-xs max-w-xs">
                    {s.items?.map((it: any) => `${it.product} (${it.quantity}${it.unit})`).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-depth-500">
              <p className="text-sm">Henüz satış kaydı yok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
