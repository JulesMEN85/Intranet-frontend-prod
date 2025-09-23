"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Assurez-vous que 'SelectItem' est bien exporté

const AddPosteModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    time: 0,
    category: "",
  });

  // Mettre à jour les valeurs de champ dans le formulaire
  const handleInputChange = (e, field) => {
    const value = field === "time" ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  // Ajouter le nouveau poste
  const handleAdd = () => {
    onAdd(formData);
    setFormData({
      name: "",
      time: 0,
      category: "",
    }); // Réinitialiser le formulaire
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Ajouter un poste</h2>

        {/* Champs du formulaire */}
        <Input
          placeholder="Nom du poste"
          value={formData.name}
          onChange={(e) => handleInputChange(e, "name")}
          className="mb-4"
        />
        <Input
          type="number"
          placeholder="Temps à passer (en heures)"
          value={formData.time}
          onChange={(e) => handleInputChange(e, "time")}
          className="mb-4"
        />
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Choisissez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category1">Catégorie 1</SelectItem>
            <SelectItem value="category2">Catégorie 2</SelectItem>
            <SelectItem value="category3">Catégorie 3</SelectItem>
          </SelectContent>
        </Select>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPosteModal;
