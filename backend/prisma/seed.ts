import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo123456', 10);

  await prisma.user.upsert({
    where: { email: 'demo@alabalikcilik.com.tr' },
    update: {},
    create: {
      email: 'demo@alabalikcilik.com.tr',
      password: hashedPassword,
      name: 'Çiftlik Müdürü',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'operator@alabalikcilik.com.tr' },
    update: {},
    create: {
      email: 'operator@alabalikcilik.com.tr',
      password: hashedPassword,
      name: 'Mehmet Balıkçı',
      role: 'OPERATOR',
    },
  });

  const pool1 = await prisma.pool.upsert({
    where: { id: 'pool-beton-01' },
    update: {},
    create: {
      id: 'pool-beton-01',
      name: 'Beton Havuz A1',
      poolType: 'CONCRETE',
      capacity: 5000,
      volume: 120,
      status: 'ACTIVE',
      description: 'Ana üretim havuzu — yetişkin alabalık yetiştirme',
    },
  });

  const pool2 = await prisma.pool.upsert({
    where: { id: 'pool-beton-02' },
    update: {},
    create: {
      id: 'pool-beton-02',
      name: 'Beton Havuz A2',
      poolType: 'CONCRETE',
      capacity: 3000,
      volume: 80,
      status: 'ACTIVE',
      description: 'Genç balık havuzu — parmak boy ve juvenil',
    },
  });

  const pool3 = await prisma.pool.upsert({
    where: { id: 'pool-kanal-01' },
    update: {},
    create: {
      id: 'pool-kanal-01',
      name: 'Kanal Havuz B1',
      poolType: 'RACEWAY',
      capacity: 8000,
      volume: 200,
      status: 'ACTIVE',
      description: 'Akıntılı kanal sistemi — yüksek kapasiteli üretim',
    },
  });

  const pool4 = await prisma.pool.upsert({
    where: { id: 'pool-toprak-01' },
    update: {},
    create: {
      id: 'pool-toprak-01',
      name: 'Toprak Havuz C1',
      poolType: 'EARTHEN',
      capacity: 10000,
      volume: 350,
      status: 'ACTIVE',
      description: 'Doğal toprak havuz — damızlık balıklar',
    },
  });

  await prisma.pool.upsert({
    where: { id: 'pool-bakim-01' },
    update: {},
    create: {
      id: 'pool-bakim-01',
      name: 'Bakım Havuzu D1',
      poolType: 'CONCRETE',
      capacity: 1000,
      volume: 30,
      status: 'MAINTENANCE',
      description: 'Karantina ve bakım amaçlı küçük havuz',
    },
  });

  const stock1 = await prisma.fishStock.upsert({
    where: { id: 'stock-gokkusagi-01' },
    update: {},
    create: {
      id: 'stock-gokkusagi-01',
      poolId: pool1.id,
      species: 'Gökkuşağı Alabalığı',
      ageGroup: 'ADULT',
      count: 4200,
      avgWeight: 350,
      entryDate: new Date('2025-09-15'),
      source: 'Bolu Alabalık Kuluçkahanesi',
      notes: 'Porsiyonluk boyuta yaklaşıyor, hasat planlanıyor',
    },
  });

  const stock2 = await prisma.fishStock.upsert({
    where: { id: 'stock-gokkusagi-02' },
    update: {},
    create: {
      id: 'stock-gokkusagi-02',
      poolId: pool2.id,
      species: 'Gökkuşağı Alabalığı',
      ageGroup: 'JUVENILE',
      count: 2800,
      avgWeight: 120,
      entryDate: new Date('2026-01-20'),
      source: 'Kendi Üretimimiz',
      notes: 'Şubat dönemi juvenil parti',
    },
  });

  await prisma.fishStock.upsert({
    where: { id: 'stock-kaynak-01' },
    update: {},
    create: {
      id: 'stock-kaynak-01',
      poolId: pool3.id,
      species: 'Kaynak Alabalığı',
      ageGroup: 'ADULT',
      count: 6500,
      avgWeight: 280,
      entryDate: new Date('2025-11-10'),
      source: 'Trabzon Su Ürünleri',
      notes: 'Kanal havuzda yoğun beslenme programında',
    },
  });

  await prisma.fishStock.upsert({
    where: { id: 'stock-damizlik-01' },
    update: {},
    create: {
      id: 'stock-damizlik-01',
      poolId: pool4.id,
      species: 'Gökkuşağı Alabalığı',
      ageGroup: 'BROODSTOCK',
      count: 800,
      avgWeight: 2500,
      entryDate: new Date('2024-03-01'),
      source: 'İzmir Su Ürünleri Araştırma',
      notes: 'Damızlık sürü — yumurta üretimi için',
    },
  });

  const feed1 = await prisma.feedType.upsert({
    where: { id: 'feed-baslangic-01' },
    update: {},
    create: {
      id: 'feed-baslangic-01',
      name: 'Başlangıç Yemi 1mm',
      brand: 'Skretting',
      proteinPct: 52,
      fatPct: 18,
      pelletSize: 1.0,
      pricePerKg: 42.50,
      stockKg: 250,
      isActive: true,
    },
  });

  const feed2 = await prisma.feedType.upsert({
    where: { id: 'feed-buyutme-01' },
    update: {},
    create: {
      id: 'feed-buyutme-01',
      name: 'Büyütme Yemi 3mm',
      brand: 'Skretting',
      proteinPct: 45,
      fatPct: 22,
      pelletSize: 3.0,
      pricePerKg: 35.00,
      stockKg: 1200,
      isActive: true,
    },
  });

  await prisma.feedType.upsert({
    where: { id: 'feed-bitirme-01' },
    update: {},
    create: {
      id: 'feed-bitirme-01',
      name: 'Bitirme Yemi 4.5mm',
      brand: 'Coppens',
      proteinPct: 42,
      fatPct: 26,
      pelletSize: 4.5,
      pricePerKg: 38.00,
      stockKg: 800,
      isActive: true,
    },
  });

  await prisma.feedType.upsert({
    where: { id: 'feed-damizlik-01' },
    update: {},
    create: {
      id: 'feed-damizlik-01',
      name: 'Damızlık Yemi 6mm',
      brand: 'BioMar',
      proteinPct: 48,
      fatPct: 20,
      pelletSize: 6.0,
      pricePerKg: 55.00,
      stockKg: 400,
      isActive: true,
    },
  });

  const feedDate = new Date('2026-06-22');
  await prisma.feedLog.upsert({
    where: { id: 'feedlog-01' },
    update: {},
    create: {
      id: 'feedlog-01',
      poolId: pool1.id,
      feedTypeId: feed2.id,
      quantityKg: 45,
      feedDate,
      feedTime: '08:00',
      notes: 'Sabah yemleme — normal porsiyon',
    },
  });

  await prisma.feedLog.upsert({
    where: { id: 'feedlog-02' },
    update: {},
    create: {
      id: 'feedlog-02',
      poolId: pool2.id,
      feedTypeId: feed1.id,
      quantityKg: 18,
      feedDate,
      feedTime: '08:30',
      notes: 'Juvenil havuz sabah yemleme',
    },
  });

  await prisma.feedLog.upsert({
    where: { id: 'feedlog-03' },
    update: {},
    create: {
      id: 'feedlog-03',
      poolId: pool1.id,
      feedTypeId: feed2.id,
      quantityKg: 40,
      feedDate,
      feedTime: '16:00',
      notes: 'Akşam yemleme',
    },
  });

  await prisma.healthRecord.upsert({
    where: { id: 'health-01' },
    update: {},
    create: {
      id: 'health-01',
      stockId: stock1.id,
      recordDate: new Date('2026-06-20'),
      recordType: 'ROUTINE_CHECK',
      inspector: 'Dr. Ayşe Veteriner',
      diagnosis: 'Genel sağlık durumu iyi',
      notes: 'Yüzgeç yapısı normal, deri rengi parlak. Beslenme aktif.',
      mortality: 0,
    },
  });

  await prisma.healthRecord.upsert({
    where: { id: 'health-02' },
    update: {},
    create: {
      id: 'health-02',
      stockId: stock2.id,
      recordDate: new Date('2026-06-18'),
      recordType: 'DISEASE',
      inspector: 'Dr. Ayşe Veteriner',
      diagnosis: 'Hafif yüzgeç çürümesi (Columnaris şüphesi)',
      treatment: 'Potasyum permanganat banyosu 1:100.000 — 30dk, 3 gün',
      notes: 'Az sayıda bireyde görüldü, izolasyon önerildi',
      mortality: 12,
    },
  });

  await prisma.healthRecord.upsert({
    where: { id: 'health-03' },
    update: {},
    create: {
      id: 'health-03',
      stockId: stock2.id,
      recordDate: new Date('2026-06-21'),
      recordType: 'TREATMENT',
      inspector: 'Mehmet Balıkçı',
      diagnosis: 'Tedavi takibi — yüzgeç iyileşmesi gözlendi',
      treatment: 'Potasyum permanganat banyosu son seans',
      notes: 'İyileşme %80 oranında, mortalite durdu',
      mortality: 0,
    },
  });

  await prisma.waterQuality.upsert({
    where: { id: 'wq-01' },
    update: {},
    create: {
      id: 'wq-01',
      poolId: pool1.id,
      measureDate: new Date('2026-06-22T08:00:00Z'),
      temperature: 14.2,
      dissolvedOxygen: 8.5,
      ph: 7.4,
      ammonia: 0.02,
      nitrite: 0.01,
      nitrate: 12.5,
      turbidity: 2.1,
      inspector: 'Mehmet Balıkçı',
      notes: 'Tüm parametreler normal aralıkta',
    },
  });

  await prisma.waterQuality.upsert({
    where: { id: 'wq-02' },
    update: {},
    create: {
      id: 'wq-02',
      poolId: pool2.id,
      measureDate: new Date('2026-06-22T08:15:00Z'),
      temperature: 13.8,
      dissolvedOxygen: 9.1,
      ph: 7.2,
      ammonia: 0.01,
      nitrite: 0.005,
      nitrate: 8.0,
      turbidity: 1.5,
      inspector: 'Mehmet Balıkçı',
    },
  });

  await prisma.waterQuality.upsert({
    where: { id: 'wq-03' },
    update: {},
    create: {
      id: 'wq-03',
      poolId: pool3.id,
      measureDate: new Date('2026-06-22T08:30:00Z'),
      temperature: 15.0,
      dissolvedOxygen: 7.8,
      ph: 7.6,
      ammonia: 0.04,
      nitrite: 0.02,
      nitrate: 18.0,
      turbidity: 3.2,
      inspector: 'Mehmet Balıkçı',
      notes: 'Amonyak hafif yüksek — su değişimi yapıldı',
    },
  });

  await prisma.waterQuality.upsert({
    where: { id: 'wq-04' },
    update: {},
    create: {
      id: 'wq-04',
      poolId: pool4.id,
      measureDate: new Date('2026-06-22T09:00:00Z'),
      temperature: 12.5,
      dissolvedOxygen: 9.8,
      ph: 7.1,
      ammonia: 0.01,
      nitrite: 0.003,
      nitrate: 5.0,
      turbidity: 1.0,
      inspector: 'Mehmet Balıkçı',
      notes: 'Damızlık havuzu — mükemmel su kalitesi',
    },
  });

  await prisma.harvest.upsert({
    where: { harvestCode: 'HST-2026-001' },
    update: {},
    create: {
      harvestCode: 'HST-2026-001',
      poolId: pool1.id,
      harvestDate: new Date('2026-04-15'),
      totalFish: 2000,
      totalWeightKg: 680,
      avgWeightKg: 0.34,
      gradeA: 520,
      gradeB: 140,
      gradeC: 20,
      status: 'COMPLETED',
      notes: 'Nisan hasadı — porsiyonluk taze satış',
    },
  });

  await prisma.harvest.upsert({
    where: { harvestCode: 'HST-2026-002' },
    update: {},
    create: {
      harvestCode: 'HST-2026-002',
      poolId: pool1.id,
      harvestDate: new Date('2026-07-10'),
      totalFish: 2200,
      totalWeightKg: 770,
      avgWeightKg: 0.35,
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      status: 'PLANNED',
      notes: 'Temmuz planlı hasat — kalan stok',
    },
  });

  await prisma.harvest.upsert({
    where: { harvestCode: 'HST-2026-003' },
    update: {},
    create: {
      harvestCode: 'HST-2026-003',
      poolId: pool3.id,
      harvestDate: new Date('2026-05-20'),
      totalFish: 3000,
      totalWeightKg: 840,
      avgWeightKg: 0.28,
      gradeA: 600,
      gradeB: 200,
      gradeC: 40,
      status: 'COMPLETED',
      notes: 'Kaynak alabalığı hasadı — toptan satışa yönlendirildi',
    },
  });

  const customer1 = await prisma.customer.upsert({
    where: { id: 'cust-001' },
    update: {},
    create: {
      id: 'cust-001',
      name: 'Karadeniz Balık Market',
      email: 'siparis@karadenizbalik.com.tr',
      phone: '+90 462 321 4567',
      address: 'Meydan Mahallesi, Liman Caddesi No: 15',
      city: 'Trabzon',
      taxId: '1234567890',
      isActive: true,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'cust-002' },
    update: {},
    create: {
      id: 'cust-002',
      name: 'Ankara Toptan Gıda A.Ş.',
      email: 'satin.alma@ankaratoptan.com.tr',
      phone: '+90 312 456 7890',
      address: 'Macunköy Sanayi, 3. Cadde No: 88',
      city: 'Ankara',
      taxId: '9876543210',
      isActive: true,
    },
  });

  await prisma.customer.upsert({
    where: { id: 'cust-003' },
    update: {},
    create: {
      id: 'cust-003',
      name: 'Bolu Yöresel Restoran',
      email: 'info@boluyoresel.com.tr',
      phone: '+90 374 215 3344',
      address: 'İzzet Baysal Caddesi No: 22',
      city: 'Bolu',
      taxId: '5678901234',
      isActive: true,
    },
  });

  await prisma.sale.upsert({
    where: { saleCode: 'STS-2026-001' },
    update: {},
    create: {
      saleCode: 'STS-2026-001',
      customerId: customer1.id,
      saleDate: new Date('2026-06-15'),
      deliveryDate: new Date('2026-06-16'),
      status: 'DELIVERED',
      totalAmount: 34000,
      notes: 'Haftalık düzenli sipariş — taze alabalık',
      items: {
        create: [
          { product: 'Gökkuşağı Alabalığı (Taze)', quantity: 200, unit: 'kg', unitPrice: 120, total: 24000 },
          { product: 'Kaynak Alabalığı (Taze)', quantity: 100, unit: 'kg', unitPrice: 100, total: 10000 },
        ],
      },
    },
  });

  await prisma.sale.upsert({
    where: { saleCode: 'STS-2026-002' },
    update: {},
    create: {
      saleCode: 'STS-2026-002',
      customerId: customer2.id,
      saleDate: new Date('2026-06-20'),
      status: 'CONFIRMED',
      totalAmount: 48000,
      notes: 'Aylık toptan sipariş',
      items: {
        create: [
          { product: 'Gökkuşağı Alabalığı (Taze)', quantity: 400, unit: 'kg', unitPrice: 120, total: 48000 },
        ],
      },
    },
  });

  await prisma.sale.upsert({
    where: { saleCode: 'STS-2026-003' },
    update: {},
    create: {
      saleCode: 'STS-2026-003',
      customerId: customer1.id,
      saleDate: new Date('2026-06-22'),
      status: 'PENDING',
      totalAmount: 18000,
      notes: 'Ekstra sipariş — yaz sezonu talebi',
      items: {
        create: [
          { product: 'Gökkuşağı Alabalığı (Taze)', quantity: 100, unit: 'kg', unitPrice: 120, total: 12000 },
          { product: 'Alabalık Fileto', quantity: 30, unit: 'kg', unitPrice: 200, total: 6000 },
        ],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
