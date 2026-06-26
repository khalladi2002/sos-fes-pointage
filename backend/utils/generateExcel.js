const ExcelJS = require('exceljs');

// Génère un export Excel à partir d'une liste de pointages peuplés (agent, secteur)
async function generatePointageExcel(res, pointages, titre = 'export') {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SOS Fès';
  const sheet = workbook.addWorksheet('Pointages');

  sheet.columns = [
    { header: 'Matricule', key: 'matricule', width: 12 },
    { header: 'Nom', key: 'nom', width: 30 },
    { header: 'Secteur', key: 'secteur', width: 16 },
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Statut', key: 'statut', width: 12 },
    { header: "Heure d'entrée", key: 'heureEntree', width: 14 },
    { header: 'Heure de sortie', key: 'heureSortie', width: 14 },
    { header: 'Observation', key: 'observation', width: 30 }
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B3D66' } };

  pointages.forEach((p) => {
    sheet.addRow({
      matricule: p.agent?.matricule || '',
      nom: p.agent?.nom || '',
      secteur: p.secteur?.nom || '',
      date: p.date,
      statut: p.statut,
      heureEntree: p.heureEntree,
      heureSortie: p.heureSortie,
      observation: p.observation
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${titre}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { generatePointageExcel };
