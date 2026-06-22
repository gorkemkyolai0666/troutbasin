'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login({ email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-950 via-ocean-900 to-depth-900 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-aqua-cyan rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-ocean-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-aqua-green rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-ocean-500 to-aqua-cyan text-white mb-4 shadow-lg shadow-ocean-500/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TroutBasin</h1>
          <p className="text-ocean-300 mt-2 text-sm">Alabalık Çiftliği Yönetim Platformu</p>
        </div>

        <div className="bg-depth-800/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 p-8 border border-depth-700/50">
          <h2 className="text-lg font-semibold text-depth-100 mb-6">Hesabınıza giriş yapın</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-aqua-red/10 border border-aqua-red/30 text-aqua-red text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-depth-300 mb-1.5">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-depth-600 bg-depth-900/50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all text-white placeholder:text-depth-500"
                placeholder="demo@alabalikcilik.com.tr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-depth-300 mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-depth-600 bg-depth-900/50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all text-white placeholder:text-depth-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-ocean-600 to-aqua-cyan hover:from-ocean-500 hover:to-ocean-600 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ocean-600/25"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-depth-700/50">
            <p className="text-xs text-depth-500 text-center">
              Demo: demo@alabalikcilik.com.tr / demo123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
