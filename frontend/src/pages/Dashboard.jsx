import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Coffee, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import PresenceParJourChart from '../components/charts/PresenceParJourChart';
import PresenceParSecteurChart from '../components/charts/PresenceParSecteurChart';
import AbsencesMensuellesChart from '../components/charts/AbsencesMensuellesChart';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [overview, setOverview] = useState(null);
  const [parJour, setParJour] = useState([]);
  const [parSecteur, setParSecteur] = useState([]);
  const [absencesMois, setAbsencesMois] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [o, j, s, m, a] = await Promise.all([
        api.get('/stats/overview'),
        api.get('/stats/presence-par-jour?days=14'),
        api.get('/stats/presence-par-secteur'),
        api.get('/stats/absences-mensuelles?months=6'),
        api.get('/pointages/alerts')
      ]);
      setOverview(o.data);
      setParJour(j.data);
      setParSecteur(s.data);
      setAbsencesMois(m.data);
      setAlerts(a.data);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-sos-dark">{t('dashboard')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title={t('totalAgents')} value={overview?.totalAgents ?? '-'} icon={Users} />
        <StatCard title={t('presentsAuj')} value={overview?.presents ?? '-'} icon={UserCheck} />
        <StatCard title={t('absentsAuj')} value={overview?.absents ?? '-'} icon={UserX} />
        <StatCard title={t('enRepos')} value={overview?.repos ?? '-'} icon={Coffee} />
        <StatCard title={t('tauxPresence')} value={overview?.tauxPresence ?? '-'} suffix="%" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-sos-dark mb-3">{t('presenceParJour')}</h3>
          <PresenceParJourChart data={parJour} />
        </div>
        {user?.role === 'admin' && (
          <div className="card">
            <h3 className="font-semibold text-sos-dark mb-3">{t('presenceParSecteur')}</h3>
            <PresenceParSecteurChart data={parSecteur} />
          </div>
        )}
        <div className="card">
          <h3 className="font-semibold text-sos-dark mb-3">{t('absencesMensuelles')}</h3>
          <AbsencesMensuellesChart data={absencesMois} />
        </div>

        <div className="card">
          <h3 className="font-semibold text-sos-dark mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> {t('alertes')}
          </h3>
          {alerts.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune alerte.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
              {alerts.map((a, i) => (
                <li key={i} className="flex justify-between border-b border-gray-100 pb-1">
                  <span>
                    {a.matricule} - {a.agent}
                  </span>
                  <span className="text-amber-600 font-medium">
                    {a.type === 'absence_consecutive' && `${a.jours} j. absence consécutive`}
                    {a.type === 'retards_frequents' && `${a.nombre} retards`}
                    {a.type === 'sans_pointage' && `Sans pointage aujourd'hui`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
