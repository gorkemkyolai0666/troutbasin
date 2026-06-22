'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const poolTypeLabels: Record<string, string> = { CONCRETE: 'Beton', EARTHEN: 'Toprak', RACEWAY: 'Kanal', CAGE: 'Kafes', RECIRCULATING: 'RAS' };
const statusLabels: Record<string, string> = { ACTIVE: 'Aktif', MAINTENANCE: 'Bakımda', EMPTY: 'Boş', INACTIVE: 'Pasif' };
const statusColors: Record<string, string> = { ACTIVE: 'bg-aqua-green/20 text-aqua-green', MAINTENANCE: 'bg-aqua-amber/20 text-aqua-amber', EMPTY: 'bg-depth-600/20 text-depth-400', INACTIVE: 'bg-aqua-red/20 text-aqua-red' };

export default function PoolsPage() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', poolType: 'CONCRETE', capacity: '', volume: '', description: '' });
  const [saving, setSaving] = useState(false);

  const loadPools = () => {
    api.getPools().then(setPools).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadPools(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createPool({ ...form, capacity: Number(form.capacity), volume: Number(form.volume) });
      setShowForm(false);
      setForm({ name: '', poolType: 'CONCRETE', capacity: '', volume: '', description: '' });
      loadPools();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Havuz Yönetimi</h1>
          <p className="text-depth-400 text-sm mt-1">{pools.length} havuz kayıtlı</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg bg-ocean-600 hover:bg-ocean-500 text-white text-sm font-medium transition-colors">
          {showForm ? 'İptal' : '+ Yeni Havuz'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-depth-300 mb-1">Havuz Adı</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">Havuz Tipi</label>
              <select value={form.poolType} onChange={e => setForm({...form, poolType: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500">
                {Object.entries(poolTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">Kapasite (adet)</label>
              <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} required className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">Hacim (m³)</label>
              <input type="number" value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} required className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-depth-300 mb-1">Açıklama</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 px-6 py-2 rounded-lg bg-ocean-600 hover:bg-ocean-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : 'Havuz Ekle'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pools.map((pool) => (
          <div key={pool.id} className="bg-depth-800/60 backdrop-blur rounded-xl border border-depth-700/50 p-5 hover:border-depth-600/50 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[pool.status]}`}>
                {statusLabels[pool.status]}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-depth-400">
                <span>Tip</span>
                <span className="text-depth-200">{poolTypeLabels[pool.poolType]}</span>
              </div>
              <div className="flex justify-between text-depth-400">
                <span>Kapasite</span>
                <span className="text-depth-200">{pool.capacity?.toLocaleString('tr-TR')} adet</span>
              </div>
              <div className="flex justify-between text-depth-400">
                <span>Hacim</span>
                <span className="text-depth-200">{pool.volume} m³</span>
              </div>
              <div className="flex justify-between text-depth-400">
                <span>Stok Sayısı</span>
                <span className="text-depth-200">{pool._count?.stocks || 0}</span>
              </div>
            </div>
            {pool.description && (
              <p className="mt-3 text-xs text-depth-500 border-t border-depth-700/50 pt-3">{pool.description}</p>
            )}
          </div>
        ))}
        {pools.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-depth-500">
            <svg className="w-12 h-12 mb-3 text-depth-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" /></svg>
            <p className="text-sm">Henüz havuz eklenmemiş</p>
            <p className="text-xs mt-1">Yeni havuz eklemek için yukarıdaki butonu kullanın</p>
          </div>
        )}
      </div>
    </div>
  );
}
