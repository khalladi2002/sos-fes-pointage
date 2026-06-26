import React from 'react';
import { useI18n } from '../i18n/I18nContext';

const statuts = ['Présent', 'Absent', 'Repos', 'Congé', 'Maladie'];
const statutColors = {
  Présent: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Repos: 'bg-blue-100 text-blue-700',
  Congé: 'bg-amber-100 text-amber-700',
  Maladie: 'bg-purple-100 text-purple-700'
};

// rows: [{ agentId, matricule, nom, statut, heureEntree, heureSortie, observation }]
export default function PointageTable({ rows, onChange, readOnly = false }) {
  const { t } = useI18n();

  const update = (idx, field, value) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <div className="overflow-x-auto">
      <table className="pointage-table w-full min-w-[800px]">
        <thead className="bg-sos-dark text-white">
          <tr>
            <th>{t('matricule')}</th>
            <th>{t('nom')}</th>
            <th>{t('statut')}</th>
            <th>{t('heureEntree')}</th>
            <th>{t('heureSortie')}</th>
            <th>{t('observation')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.agentId} className="hover:bg-gray-50">
              <td className="font-mono">{row.matricule}</td>
              <td className="whitespace-nowrap">{row.nom}</td>
              <td>
                <select
                  disabled={readOnly}
                  value={row.statut}
                  onChange={(e) => update(idx, 'statut', e.target.value)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold border-0 ${statutColors[row.statut]}`}
                >
                  {statuts.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  disabled={readOnly || row.statut !== 'Présent'}
                  type="time"
                  value={row.heureEntree || ''}
                  onChange={(e) => update(idx, 'heureEntree', e.target.value)}
                  className="input-field py-1"
                />
              </td>
              <td>
                <input
                  disabled={readOnly || row.statut !== 'Présent'}
                  type="time"
                  value={row.heureSortie || ''}
                  onChange={(e) => update(idx, 'heureSortie', e.target.value)}
                  className="input-field py-1"
                />
              </td>
              <td>
                <input
                  disabled={readOnly}
                  type="text"
                  value={row.observation || ''}
                  onChange={(e) => update(idx, 'observation', e.target.value)}
                  className="input-field py-1"
                  placeholder="..."
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
