import React, { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

const empty = { nom: '', username: '', password: '', role: 'responsable', secteur: '', telephone: '', actif: true };

export default function UserFormModal({ open, onClose, onSubmit, secteurs, initial }) {
  const { t } = useI18n();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(
      initial
        ? { ...initial, secteur: initial.secteur?._id || initial.secteur || '', password: '' }
        : empty
    );
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-sos-dark mb-4">
          {initial ? t('modifier') : t('ajouter')} - {t('responsables')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">{t('nom')}</label>
            <input required className="input-field" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('username')}</label>
            <input
              required
              className="input-field"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              {t('password')} {initial && '(laisser vide pour ne pas changer)'}
            </label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!initial}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('secteur')}</label>
            <select
              className="input-field"
              value={form.secteur}
              onChange={(e) => setForm({ ...form, secteur: e.target.value })}
            >
              <option value="">{t('choisirSecteur')}</option>
              {secteurs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('telephone')}</label>
            <input
              className="input-field"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('annuler')}
            </button>
            <button type="submit" className="btn-primary">
              {t('enregistrer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
