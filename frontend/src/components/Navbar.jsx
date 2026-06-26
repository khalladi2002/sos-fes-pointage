import React from 'react';
import { Menu, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { t, toggleLang, lang } = useI18n();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-sos-dark" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-sos-dark text-lg hidden sm:block">{t('appName')}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-sos-dark"
          title="Changer de langue / تغيير اللغة"
        >
          <Globe size={18} />
          <span>{lang === 'fr' ? 'العربية' : 'Français'}</span>
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-700">{user?.nom}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        <button onClick={logout} className="text-gray-500 hover:text-red-600" title={t('logout')}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
