# TroutBasin — Mimari Dökümanı

## Teknoloji Yığını

### Backend
- **Framework**: NestJS 10.x
- **ORM**: Prisma 5.x
- **Veritabanı**: PostgreSQL 16
- **Auth**: JWT + Passport
- **Port**: 4620 (dev) / 8080 (prod)

### Frontend
- **Framework**: Next.js 14.x (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS 3.x
- **İkonlar**: Lucide React

## API Yapısı
Tüm endpointler `/api` global prefix kullanır.

### Auth
- `POST /api/auth/register` (201)
- `POST /api/auth/login` (200)
- `GET /api/auth/profile` (JWT korumalı)

### Health
- `GET /api/health` (200)

### Havuzlar
- `GET /api/pools` | `POST /api/pools` | `GET /api/pools/:id` | `PUT /api/pools/:id` | `DELETE /api/pools/:id`
- `GET /api/pools/stats`

### Balık Stoku
- `GET /api/stocks` | `POST /api/stocks` | `GET /api/stocks/:id` | `PUT /api/stocks/:id` | `DELETE /api/stocks/:id`
- `GET /api/stocks/summary`

### Yem
- `GET /api/feed/types` | `POST /api/feed/types` | `PUT /api/feed/types/:id`
- `GET /api/feed/logs` | `POST /api/feed/logs`
- `GET /api/feed/stats`

### Sağlık
- `GET /api/health-records` | `POST /api/health-records`
- `GET /api/health-records/stats`

### Su Kalitesi
- `GET /api/water-quality` | `POST /api/water-quality`
- `GET /api/water-quality/latest`
- `GET /api/water-quality/averages`

### Hasat
- `GET /api/harvests` | `POST /api/harvests` | `GET /api/harvests/:id` | `PUT /api/harvests/:id` | `DELETE /api/harvests/:id`
- `GET /api/harvests/stats`

### Müşteriler
- `GET /api/customers` | `POST /api/customers` | `GET /api/customers/:id` | `PUT /api/customers/:id`

### Satışlar
- `GET /api/sales` | `POST /api/sales` | `GET /api/sales/:id` | `PUT /api/sales/:id`
- `GET /api/sales/stats`

## Veritabanı Modelleri
User, Pool, FishStock, FeedType, FeedLog, HealthRecord, WaterQuality, Harvest, Customer, Sale, SaleItem
