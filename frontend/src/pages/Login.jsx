import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { Globe } from 'lucide-react';

export default function Login() {
  const { login, loading, error } = useAuth();
  const { t, toggleLang, lang } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sos-dark to-sos-blue px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-sos-green flex items-center justify-center text-white font-bold text-xl">
            SF
          </div>
          <h1 className="mt-3 text-xl font-bold text-sos-dark">{t('appName')}</h1>
          <p className="text-xs text-gray-500 mt-1">Propreté Urbaine - Fès</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-2 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500">{t('username')}</label>
            <input
              required
              autoFocus
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('password')}</label>
            <input
              required
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button disabled={loading} type="submit" className="btn-primary w-full justify-center flex">
            {loading ? '...' : t('loginBtn')}
          </button>
        </form>

        <button
          onClick={toggleLang}
          className="flex items-center gap-1 text-xs text-gray-500 mt-5 mx-auto hover:text-sos-dark"
        >
          <Globe size={14} /> {lang === 'fr' ? 'العربية' : 'Français'}
        </button>
      </div>
    </div>
  );
}
