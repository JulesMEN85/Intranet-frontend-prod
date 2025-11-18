import React, { useState, useEffect } from "react";
import LoaderTable from "@/components/LoaderTable";
import useUserStore from "@/store/userStore";
import { baseURL } from "@/utils/baseURL";
import ModalRemisesClient from "./ModalRemisesClient"; // adapte le chemin
import ModalEditRemiseClient from "./ModalEditRemiseClient";
import ModalAddRemiseClient from "./ModalAddRemiseClient";

const TableClientRemise = () => {
  const { userLevel } = useUserStore();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  const [familles, setFamilles] = useState([]);

  const [modalClient, setModalClient] = useState(null);
  const [modalRemises, setModalRemises] = useState([]);
  const [loadingRemises, setLoadingRemises] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [editModalRemise, setEditModalRemise] = useState(null); // {remise, client} ou null
  const [editRemiseValue, setEditRemiseValue] = useState(""); // valeur temporaire
  const [editRemiseLoading, setEditRemiseLoading] = useState(false);
  const [editRemiseError, setEditRemiseError] = useState(null);
  const [editRemiseSuccess, setEditRemiseSuccess] = useState(null);
  const [addRemiseModalOpen, setAddRemiseModalOpen] = useState(false);
  const [addRemiseFamille, setAddRemiseFamille] = useState("");
  const [addRemiseValue, setAddRemiseValue] = useState("");
  const [addRemiseLoading, setAddRemiseLoading] = useState(false);
  const [addRemiseError, setAddRemiseError] = useState(null);
  const [addRemiseSuccess, setAddRemiseSuccess] = useState(null);

  useEffect(() => {
    fetch(`${baseURL}/api/family/all`)
      .then((res) => res.json())
      .then((data) => {
        console.log("familles JSON brut:", data);
        // CORRECTION ICI SELON LA STRUCTURE DE data
        setFamilles(Array.isArray(data) ? data : data.familles || []);
      })
      .catch(() => {
        setFamilles([]);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setClients([]);
    try {
      const res = await fetch(
        `${baseURL}/api/remise/customers?search=${encodeURIComponent(search)}`
      );
      const json = await res.json();
      console.log("clients chargés:", json);
      setClients(res.ok ? json : []);
      setError(res.ok ? null : json.error || "Erreur lors de la recherche.");
    } catch {
      setError("Erreur réseau lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRemise = async (client) => {
    setModalClient(client);
    setLoadingRemises(true);
    setErrorModal(null);
    setModalRemises([]);
    try {
      const res = await fetch(
        `${baseURL}/api/remise/customer-discount/${client.CODE}`
      );
      const json = await res.json();
      console.log("Remises reçues du client:", json);
      console.log("Familles chargées globales:", familles);

      // Filtrer uniquement les remises ayant une famille correspondante
      const remisesAvecFamille = json.map((remise) => {
        const famille = familles.find(
          (f) => String(f.famille_remise) === String(remise.idRemise)
        );
        return {
          idRemise: remise.idRemise,
          name:
            famille && famille.name
              ? famille.name
              : "Cette famille a été supprimée",
          valeur: remise.valeur,
        };
      });
      setModalRemises(remisesAvecFamille);

      console.log("Remises jointes (affichées):", remisesAvecFamille);

      setModalRemises(remisesAvecFamille);
      setErrorModal(null);
    } catch (e) {
      console.log("Erreur dans handleEditRemise:", e);
      setErrorModal("Erreur réseau lors du chargement des remises.");
    } finally {
      setLoadingRemises(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        className="flex items-center space-x-4 mb-4"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Rechercher un client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-60"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-sky-700 text-white font-bold rounded hover:bg-sky-800 shadow"
        >
          Recherche
        </button>
      </form>

      {loading && <LoaderTable />}

      {error && <div className="text-red-600 my-4 text-center">{error}</div>}

      <table className="min-w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">Code</th>
            <th className="px-4 py-2 border border-gray-300">Nom</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client.CODE}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {client.CODE}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {client.nom}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditRemise(client)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4 bg-white">
                Aucun résultat
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalClient && (
        <ModalRemisesClient
          remises={modalRemises}
          client={modalClient}
          onClose={() => setModalClient(null)}
          onEdit={(remise) => {
            setEditModalRemise({ remise, client: modalClient });
            setEditRemiseValue(remise.valeur);
            setEditRemiseError(null);
          }}
          setAddRemiseModalOpen={setAddRemiseModalOpen}
        />
      )}
      {editModalRemise && (
        <ModalEditRemiseClient
          remise={editModalRemise.remise}
          client={editModalRemise.client}
          valeur={editRemiseValue}
          setValeur={setEditRemiseValue}
          loading={editRemiseLoading}
          error={editRemiseError}
          success={editRemiseSuccess}
          onClose={() => setEditModalRemise(null)}
          onConfirm={async () => {
            setEditRemiseLoading(true);
            setEditRemiseError(null);
            setEditRemiseSuccess(null);
            try {
              const res = await fetch(
                `${baseURL}/api/remise/edit/customer/${editModalRemise.client.CODE}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    idRemise: editModalRemise.remise.idRemise,
                    nouvelleRemise: editRemiseValue,
                  }),
                }
              );
              const json = await res.json();
              if (res.ok) {
                setEditRemiseSuccess(json.message || "Modification réussie !");
                // Mise à jour en live du tableau local
                setModalRemises((prev) =>
                  prev.map((r) =>
                    r.idRemise === editModalRemise.remise.idRemise
                      ? { ...r, valeur: editRemiseValue }
                      : r
                  )
                );
                // Fermeture automatique au bout de 2s
                setTimeout(() => {
                  setEditModalRemise(null);
                  setEditRemiseSuccess(null);
                }, 2000);
              } else {
                setEditRemiseError(json.error || "Échec modification.");
              }
            } catch {
              setEditRemiseError("Erreur réseau.");
            } finally {
              setEditRemiseLoading(false);
            }
          }}
        />
      )}
      <ModalAddRemiseClient
        familles={familles}
        client={modalClient}
        remises={modalRemises}
        open={addRemiseModalOpen}
        onClose={() => {
          setAddRemiseModalOpen(false);
          setAddRemiseFamille("");
          setAddRemiseValue("");
          setAddRemiseError(null);
          setAddRemiseSuccess(null);
        }}
        selectedFamille={addRemiseFamille}
        setSelectedFamille={setAddRemiseFamille}
        valeur={addRemiseValue}
        setValeur={setAddRemiseValue}
        loading={addRemiseLoading}
        error={addRemiseError}
        success={addRemiseSuccess}
        onConfirm={async () => {
          setAddRemiseLoading(true);
          setAddRemiseError(null);
          setAddRemiseSuccess(null);
          try {
            const res = await fetch(
              `${baseURL}/api/remise/edit/customer/${modalClient.CODE}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  idRemise: addRemiseFamille,
                  nouvelleRemise: addRemiseValue,
                }),
              }
            );
            const json = await res.json();
            if (res.ok) {
              setAddRemiseSuccess(json.message || "Remise ajoutée !");
              // Optionnel: rajoute à la liste, ou refais le fetch/remises
              setModalRemises((prev) => [
                ...prev,
                {
                  idRemise: addRemiseFamille,
                  name: familles.find(
                    (f) => String(f.famille_remise) === String(addRemiseFamille)
                  ).name,
                  valeur: addRemiseValue,
                },
              ]);
              setTimeout(() => {
                setAddRemiseModalOpen(false);
                setAddRemiseFamille("");
                setAddRemiseValue("");
                setAddRemiseSuccess(null);
              }, 2000);
            } else {
              setAddRemiseError(json.error || "Erreur lors de l'ajout.");
            }
          } catch {
            setAddRemiseError("Erreur réseau.");
          } finally {
            setAddRemiseLoading(false);
          }
        }}
      />

      {loadingRemises && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <LoaderTable />
        </div>
      )}

      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded shadow text-red-700">
            {errorModal}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableClientRemise;
