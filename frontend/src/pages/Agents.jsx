import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '../api/axios';
import AgentFormModal from '../components/AgentFormModal';
import { useI18n } from '../i18n/I18nContext';

export default function Agents() {
  const { t } = useI18n();
  const [agents, setAgents] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSecteur, setFilterSecteur] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const params = {};
    if (search) params.search = search;
    if (filterSecteur) params.secteur = filterSecteur;
    const [a, s] = await Promise.all([api.get('/agents', { params }), api.get('/secteurs')]);
    setAgents(a.data);
    setSecteurs(s.data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [search, filterSecteur]);

  const handleSubmit = async (form) => {
    if (editing) await api.put(`/agents/${editing._id}`, form);
    else await api.post('/agents', form);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet agent ?')) return;
    await api.delete(`/agents/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-bold text-sos-dark">{t('agents')}</h2>
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

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            className="input-field pl-9 w-56"
            placeholder={t('rechercher')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-52" value={filterSecteur} onChange={(e) => setFilterSecteur(e.target.value)}>
          <option value="">{t('choisirSecteur')}</option>
          {secteurs.map((s) => (
            <option key={s._id} value={s._id}>
              {s.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="pointage-table w-full">
          <thead className="bg-sos-dark text-white">
            <tr>
              <th>{t('matricule')}</th>
              <th>{t('nom')}</th>
              <th>{t('secteur')}</th>
              <th>{t('telephone')}</th>
              <th>{t('actif')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="font-mono">{a.matricule}</td>
                <td dir="auto">{a.nom}</td>
                <td>{a.secteur?.nom}</td>
                <td>{a.telephone || '-'}</td>
                <td>{a.actif ? '✅' : '❌'}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(a);
                        setModalOpen(true);
                      }}
                      className="text-sos-blue hover:text-sos-dark"
                    >
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(a._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        secteurs={secteurs}
        initial={editing}
      />
    </div>
  );
}
