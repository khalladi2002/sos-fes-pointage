import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import SecteurFormModal from '../components/SecteurFormModal';
import { useI18n } from '../i18n/I18nContext';

export default function Secteurs() {
  const { t } = useI18n();
  const [secteurs, setSecteurs] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [s, r] = await Promise.all([api.get('/secteurs'), api.get('/users?role=responsable')]);
    setSecteurs(s.data);
    setResponsables(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form) => {
    if (editing) await api.put(`/secteurs/${editing._id}`, form);
    else await api.post('/secteurs', form);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce secteur ?')) return;
    try {
      await api.delete(`/secteurs/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-sos-dark">{t('secteurs')}</h2>
        <button
          className="btn-success flex items-center gap-2"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> {t('ajouter')}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="pointage-table w-full">
          <thead className="bg-sos-dark text-white">
            <tr>
              <th>{t('nom')}</th>
              <th>{t('responsable')}</th>
              <th>{t('nbAgents')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {secteurs.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="font-medium">{s.nom}</td>
                <td>{s.responsable?.nom || '-'}</td>
                <td>{s.nbAgents}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(s);
                        setModalOpen(true);
                      }}
                      className="text-sos-blue hover:text-sos-dark"
                    >
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SecteurFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        responsables={responsables}
        initial={editing}
      />
    </div>
  );
}
