'use client';

import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';

const RepresentantClients = () => {
  const [representants, setRepresentants] = useState([]);
  const [selectedRepresentant, setSelectedRepresentant] = useState(null);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Récupérer la liste des représentants
  const fetchRepresentants = async () => {
    try {
      const response = await fetch('/api/representants');
      if (!response.ok) throw new Error('Erreur lors de la récupération des représentants.');
      const data = await response.json();
      setRepresentants(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Récupérer les clients par représentant
  const fetchClients = async () => {
    if (!selectedRepresentant) {
      setError('Veuillez sélectionner un représentant.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/representants/clients?representantCode=${selectedRepresentant.CODE}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des clients.');
      const data = await response.json();
      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les clients en fonction du texte de recherche
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredClients(clients);
    } else {
      const lowerCaseSearchText = searchText.toLowerCase();
      setFilteredClients(
        clients.filter(
          (client) =>
            client.Nom_Client.toLowerCase().includes(lowerCaseSearchText) ||
            client.Code_Client.toLowerCase().includes(lowerCaseSearchText)
        )
      );
    }
  }, [searchText, clients]);

  // Charger la liste des représentants au montage
  useEffect(() => {
    fetchRepresentants();
  }, []);

  return (
    <main className="flex flex-col p-6 bg-sky-950 min-h-screen">
      {/* Menu déroulant pour sélectionner un représentant et barre de recherche */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sélectionner un représentant</h2>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
          <Listbox value={selectedRepresentant} onChange={setSelectedRepresentant}>
            <div className="relative w-full md:w-64">
              <Listbox.Button className="relative w-full border border-gray-300 bg-white rounded-md p-3 text-left text-sm">
                {selectedRepresentant
                  ? `${selectedRepresentant.CODE} - ${selectedRepresentant.nom}`
                  : 'Sélectionnez un représentant'}
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {representants.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">Aucun représentant disponible</div>
                ) : (
                  representants.map((rep) => (
                    <Listbox.Option
                      key={rep.CODE}
                      value={rep}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 ${
                          active ? 'bg-sky-950 text-white' : 'text-gray-900'
                        }`
                      }
                    >
                      {rep.CODE} - {rep.nom}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </div>
          </Listbox>

          <button
            onClick={fetchClients}
            className="px-6 py-3 bg-sky-950 text-white text-sm font-medium rounded-md hover:bg-sky-900 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Rechercher
          </button>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Rechercher un client..."
            className="p-3 w-full md:w-64 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>



      {/* Tableau des clients */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-gray-500">Chargement des clients...</p>
        ) : filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="table-auto w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Code Client</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Nom Client</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Code Représentant</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Nom Représentant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client, index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer ${
                        selectedRow === index ? 'bg-indigo-100' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedRow(index)}
                    >
                      <td className="px-4 py-2 text-gray-900">{client.Code_Client}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Nom_Client}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Code_Representant}</td>
                      <td className="px-4 py-2 text-gray-500">{client.Nom_Representant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading && <p className="text-gray-500">Aucun client trouvé pour ce représentant.</p>
        )}
      </div>
    </main>
  );
};

export default RepresentantClients;
