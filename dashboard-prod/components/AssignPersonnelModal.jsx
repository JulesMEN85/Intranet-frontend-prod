"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const AssignPersonnelModal = ({ isOpen, onClose, onSave, personnel, selectedPersonnel, taskTime }) => {
  const [selected, setSelected] = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});

  useEffect(() => {
    setSelected(selectedPersonnel || []);
    setRemainingTimes({}); // Réinitialiser les temps restants au chargement
  }, [selectedPersonnel]);

  const handleCheckboxChange = (person) => {
    const isSelected = selected.includes(person.name);

    // Calculer le temps restant si on coche/ajoute une tâche
    const updatedRemainingTimes = { ...remainingTimes };
    if (!isSelected) {
      updatedRemainingTimes[person.name] = calculateRemainingTime(person, taskTime);
    } else {
      delete updatedRemainingTimes[person.name];
    }

    setRemainingTimes(updatedRemainingTimes);
    setSelected((prev) =>
      isSelected ? prev.filter((item) => item !== person.name) : [...prev, person.name]
    );
  };

  const calculateTotalTime = (person) => {
    return ["lundi", "mardi", "mercredi", "jeudi", "vendredi"]
      .map((day) => {
        const [hours = 0, minutes = 0] = person[day]?.split(":").map(Number) || [0, 0];
        return hours * 60 + minutes; // Convertir chaque jour en minutes
      })
      .reduce((sum, minutes) => sum + minutes, 0); // Somme totale en minutes
  };

  const calculateRemainingTime = (person, taskTime) => {
    const totalMinutesWorked = calculateTotalTime(person);
    const maxWeeklyMinutes = 40 * 60; // 40 heures par semaine en minutes
    const availableMinutes = maxWeeklyMinutes - totalMinutesWorked;

    // Convertir le temps de la tâche (en heures) en minutes
    const taskMinutes = taskTime * 60;

    const remainingMinutes = availableMinutes - taskMinutes;

    return remainingMinutes >= 0
      ? `${Math.floor(remainingMinutes / 60)}h${remainingMinutes % 60}m`
      : "Temps insuffisant";
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Assigner des personnels</h2>
        <div className="flex flex-col space-y-2">
          {personnel.map((person) => (
            <label key={person.id} className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(person.name)}
                    onChange={() => handleCheckboxChange(person)}
                    className="form-checkbox"
                  />
                  <span>{person.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Total : {`${Math.floor(calculateTotalTime(person) / 60)}h${calculateTotalTime(person) % 60}m`}
                </span>
              </div>
              {selected.includes(person.name) && (
                <div className="ml-6 text-sm text-blue-500">
                  Temps restant après tâche : {remainingTimes[person.name] || "Calcul en cours..."}
                </div>
              )}
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignPersonnelModal;
