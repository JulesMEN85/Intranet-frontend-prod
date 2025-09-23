import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getISOWeek, parse } from "date-fns";

const exportDataSelected = async ({data, rowSelection}) => {
  const arrayItem = [];
  for (const key in rowSelection) {
    const adresse = `${data[key].rue}\n ${data[key].codePostal} ${data[key].ville}`;
    const remarque = `${data[key].notes}\n ${data[key].adresse}`;
    arrayItem.push({...data[key], rue: adresse, notes: remarque, comSandrine: ''});
  }

  const groupedByTransporter = arrayItem.reduce((acc, obj) => {
    if (!acc[obj.zonelivr]) {
      acc[obj.zonelivr] = [];
    }
    acc[obj.zonelivr].push(obj);
    return acc;
  }, {});
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('sheet', {
   pageSetup:{paperSize: 9, orientation:'landscape'}
  });
    

  let weekNumber = arrayItem[0].dlivraison.split('/');
  const year = weekNumber[2];
  const month = weekNumber[1];
  const day = weekNumber[0];
  const dateIso = parse(`${month}/${day}/${year}`, 'MM/dd/yyyy', new Date())
  weekNumber = getISOWeek(dateIso);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const stringDay = dateIso.toLocaleDateString('fr-FR', options);

  let index = 7;
  let indexArray = 0;
  for (const key in groupedByTransporter) {
    // chaque pages du tableau
    const transporteur = groupedByTransporter[key][0].zonelivr;

    worksheet.getCell(`A${index - 6}`).value = 'STE LALLEMANT 52';
    worksheet.getCell(`A${index - 5}`).value = 'IS EN BASSIGNY';
    worksheet.getCell(`A${index - 4}`).value = 'Sandrine PARISOT';
    worksheet.getCell(`A${index - 3}`).value = 'TEL: 03 25 31 50 56';

    worksheet.getCell(`C${index - 6}`).value = 'Programme de chargement semaine:';
    worksheet.getCell(`C${index - 6}`).font = { bold: true, size: 15 };
    worksheet.mergeCells(`C${index - 6}:E${index - 6}`);
    worksheet.getCell(`F${index - 6}`).value = weekNumber;
    worksheet.getCell(`F${index - 6}`).font = { bold: true, size: 15 };

    worksheet.getCell(`C${index - 5}`).value = 'Tournée n°:';
    worksheet.getCell(`C${index - 5}`).font = { bold: true };
    worksheet.mergeCells(`C${index - 5}:D${index - 5}`);

    worksheet.getCell(`C${index - 4}`).value = `Jour:`;
    worksheet.getCell(`C${index - 4}`).font = { bold: true };
    worksheet.mergeCells(`C${index - 4}:D${index - 4}`);
    worksheet.getCell(`F${index - 4}`).value = stringDay;
    worksheet.getCell(`F${index - 4}`).font = { bold: true };
    worksheet.mergeCells(`F${index - 4}:G${index - 4}`);

    worksheet.getCell(`C${index - 3}`).value = `Transporteur:`;
    worksheet.getCell(`C${index - 3}`).font = { bold: true };
    worksheet.mergeCells(`C${index - 3}:D${index - 3}`);
    worksheet.getCell(`F${index - 3}`).value = transporteur;
    worksheet.getCell(`F${index - 3}`).font = { bold: true };
    worksheet.mergeCells(`F${index - 3}:G${index - 3}`);

    worksheet.getCell(`F${index - 2}`).value = 'Forfait:';
    worksheet.getCell(`F${index - 2}`).font = { bold: true };
  

    // Définir l'en-tête du tableau de données
    worksheet.getRow(index).values = ['N° CDE interne', 'Ref Cde Tiers', 'Client à Livrer', 'Série', 'M.Plancher', 'Code Client', 'Remarques', 'Notes'];
    worksheet.getRow(index).font = { bold: true };
  
    // Ajuster la largeur des colonnes
    worksheet.columns = [
      { key: 'numero', width: 17 },
      { key: 'reference', width: 15 },
      { key: 'rue', width: 20 },
      { key: 'Serie', width: 19 },
      { key: 'metrage', width: 14 },
      { key: 'client', width: 13 },
      { key: 'notes', width: 22 },
      { key: 'comSandrine', width: 10}
    ];

    for (const item of groupedByTransporter[key]) {
      index++;
      worksheet.addRow(item).commit();
      // chaque lignes du tableau
    }

    // Application de bordures aux cellules
    workbook.eachSheet((worksheet) => {
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        if (row.number >= (index - groupedByTransporter[key].length)){
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
          row.eachCell({ includeEmpty: false }, (cell) => {
            cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
          });
        }
      });
    });

    //Force une nouvelle page pour l'impression, sauf pour le dernier tableau
    if (indexArray < Object.keys(groupedByTransporter).length - 1) {
      worksheet.getRow(index).addPageBreak();
    }
  
    // rajoute un espace pour le future tableau
    index = index + 7;

    indexArray++;

  }

  // Génération du fichier Excel en tant que Blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Utilisation de file-saver pour télécharger le fichier
  saveAs(blob, 'RelanceEXP.xlsx');

};

export default exportDataSelected;