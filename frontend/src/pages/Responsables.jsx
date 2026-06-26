import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import UserFormModal from '../components/UserFormModal';
import { useI18n } from '../i18n/I18nContext';

export default function Responsables() {
  const { t } = useI18n();
  const [users, setUsers] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [u, s] = await Promise.all([api.get('/users?role=responsable'), api.get('/secteurs')]);
    setUsers(u.data);
    setSecteurs(s.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form) => {
    const payload = { ...form };
    if (editing && !payload.password) delete payload.password;
    if (editing) await api.put(`/users/${editing._id}`, payload);
    else await api.post('/users', payload);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce responsable ?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-sos-dark">{t('responsables')}</h2>
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
              <th>{t('username')}</th>
              <th>{t('secteur')}</th>
              <th>{t('telephone')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td>{u.nom}</td>
                <td className="font-mono">{u.username}</td>
                <td>{u.secteur?.nom || '-'}</td>
                <td>{u.telephone || '-'}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(u);
                        setModalOpen(true);
                      }}
                      className="text-sos-blue hover:text-sos-dark"
                    >
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        secteurs={secteurs}
        initial={editing}
      />
    </div>
  );
}
