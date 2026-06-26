import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { FileText, FileSpreadsheet } from 'lucide-react';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Rapports() {
  const { user } = useAuth();
  const { t } = useI18n();
  const isAdmin = user?.role === 'admin';

  const [secteurs, setSecteurs] = useState([]);
  const [secteurId, setSecteurId] = useState(isAdmin ? '' : user?.secteur?._id);
  const [date, setDate] = useState(todayStr());
  const [excelType, setExcelType] = useState('date');
  const [from, setFrom] = useState(todayStr());
  const [to, setTo] = useState(todayStr());

  useEffect(() => {
    if (isAdmin) api.get('/secteurs').then((res) => setSecteurs(res.data));
  }, [isAdmin]);

  const downloadFile = async (url, filename) => {
    const res = await api.get(url, { responseType: 'blob' });
    const blobUrl = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePdf = () => {
    const sId = isAdmin ? secteurId : user?.secteur?._id;
    if (!sId) return alert('Veuillez choisir un secteur.');
    downloadFile(`/reports/pdf?secteur=${sId}&date=${date}`, `registre_${date}.pdf`);
  };

  const handleExcel = () => {
    let url = `/reports/excel?type=${excelType}`;
    if (excelType === 'date') url += `&date=${date}`;
    if (excelType === 'secteur') url += `&secteur=${isAdmin ? secteurId : user?.secteur?._id}`;
    if (excelType !== 'date') url += `&from=${from}&to=${to}`;
    downloadFile(url, `pointages_${excelType}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-sos-dark">{t('rapports')}</h2>

      <div className="card space-y-4">
        <h3 className="font-semibold text-sos-dark flex items-center gap-2">
          <FileText size={18} /> Registre de pointage (PDF)
        </h3>
        <div className="flex flex-wrap items-end gap-4">
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
          <button onClick={handlePdf} className="btn-primary flex items-center gap-2">
            <FileText size={16} /> {t('exportPdf')}
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-sos-dark flex items-center gap-2">
          <FileSpreadsheet size={18} /> Export Excel
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Type</label>
            <select className="input-field w-52" value={excelType} onChange={(e) => setExcelType(e.target.value)}>
              <option value="date">Par date</option>
              <option value="secteur">Par secteur</option>
              <option value="agent">Par agent (période)</option>
            </select>
          </div>
          {excelType === 'date' && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('date')}</label>
              <input type="date" className="input-field w-44" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          )}
          {excelType !== 'date' && (
            <>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Du</label>
                <input type="date" className="input-field w-40" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Au</label>
                <input type="date" className="input-field w-40" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </>
          )}
          {excelType === 'secteur' && isAdmin && (
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
          <button onClick={handleExcel} className="btn-success flex items-center gap-2">
            <FileSpreadsheet size={16} /> {t('exportExcel')}
          </button>
        </div>
      </div>
    </div>
  );
}
