'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface DashboardData {
  poolStats: any;
  stockSummary: any;
  feedStats: any;
  healthStats: any;
  waterAverages: any;
  harvestStats: any;
  saleStats: any;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || 'Kullanıcı');

    Promise.all([
      api.getPoolStats().catch(() => ({ totalPools: 0, activePools: 0, totalCapacity: 0, totalFish: 0 })),
      api.getStockSummary().catch(() => ({ totalFish: 0, totalBiomassKg: 0, stockCount: 0 })),
      api.getFeedStats().catch(() => ({ totalFeedStockKg: 0, todayConsumptionKg: 0, weekConsumptionKg: 0 })),
      api.getHealthStats().catch(() => ({ monthlyMortality: 0, monthlyDiseaseCount: 0 })),
      api.getWaterQualityAverages().catch(() => ({ avgTemperature: null, avgDissolvedOxygen: null, avgPh: null })),
      api.getHarvestStats().catch(() => ({ yearlyHarvestKg: 0, plannedHarvests: 0, completedHarvests: 0 })),
      api.getSaleStats().catch(() => ({ monthlyRevenue: 0, yearlyRevenue: 0, pendingSales: 0 })),
    ]).then(([poolStats, stockSummary, feedStats, healthStats, waterAverages, harvestStats, saleStats]) => {
      setData({ poolStats, stockSummary, feedStats, healthStats, waterAverages, harvestStats, saleStats });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-depth-400">Veriler yükleniyor...</span>
        </div>
      </div>
    );
  }

  const d = data!;

  const cards = [
    { title: 'Aktif Havuz', value: d.poolStats.activePools, subtitle: `${d.poolStats.totalPools} toplam`, color: 'from-ocean-600 to-ocean-700', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z' },
    { title: 'Toplam Balık', value: d.stockSummary.totalFish?.toLocaleString('tr-TR'), subtitle: `${d.stockSummary.totalBiomassKg?.toLocaleString('tr-TR')} kg biyokütle`, color: 'from-aqua-cyan to-ocean-500', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3' },
    { title: 'Yem Stoku', value: `${d.feedStats.totalFeedStockKg?.toLocaleString('tr-TR')} kg`, subtitle: `Bugün: ${d.feedStats.todayConsumptionKg} kg`, color: 'from-aqua-amber to-orange-500', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158' },
    { title: 'Aylık Mortalite', value: d.healthStats.monthlyMortality, subtitle: `${d.healthStats.monthlyDiseaseCount} hastalık vakası`, color: d.healthStats.monthlyMortality > 50 ? 'from-aqua-red to-red-600' : 'from-aqua-green to-emerald-600', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Yıllık Hasat', value: `${d.harvestStats.yearlyHarvestKg?.toLocaleString('tr-TR')} kg`, subtitle: `${d.harvestStats.plannedHarvests} planlı hasat`, color: 'from-emerald-500 to-teal-600', icon: 'M9 12l2 2 4-4' },
    { title: 'Aylık Gelir', value: `₺${d.saleStats.monthlyRevenue?.toLocaleString('tr-TR')}`, subtitle: `${d.saleStats.pendingSales} bekleyen sipariş`, color: 'from-violet-500 to-purple-600', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4' },
  ];

  const waterParams = [
    { label: 'Sıcaklık', value: d.waterAverages.avgTemperature, unit: '°C', optimal: '12-16', status: d.waterAverages.avgTemperature >= 12 && d.waterAverages.avgTemperature <= 16 },
    { label: 'Çözünmüş O₂', value: d.waterAverages.avgDissolvedOxygen, unit: 'mg/L', optimal: '>7', status: d.waterAverages.avgDissolvedOxygen >= 7 },
    { label: 'pH', value: d.waterAverages.avgPh, unit: '', optimal: '6.5-8.5', status: d.waterAverages.avgPh >= 6.5 && d.waterAverages.avgPh <= 8.5 },
    { label: 'Amonyak', value: d.waterAverages.avgAmmonia, unit: 'mg/L', optimal: '<0.05', status: d.waterAverages.avgAmmonia <= 0.05 },
    { label: 'Nitrit', value: d.waterAverages.avgNitrite, unit: 'mg/L', optimal: '<0.1', status: d.waterAverages.avgNitrite <= 0.1 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Hoş geldiniz, {userName}</h1>
        <p className="text-depth-400 mt-1">Çiftlik durumunuzun genel görünümü</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-depth-800/60 backdrop-blur rounded-xl border border-depth-700/50 p-5 hover:border-depth-600/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-depth-400">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                <p className="text-xs text-depth-500 mt-1">{card.subtitle}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-depth-800/60 backdrop-blur rounded-xl border border-depth-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Su Kalitesi Ortalamaları (Son 7 Gün)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {waterParams.map((param, i) => (
            <div key={i} className="bg-depth-900/50 rounded-lg p-4 border border-depth-700/30">
              <p className="text-xs text-depth-400 mb-1">{param.label}</p>
              <p className="text-xl font-bold text-white">
                {param.value !== null ? param.value : '—'}
                <span className="text-sm font-normal text-depth-400 ml-1">{param.unit}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${param.value !== null && param.status ? 'bg-aqua-green' : param.value !== null ? 'bg-aqua-red' : 'bg-depth-600'}`} />
                <span className="text-xs text-depth-500">Optimal: {param.optimal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
