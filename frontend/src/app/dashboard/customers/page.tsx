'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', taxId: '' });
  const [saving, setSaving] = useState(false);

  const loadCustomers = () => {
    api.getCustomers().then(setCustomers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadCustomers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createCustomer(form);
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', address: '', city: '', taxId: '' });
      loadCustomers();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Müşteriler</h1>
          <p className="text-depth-400 text-sm mt-1">{customers.length} müşteri kayıtlı</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg bg-ocean-600 hover:bg-ocean-500 text-white text-sm font-medium transition-colors">
          {showForm ? 'İptal' : '+ Yeni Müşteri'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-depth-300 mb-1">İsim</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">E-posta</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">Telefon</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">Şehir</label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">Adres</label>
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-depth-300 mb-1">Vergi No</label>
              <input value={form.taxId} onChange={e => setForm({...form, taxId: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-depth-600 bg-depth-900/50 text-white text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 px-6 py-2 rounded-lg bg-ocean-600 hover:bg-ocean-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : 'Müşteri Ekle'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="bg-depth-800/60 rounded-xl border border-depth-700/50 p-5 hover:border-depth-600/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{c.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-aqua-green/20 text-aqua-green' : 'bg-depth-600/20 text-depth-400'}`}>
                {c.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              {c.city && <p className="text-depth-300"><span className="text-depth-500">Şehir:</span> {c.city}</p>}
              {c.phone && <p className="text-depth-300"><span className="text-depth-500">Tel:</span> {c.phone}</p>}
              {c.email && <p className="text-depth-300"><span className="text-depth-500">E-posta:</span> {c.email}</p>}
              {c.taxId && <p className="text-depth-400 text-xs font-mono">VKN: {c.taxId}</p>}
            </div>
            <div className="mt-3 pt-3 border-t border-depth-700/30 flex justify-between items-center">
              <span className="text-xs text-depth-500">Sipariş Sayısı</span>
              <span className="text-sm font-bold text-ocean-400">{c._count?.sales || 0}</span>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-depth-500 bg-depth-800/40 rounded-xl border border-depth-700/50">
            <p className="text-sm">Henüz müşteri eklenmemiş</p>
          </div>
        )}
      </div>
    </div>
  );
}
