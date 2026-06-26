const PDFDocument = require('pdfkit');

// Génère le registre de pointage PDF (format papier SOS Fès)
// data: { secteurNom, date, lignes: [{ matricule, nom, heureEntree, heureSortie, statut }] }
function generatePointagePdf(res, data) {
  const { secteurNom, date, lignes } = data;
  const doc = new PDFDocument({ size: 'A4', margin: 30 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=registre_${secteurNom}_${date}.pdf`);
  doc.pipe(res);

  // En-tête
  doc.fontSize(16).fillColor('#0B3D66').text('SOS FÈS - Propreté Urbaine', { align: 'center' });
  doc.fontSize(13).fillColor('#1f7a3d').text('Registre de Pointage Journalier', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#000');
  doc.text(`Secteur : ${secteurNom}        Date : ${date}`, { align: 'left' });
  doc.moveDown(1);

  const startX = 30;
  let y = doc.y;
  const colWidths = [55, 150, 65, 75, 65, 75, 60]; // Matricule, Nom, HEntree, Signature, HSortie, Signature, Jour/Repos
  const headers = ['Matricule', 'Nom', 'H. Entrée', 'Signature', 'H. Sortie', 'Signature', 'Jour/Repos'];

  const drawRow = (cells, isHeader = false) => {
    let x = startX;
    const rowHeight = 24;
    doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(9);
    cells.forEach((cell, i) => {
      doc.rect(x, y, colWidths[i], rowHeight).stroke('#888');
      doc.fillColor(isHeader ? '#0B3D66' : '#000').text(String(cell), x + 3, y + 7, {
        width: colWidths[i] - 6,
        align: 'center'
      });
      x += colWidths[i];
    });
    y += rowHeight;
  };

  drawRow(headers, true);

  lignes.forEach((l) => {
    const jourRepos = l.statut === 'Repos' ? 'Repos' : l.statut === 'Présent' ? 'Jour' : l.statut;
    if (y > 760) {
      doc.addPage();
      y = 40;
      drawRow(headers, true);
    }
    drawRow([l.matricule, l.nom, l.heureEntree || '-', '', l.heureSortie || '-', '', jourRepos]);
  });

  doc.moveDown(2);
  doc.fontSize(9).fillColor('#000').text('Signature du Responsable de secteur : _________________________', startX, y + 20);

  doc.end();
}

module.exports = { generatePointagePdf };
