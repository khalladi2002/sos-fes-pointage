import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  UserCog,
  CalendarCheck,
  History,
  FileBarChart,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const isAdmin = user?.role === 'admin';

  const links = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin', 'responsable'] },
    { to: '/pointage', label: t('pointage'), icon: CalendarCheck, roles: ['admin', 'responsable'] },
    { to: '/historique', label: t('historique'), icon: History, roles: ['admin', 'responsable'] },
    { to: '/secteurs', label: t('secteurs'), icon: MapPin, roles: ['admin'] },
    { to: '/agents', label: t('agents'), icon: Users, roles: ['admin'] },
    { to: '/responsables', label: t('responsables'), icon: UserCog, roles: ['admin'] },
    { to: '/rapports', label: t('rapports'), icon: FileBarChart, roles: ['admin', 'responsable'] }
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:static z-40 top-0 h-full w-64 bg-sos-dark text-white transform transition-transform
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <p className="font-bold text-lg leading-tight">SOS FÈS</p>
            <p className="text-xs text-sos-green">Propreté Urbaine</p>
          </div>
          <button className="lg:hidden" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-2">
          {links
            .filter((l) => l.roles.includes(user?.role))
            .map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-sos-green text-white' : 'text-gray-200 hover:bg-white/10'
                  }`
                }
              >
                <l.icon size={18} />
                {l.label}
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  );
}
