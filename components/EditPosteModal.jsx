"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const EditPosteModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});

  // Met à jour les données du formulaire lorsqu'on ouvre le modal avec de nouvelles données
  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (e, field) => {
    const value = field === "time" ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  // Sauvegarder les modifications
  const handleSave = () => {
    onSave(formData); // Envoie les données modifiées au parent
    onClose(); // Ferme le modal
  };

  if (!isOpen) return null; // Si le modal n'est pas ouvert, ne rien afficher

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Modifier un poste</h2>

        {/* Champs pour le nom du poste */}
        <Input
          placeholder="Nom du poste"
          value={formData.name || ""}
          onChange={(e) => handleInputChange(e, "name")}
          className="mb-4"
        />

        {/* Champs pour le temps à passer sur le poste */}
        <Input
          type="number"
          placeholder="Temps à passer (en heures)"
          value={formData.time || ""}
          onChange={(e) => handleInputChange(e, "time")}
          className="mb-4"
        />

        {/* Sélecteur pour la catégorie */}
        <Select
          value={formData.category || ""}
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
          <Button variant="primary" onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPosteModal;
