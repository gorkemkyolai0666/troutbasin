# TroutBasin — Deployment Dökümanı

## Altyapı
- **Backend**: Railway (NestJS + Prisma + PostgreSQL)
- **Frontend**: Vercel (Next.js)
- **Veritabanı**: Railway PostgreSQL 16

## URL'ler
- Frontend: https://troutbasin.vercel.app
- Backend API: https://troutbasin-backend-production.up.railway.app/api
- Health Check: https://troutbasin-backend-production.up.railway.app/api/health

## Demo Hesabı
- E-posta: demo@alabalikcilik.com.tr
- Şifre: demo123456

## Ortam Değişkenleri

### Backend (Railway)
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — Vercel frontend URL
- `PORT` — 8080

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` — Railway backend URL + /api

## CI/CD
- Push to main -> GitHub Actions CI
- Backend: npm install (legacy-peer-deps), prisma migrate, build, test, integration
- Frontend: npm install, build
- Provision: Railway + Vercel otomatik sağlama

## Portlar
- Backend: 4620 (development), 8080 (Railway production)
- Frontend: 3620 (development), Vercel otomatik
