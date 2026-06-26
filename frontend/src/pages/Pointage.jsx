import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PointageTable from '../components/PointageTable';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { Save } from 'lucide-react';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Pointage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const isAdmin = user?.role === 'admin';

  const [secteurs, setSecteurs] = useState([]);
  const [secteurId, setSecteurId] = useState(isAdmin ? '' : user?.secteur?._id);
  const [date, setDate] = useState(todayStr());
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      api.get('/secteurs').then((res) => setSecteurs(res.data));
    }
  }, [isAdmin]);

  useEffect(() => {
    const sId = isAdmin ? secteurId : user?.secteur?._id;
    if (!sId) return;
    setLoading(true);
    Promise.all([
      api.get('/agents', { params: { secteur: sId, actif: true } }),
      api.get('/pointages', { params: { secteur: sId, date } })
    ]).then(([agentsRes, pointagesRes]) => {
      const existing = pointagesRes.data;
      const merged = agentsRes.data.map((a) => {
        const p = existing.find((pt) => pt.agent._id === a._id);
        return {
          agentId: a._id,
          matricule: a.matricule,
          nom: a.nom,
          statut: p?.statut || 'Présent',
          heureEntree: p?.heureEntree || '06:00',
          heureSortie: p?.heureSortie || '14:00',
          observation: p?.observation || ''
        };
      });
      setRows(merged);
      setLoading(false);
    });
  }, [secteurId, date, isAdmin, user]);

  const handleSave = async () => {
    const sId = isAdmin ? secteurId : user?.secteur?._id;
    if (!sId) return;
    const payload = {
      secteur: sId,
      date,
      pointages: rows.map((r) => ({
        agent: r.agentId,
        statut: r.statut,
        heureEntree: r.heureEntree,
        heureSortie: r.heureSortie,
        observation: r.observation
      }))
    };
    await api.post('/pointages/bulk', payload);
    setMessage(t('save_success'));
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-sos-dark">{t('pointage')}</h2>

      <div className="card flex flex-wrap items-end gap-4">
        {isAdmin && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">{t('secteur')}</label>
            <select className="input-field w-52" value={secteurId} onChange={(e) => setSecteurId(e.target.value)}>
              <option value="">{t('choisirSecteur')}</option>
              {secteurs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('date')}</label>
          <input type="date" className="input-field w-44" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button onClick={handleSave} className="btn-success flex items-center gap-2" disabled={!rows.length}>
          <Save size={16} /> {t('enregistrer')}
        </button>
        {message && <span className="text-sos-green text-sm font-medium">{message}</span>}
      </div>

      <div className="card">
        {loading ? (
          <p className="text-sm text-gray-400">Chargement...</p>
        ) : rows.length ? (
          <PointageTable rows={rows} onChange={setRows} />
        ) : (
          <p className="text-sm text-gray-400">
            {isAdmin ? 'Sélectionnez un secteur pour commencer le pointage.' : 'Aucun agent trouvé.'}
          </p>
        )}
      </div>
    </div>
  );
}
