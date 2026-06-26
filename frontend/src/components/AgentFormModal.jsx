import React, { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

const empty = { matricule: '', nom: '', secteur: '', telephone: '', actif: true };

export default function AgentFormModal({ open, onClose, onSubmit, secteurs, initial }) {
  const { t } = useI18n();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(initial ? { ...initial, secteur: initial.secteur?._id || initial.secteur } : empty);
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-sos-dark mb-4">{initial ? t('modifier') : t('ajouter')} - {t('agents')}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">{t('matricule')}</label>
            <input
              required
              className="input-field"
              value={form.matricule}
              onChange={(e) => setForm({ ...form, matricule: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('nom')}</label>
            <input
              required
              dir="auto"
              className="input-field"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('secteur')}</label>
            <select
              required
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
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.actif}
              onChange={(e) => setForm({ ...form, actif: e.target.checked })}
            />
            {t('actif')}
          </label>
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
