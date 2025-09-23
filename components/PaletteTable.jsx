'use client';

import React, { useState, useEffect } from 'react';

const PaletteTable = ({ data }) => {
    const [paletteData, setPaletteData] = useState([]);
    const [extraColumns, setExtraColumns] = useState([]); // Colonnes dynamiques
  
    useEffect(() => {
      if (data && data.length > 0) {
        setPaletteData(data.map(() => ({ palette1: '', palette2: '' })));
      }
    }, [data]);

  const handleAddColumn = () => {
    const newColumnName = `Palette HS ${extraColumns.length + 1}`;
    setExtraColumns([...extraColumns, newColumnName]);
    setPaletteData((prevData) =>
      prevData.map((item) => ({ ...item, [newColumnName]: '' }))
    );
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...paletteData];
    updatedData[index][field] = value;
    setPaletteData(updatedData);
  };

  const calculateTotalPalettes = (column) => {
    const uniqueValues = new Set(
      paletteData
        .map((item) => item[column])
        .filter((value) => value && !isNaN(value))
    );
    return uniqueValues.size;
  };

  const totalPalette1 = calculateTotalPalettes('palette1');
  const totalPalette2 = calculateTotalPalettes('palette2');
  const totalExtraColumns = extraColumns.map((colName) =>
    calculateTotalPalettes(colName)
  );

  const exportToCSV = () => {
    const headers = [
      { label: 'Numéro de Commande', key: 'Num_Cde' },
      { label: 'Date de Livraison', key: 'Date_Livraison' },
      { label: 'Zone de Livraison', key: 'Zone_Livraison' }, // Nouvelle colonne
      { label: 'Client', key: 'nom' }, // Nouvelle colonne
      { label: 'Repère', key: 'Repere' },
      { label: 'Système', key: 'systeme' },
      { label: 'Désignation', key: 'Designation' },
      { label: 'Quantité', key: 'Quantite' },
      { label: 'Nombre de Panneaux', key: 'Nb_Vtx_Pan_Par_Repere' },
      { label: 'Hauteur', key: 'Hauteur' },
      { label: 'Largeur', key: 'Largeur' },
      { label: 'Palette 1m', key: 'palette1' },
      { label: 'Palette 0.80m', key: 'palette2' },
      ...extraColumns.map((colName) => ({ label: colName, key: colName })),
    ];
  
    const rows = data.map((item, index) => {
      const row = {
        ...item,
        palette1: paletteData[index]?.palette1 || '',
        palette2: paletteData[index]?.palette2 || '',
      };
  
      extraColumns.forEach((colName) => {
        row[colName] = paletteData[index]?.[colName] || '';
      });
  
      return headers.map(({ key }) => row[key] || '');
    });
  
    // Génération du contenu CSV avec BOM
    const csvContent = [
      '\uFEFF' + headers.map(({ label }) => label).join(';'), // En-têtes avec BOM
      ...rows.map((row) => row.join(';')), // Contenu
    ].join('\n');
  
    // Création du fichier CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tableau_palettes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  

  let currentColor = 'bg-blue-100';

  return (
    <div className="flex flex-col items-center">
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl lg:max-w-full mx-4">
      <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-700">Liste des Palettes</h1>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleAddColumn}
            >
              Ajouter une colonne
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={exportToCSV}
            >
              Exporter en CSV
            </button>
          </div>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: `calc(10 * 3rem + 1.5rem)` }}
        >
          <table className="w-full border border-gray-300 divide-y divide-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Numéro de Commande
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Date de Livraison
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Zone
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Client
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Repère
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Système
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Désignation
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Quantité
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Nombre de Panneaux
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Hauteur
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Largeur
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Palette 1m
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Palette 0.80m
                </th>
                {extraColumns.map((colName, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                  >
                    {colName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => {
                const isFirstRow = index === 0;
                const prevNumCde = isFirstRow ? null : data[index - 1].Num_Cde;
  
                if (isFirstRow || item.Num_Cde !== prevNumCde) {
                  currentColor = currentColor === 'bg-blue-100' ? 'bg-white' : 'bg-blue-100';
                }
  
                return (
                  <tr key={index} className={`${currentColor}`}>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Num_Cde}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(item.Date_Livraison).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Zone_Livraison}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.nom}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Repere}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.systeme}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Designation}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Quantite}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Nb_Vtx_Pan_Par_Repere}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Hauteur}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.Largeur}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={paletteData[index]?.palette1 || ''}
                        onChange={(e) => handleInputChange(index, 'palette1', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={paletteData[index]?.palette2 || ''}
                        onChange={(e) => handleInputChange(index, 'palette2', e.target.value)}
                      />
                    </td>
                    {extraColumns.map((colName, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 text-sm text-gray-700">
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={paletteData[index]?.[colName] || ''}
                          onChange={(e) => handleInputChange(index, colName, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
  
        <div className="mt-6 bg-gray-100 rounded-lg p-4 flex flex-wrap gap-4">
          <p className="text-lg font-semibold text-gray-700">
            Nombre de palettes 1m : <span className="text-blue-500">{totalPalette1}</span>
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Nombre de palettes 0.80m : <span className="text-blue-500">{totalPalette2}</span>
          </p>
          {extraColumns.map((colName, colIndex) => (
            <p key={colIndex} className="text-lg font-semibold text-gray-700">
              Nombre {colName} : <span className="text-blue-500">{totalExtraColumns[colIndex]}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};  

export default PaletteTable;
