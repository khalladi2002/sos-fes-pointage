import React, { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

const empty = { nom: '', responsable: '' };

export default function SecteurFormModal({ open, onClose, onSubmit, responsables, initial }) {
  const { t } = useI18n();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(initial ? { nom: initial.nom, responsable: initial.responsable?._id || '' } : empty);
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-sos-dark mb-4">{initial ? t('modifier') : t('ajouter')} - {t('secteurs')}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">{t('nom')}</label>
            <input
              required
              className="input-field"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('responsable')}</label>
            <select
              className="input-field"
              value={form.responsable}
              onChange={(e) => setForm({ ...form, responsable: e.target.value })}
            >
              <option value="">--</option>
              {responsables.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.nom}
                </option>
              ))}
            </select>
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
