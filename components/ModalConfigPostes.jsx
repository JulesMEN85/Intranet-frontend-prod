"use client";
import { useEffect, useState } from "react";

const ModalConfigPostes = ({ isOpen, onClose, uniquePostes, uniquePersonnel, onSave, selectedWeek }) => {
  const [defaultAssignments, setDefaultAssignments] = useState({});
  const [initialAssignments, setInitialAssignments] = useState({});


  // 🔹 1️⃣ Charger les affectations à chaque ouverture du modal
  useEffect(() => {
    if (isOpen) {
      fetchDefaultAssignments();
    }
  }, [isOpen, selectedWeek, uniquePostes]);
  

  // 🔹 2️⃣ Fonction pour récupérer les affectations par défaut depuis l'API
  const fetchDefaultAssignments = async () => {
    try {
      const response = await fetch("http://192.168.1.18:4000/api/postes/default-assignments");
      if (!response.ok) throw new Error("Erreur lors de la récupération des affectations par défaut.");
      const data = await response.json();
  
      // 🔥 Filtrer uniquement les affectations pour les postes visibles dans la semaine sélectionnée
      const filteredAssignments = data.filter(assignment =>
        uniquePostes.some(poste => poste.code === assignment.poste_code)
      );
  
      const assignmentsMap = filteredAssignments.reduce((acc, assignment) => {
        acc[assignment.poste_code] = {
          personnel_id: assignment.personnel_id,
          name: assignment.name, // 🔥 Garde aussi le nom !
        };
        return acc;
      }, {});
  
      // ✅ Mettre à jour l'état des affectations actuelles et sauvegarder l'état initial
      setDefaultAssignments(assignmentsMap);
      setInitialAssignments(assignmentsMap); // ✅ Sauvegarde de l'état initial pour comparaison
  
      console.log("✅ Assignments mis à jour après récupération :", assignmentsMap);
  
    } catch (error) {
      console.error("❌ Erreur API (fetchDefaultAssignments):", error);
    }
  };
  
  // 🔹 3️⃣ Gérer les modifications d'affectation
  const handleAssignmentChange = (posteCode, personnelId) => {
    if (personnelId === "") {
      // ✅ Suppression de l'affectation
      setDefaultAssignments((prev) => {
        const updatedAssignments = { ...prev };
        delete updatedAssignments[posteCode];
        return updatedAssignments;
      });
    } else {
      const selectedPerson = uniquePersonnel.find(person => person.personnel_id === Number(personnelId));
      setDefaultAssignments((prev) => ({
        ...prev,
        [posteCode]: {
          personnel_id: Number(personnelId),
          name: selectedPerson ? selectedPerson.name : "Inconnu",
        },
      }));
    }
  };
   

  // 🔹 4️⃣ Enregistrer les affectations dans la base de données
  const saveAssignmentsToDatabase = async () => {
    try {
      // 🔹 Séparer les affectations assignées et désassignées
      const assignmentsToSave = [];
      const assignmentsToDelete = [];
  
      // ✅ Affectations à sauvegarder
      Object.entries(defaultAssignments).forEach(([poste_code, personnel]) => {
        if (personnel && personnel.personnel_id) {
          assignmentsToSave.push({
            poste_code,
            personnel_id: Number(personnel.personnel_id),
          });
        }
      });

      // ✅ Détection des affectations supprimées
      Object.keys(initialAssignments).forEach((poste_code) => {
        if (!defaultAssignments[poste_code]) {
          assignmentsToDelete.push(poste_code);
        }
      });

  
      console.log("📤 Données à sauvegarder :", assignmentsToSave);
      console.log("🗑️ Affectations à supprimer :", assignmentsToDelete);
  
      // 🔹 Enregistrer les affectations assignées
      if (assignmentsToSave.length > 0) {
        const response = await fetch("http://192.168.1.18:4000/api/postes/default-assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(assignmentsToSave),
        });
  
        const responseText = await response.text();
  
        if (!response.ok) {
          throw new Error(responseText || "Erreur lors de l'enregistrement.");
        }
      }
  
      // 🔹 Supprimer les affectations désassignées
      if (assignmentsToDelete.length > 0) {
        const deleteResponse = await fetch("http://192.168.1.18:4000/api/postes/default-assignments", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ poste_codes: assignmentsToDelete }),
        });
    
        const deleteResponseText = await deleteResponse.text();
        console.log("🗑️ Affectations supprimées :", deleteResponseText);
    
        if (!deleteResponse.ok) {
            throw new Error(deleteResponseText || "Erreur lors de la suppression.");
        }
    }    
  
    } catch (error) {
      console.error("❌ Erreur API (saveAssignmentsToDatabase) :", error);
    }
  };
  


  // 🔹 5️⃣ Enregistrer les affectations et fermer le modal
  const handleSave = async () => {
    console.log("💾 Affectations sauvegardées :", defaultAssignments);
    localStorage.setItem("defaultAssignments", JSON.stringify(defaultAssignments));

    // Enregistrer en base de données avec les bonnes données
    await saveAssignmentsToDatabase(defaultAssignments);

    // Passer les nouvelles affectations à `PostesTable.jsx`
    onSave(defaultAssignments);

    onClose();
};

  const getUniquePersonnelByName = (personnelList) => {
    const seenNames = new Set();
    return personnelList.filter(person => {
      if (seenNames.has(person.name)) {
        return false; // Nom déjà vu, on le cache
      } else {
        seenNames.add(person.name); // Ajouter le nom pour suivre les doublons
        return true; // Premier nom rencontré, on l'affiche
      }
    });
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Configurer les Affectations par Défaut</h2>

        <div className="space-y-4 max-h-80 overflow-y-auto">
          {uniquePostes.map((poste) => (
            <div key={poste.code} className="flex justify-between items-center">
              <span className="font-medium">{poste.descriptio || poste.code}</span>
              <select
                className="border rounded p-1"
                value={defaultAssignments[poste.code]?.personnel_id ?? ""}
                onChange={(e) => handleAssignmentChange(poste.code, e.target.value)}
              >
                <option value="">Aucun</option> {/* ✅ Option pour désassigner */}
                {getUniquePersonnelByName(uniquePersonnel).map((person) => (
                  <option key={person.personnel_id} value={person.personnel_id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onClose}>
            Annuler
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfigPostes;
