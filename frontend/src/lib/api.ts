const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4620/api';

async function fetchApi(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (data: { email: string; password: string }) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: { email: string; password: string; name: string }) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => fetchApi('/auth/profile'),

  health: () => fetchApi('/health'),

  getPools: (status?: string) => fetchApi(`/pools${status ? `?status=${status}` : ''}`),
  getPool: (id: string) => fetchApi(`/pools/${id}`),
  createPool: (data: any) => fetchApi('/pools', { method: 'POST', body: JSON.stringify(data) }),
  updatePool: (id: string, data: any) => fetchApi(`/pools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePool: (id: string) => fetchApi(`/pools/${id}`, { method: 'DELETE' }),
  getPoolStats: () => fetchApi('/pools/stats'),

  getStocks: (poolId?: string) => fetchApi(`/stocks${poolId ? `?poolId=${poolId}` : ''}`),
  getStock: (id: string) => fetchApi(`/stocks/${id}`),
  createStock: (data: any) => fetchApi('/stocks', { method: 'POST', body: JSON.stringify(data) }),
  updateStock: (id: string, data: any) => fetchApi(`/stocks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStock: (id: string) => fetchApi(`/stocks/${id}`, { method: 'DELETE' }),
  getStockSummary: () => fetchApi('/stocks/summary'),

  getFeedTypes: () => fetchApi('/feed/types'),
  createFeedType: (data: any) => fetchApi('/feed/types', { method: 'POST', body: JSON.stringify(data) }),
  updateFeedType: (id: string, data: any) => fetchApi(`/feed/types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getFeedLogs: (poolId?: string) => fetchApi(`/feed/logs${poolId ? `?poolId=${poolId}` : ''}`),
  createFeedLog: (data: any) => fetchApi('/feed/logs', { method: 'POST', body: JSON.stringify(data) }),
  getFeedStats: () => fetchApi('/feed/stats'),

  getHealthRecords: (stockId?: string, type?: string) => {
    const params = new URLSearchParams();
    if (stockId) params.set('stockId', stockId);
    if (type) params.set('type', type);
    return fetchApi(`/health-records${params.toString() ? `?${params}` : ''}`);
  },
  createHealthRecord: (data: any) => fetchApi('/health-records', { method: 'POST', body: JSON.stringify(data) }),
  getHealthStats: () => fetchApi('/health-records/stats'),

  getWaterQuality: (poolId?: string) => fetchApi(`/water-quality${poolId ? `?poolId=${poolId}` : ''}`),
  createWaterQuality: (data: any) => fetchApi('/water-quality', { method: 'POST', body: JSON.stringify(data) }),
  getLatestWaterQuality: () => fetchApi('/water-quality/latest'),
  getWaterQualityAverages: () => fetchApi('/water-quality/averages'),

  getHarvests: (status?: string) => fetchApi(`/harvests${status ? `?status=${status}` : ''}`),
  getHarvest: (id: string) => fetchApi(`/harvests/${id}`),
  createHarvest: (data: any) => fetchApi('/harvests', { method: 'POST', body: JSON.stringify(data) }),
  updateHarvest: (id: string, data: any) => fetchApi(`/harvests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHarvest: (id: string) => fetchApi(`/harvests/${id}`, { method: 'DELETE' }),
  getHarvestStats: () => fetchApi('/harvests/stats'),

  getCustomers: () => fetchApi('/customers'),
  getCustomer: (id: string) => fetchApi(`/customers/${id}`),
  createCustomer: (data: any) => fetchApi('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) => fetchApi(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getSales: (status?: string) => fetchApi(`/sales${status ? `?status=${status}` : ''}`),
  getSale: (id: string) => fetchApi(`/sales/${id}`),
  createSale: (data: any) => fetchApi('/sales', { method: 'POST', body: JSON.stringify(data) }),
  updateSale: (id: string, data: any) => fetchApi(`/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getSaleStats: () => fetchApi('/sales/stats'),
};
