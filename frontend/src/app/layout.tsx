import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TroutBasin — Alabalık Çiftliği Yönetim Platformu',
  description: 'Alabalık ve su ürünleri çiftlikleri için havuz yönetimi, stok takibi, yem programı ve satış platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-ocean-50 text-depth-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
