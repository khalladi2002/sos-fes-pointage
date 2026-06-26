import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';

const todayStr = () => new Date().toISOString().slice(0, 10);
const minus30 = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
};

const statutColors = {
  Présent: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Repos: 'bg-blue-100 text-blue-700',
  Congé: 'bg-amber-100 text-amber-700',
  Maladie: 'bg-purple-100 text-purple-700'
};

export default function Historique() {
  const { user } = useAuth();
  const { t } = useI18n();
  const isAdmin = user?.role === 'admin';

  const [secteurs, setSecteurs] = useState([]);
  const [secteurId, setSecteurId] = useState('');
  const [from, setFrom] = useState(minus30());
  const [to, setTo] = useState(todayStr());
  const [pointages, setPointages] = useState([]);

  useEffect(() => {
    if (isAdmin) api.get('/secteurs').then((res) => setSecteurs(res.data));
  }, [isAdmin]);

  const load = async () => {
    const params = { from, to };
    if (isAdmin && secteurId) params.secteur = secteurId;
    const res = await api.get('/pointages', { params });
    setPointages(res.data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [from, to, secteurId]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-sos-dark">{t('historique')}</h2>

      <div className="card flex flex-wrap items-end gap-4">
        {isAdmin && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">{t('secteur')}</label>
            <select className="input-field w-52" value={secteurId} onChange={(e) => setSecteurId(e.target.value)}>
              <option value="">Tous les secteurs</option>
              {secteurs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Du</label>
          <input type="date" className="input-field w-40" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Au</label>
          <input type="date" className="input-field w-40" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="pointage-table w-full">
          <thead className="bg-sos-dark text-white">
            <tr>
              <th>{t('date')}</th>
              <th>{t('matricule')}</th>
              <th>{t('nom')}</th>
              {isAdmin && <th>{t('secteur')}</th>}
              <th>{t('statut')}</th>
              <th>{t('heureEntree')}</th>
              <th>{t('heureSortie')}</th>
              <th>{t('observation')}</th>
            </tr>
          </thead>
          <tbody>
            {pointages.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td>{p.date}</td>
                <td className="font-mono">{p.agent?.matricule}</td>
                <td dir="auto">{p.agent?.nom}</td>
                {isAdmin && <td>{p.secteur?.nom}</td>}
                <td>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${statutColors[p.statut]}`}>
                    {p.statut}
                  </span>
                </td>
                <td>{p.heureEntree || '-'}</td>
                <td>{p.heureSortie || '-'}</td>
                <td>{p.observation || '-'}</td>
              </tr>
            ))}
            {pointages.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="text-center text-gray-400 py-6">
                  Aucun pointage sur cette période.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
