'use client';

import { useEffect, useState } from 'react';

const ClientRemiseTable = () => {
  const [clients, setClients] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [totalParticuliers, setTotalParticuliers] = useState(0);
  const [excludeParticuliers, setExcludeParticuliers] = useState(false);
  const [clientCode, setClientCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Fonction pour récupérer les données des clients
  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (excludeParticuliers) params.append('excludeParticuliers', true);
    if (clientCode) params.append('clientCode', clientCode);

    try {
      const response = await fetch(`/api/remises?${params.toString()}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des données.');
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les statistiques
  const fetchStatistics = async () => {
    try {
      // Total des clients
      const totalClientsResponse = await fetch('/api/remises/total-clients');
      const totalClientsData = await totalClientsResponse.json();
      setTotalClients(totalClientsData.totalClients || 0);

      // Total des particuliers
      const totalParticuliersResponse = await fetch('/api/remises/total-particuliers');
      const totalParticuliersData = await totalParticuliersResponse.json();
      setTotalParticuliers(totalParticuliersData.totalParticuliers || 0);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques :', err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchStatistics();
  }, [excludeParticuliers, clientCode]);

  return (
    <main className="flex flex-col p-6 bg-sky-950 min-h-screen">
      {/* Carte pour les filtres et boutons */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Recherche et checkbox */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <label className="flex items-center text-gray-700 text-sm font-medium">
              <input
                type="checkbox"
                checked={excludeParticuliers}
                onChange={() => setExcludeParticuliers(!excludeParticuliers)}
                className="w-5 h-5 mr-2"
              />
              Exclure les particuliers
            </label>
            <input
              type="text"
              placeholder="Rechercher un code client"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value)}
              className="p-3 w-full md:w-64 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Nouvelle carte avec les statistiques */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Informations client</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Carte 1 : Total des clients */}
          <div className="p-4 bg-gray-50 rounded-lg shadow flex flex-col">
            <p className="text-sm text-gray-500">Total Clients</p>
            <div className="mt-2 flex items-center">
              <p className="text-3xl font-bold text-indigo-600">{totalClients}</p>
            </div>
          </div>

          {/* Carte 2 : Total des particuliers */}
          <div className="p-4 bg-gray-50 rounded-lg shadow flex flex-col">
            <p className="text-sm text-gray-500">Total Particuliers</p>
            <div className="mt-2 flex items-center">
              <p className="text-3xl font-bold text-indigo-600">{totalParticuliers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carte pour le tableau */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-gray-500 text-sm">Chargement des données...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">Erreur : {error}</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="table-auto w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Code</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Nom</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Remise Fiche Client</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Volets</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Portes Garages</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Portes Sectionnelles</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Portails/Clôtures</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Panneaux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clients.map((client, index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer ${
                        selectedRow === index ? 'bg-indigo-100' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedRow(index)}
                    >
                      <td className="px-4 py-2 text-gray-900">{client.CODE}</td>
                      <td className="px-4 py-2 text-gray-500">{client.nom}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Remise_Fiche_Client}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Volets_1}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Portes_Garages_2}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Portes_Sectionnelles_3}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Portail_Cloture_4}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Panneaux_5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientRemiseTable;
