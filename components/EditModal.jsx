"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || null, // Ajout explicite de l'ID
    name: initialData?.name || "",
    lundi: initialData?.lundi || "00:00",
    mardi: initialData?.mardi || "00:00",
    mercredi: initialData?.mercredi || "00:00",
    jeudi: initialData?.jeudi || "00:00",
    vendredi: initialData?.vendredi || "00:00",
  });

  // Convertir TIME en HH:mm
  const timeToTimeInput = (time) => {
    if (!time) return "00:00";
    if (typeof time === "number") {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
    if (typeof time === "string" && time.includes(":")) {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    }
    return "00:00";
  };

  // Convertir HH:mm en TIME
  const timeInputToTime = (value) => (value ? `${value}:00` : "00:00:00");

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        name: initialData.name || "",
        lundi: timeToTimeInput(initialData.lundi),
        mardi: timeToTimeInput(initialData.mardi),
        mercredi: timeToTimeInput(initialData.mercredi),
        jeudi: timeToTimeInput(initialData.jeudi),
        vendredi: timeToTimeInput(initialData.vendredi),
      });
    }
  }, [initialData, isOpen]); // Ajout de `isOpen` pour réinitialiser les champs à chaque ouverture
  

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    const formattedData = {
      id: formData.id, // Assurez-vous que l'ID est inclus
      name: formData.name, // Nom à mettre à jour
      lundi: timeInputToTime(formData.lundi),
      mardi: timeInputToTime(formData.mardi),
      mercredi: timeInputToTime(formData.mercredi),
      jeudi: timeInputToTime(formData.jeudi),
      vendredi: timeInputToTime(formData.vendredi),
    };
  
    console.log("Données envoyées pour mise à jour :", formattedData);
  
    onSave(formattedData); // Envoie les données au parent
    onClose(); // Ferme le modal
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Modifier les données</h2>

        {/* Champs du formulaire */}
        <Input
          placeholder="Prénom"
          value={formData.name}
          onChange={(e) => handleInputChange(e, "name")}
          className="mb-4"
        />
        <Input
          type="time"
          placeholder="Lundi"
          value={formData.lundi}
          onChange={(e) => handleInputChange(e, "lundi")}
          className="mb-4"
        />
        <Input
          type="time"
          placeholder="Mardi"
          value={formData.mardi}
          onChange={(e) => handleInputChange(e, "mardi")}
          className="mb-4"
        />
        <Input
          type="time"
          placeholder="Mercredi"
          value={formData.mercredi}
          onChange={(e) => handleInputChange(e, "mercredi")}
          className="mb-4"
        />
        <Input
          type="time"
          placeholder="Jeudi"
          value={formData.jeudi}
          onChange={(e) => handleInputChange(e, "jeudi")}
          className="mb-4"
        />
        <Input
          type="time"
          placeholder="Vendredi"
          value={formData.vendredi}
          onChange={(e) => handleInputChange(e, "vendredi")}
          className="mb-4"
        />

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
