"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { baseURL } from "@/utils/baseURL";

const generateWeeks = (year) => {
    const weeks = [];
    const firstDayOfYear = new Date(year, 0, 1);
    let currentDate = firstDayOfYear;

    while (currentDate.getFullYear() === year) {
        const weekNumber = Math.ceil(
            ((currentDate - new Date(year, 0, 1)) / 86400000 + firstDayOfYear.getDay() + 1) / 7
        );

        const isoWeek = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
        if (!weeks.includes(isoWeek)) {
            weeks.push(isoWeek);
        }

        // Passer au prochain lundi
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
};

const AddPersonModal = ({ isOpen, onClose, onAdd }) => {
    const currentYear = new Date().getFullYear();
    const [weeks, setWeeks] = useState([]); // Dynamique
    const [formData, setFormData] = useState({
        name: "",
        lundi: "00:00",
        mardi: "00:00",
        mercredi: "00:00",
        jeudi: "00:00",
        vendredi: "00:00",
        semaine: [], // Tableau pour les semaines sélectionnées
    });
    const [selectAllWeeks, setSelectAllWeeks] = useState(false); // Nouvel état pour "Toutes les semaines"
    const [error, setError] = useState(null);

    useEffect(() => {
        const generatedWeeks = generateWeeks(currentYear);
        setWeeks(generatedWeeks);
    }, [currentYear]); // Génère les semaines dynamiquement pour l'année actuelle

    const handleInputChange = (e, field) => {
        const value = e.target.value;

        if (field === "name") {
            setFormData({ ...formData, [field]: value });
        } else {
            setFormData({ ...formData, [field]: value || "00:00" });
        }
    };

    const handleWeekChange = (week) => {
        setFormData((prev) => {
            const updatedWeeks = prev.semaine.includes(week)
                ? prev.semaine.filter((w) => w !== week)
                : [...prev.semaine, week];
            return { ...prev, semaine: updatedWeeks };
        });
        setSelectAllWeeks(false);
    };

    const handleSelectAllWeeks = () => {
        setSelectAllWeeks((prev) => !prev);
        setFormData((prev) => ({
            ...prev,
            semaine: !selectAllWeeks ? [...weeks] : [],
        }));
    };

    const handleAdd = async () => {
        setError(null);

        if (!formData.name || formData.name.trim() === "") {
            setError("Le champ 'Prénom' est obligatoire.");
            return;
        }

        if (!formData.semaine.length) {
            setError("Veuillez sélectionner au moins une semaine.");
            return;
        }

        const formattedData = {
            name: formData.name.trim(),
            semaines: formData.semaine,
            lundi: formData.lundi || "00:00",
            mardi: formData.mardi || "00:00",
            mercredi: formData.mercredi || "00:00",
            jeudi: formData.jeudi || "00:00",
            vendredi: formData.vendredi || "00:00",
        };

        try {
            const response = await fetch(`${baseURL}/api/planning/with-personnel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'enregistrement.");
            }

            const result = await response.json();
            onAdd(result);
            onClose();
        } catch (error) {
            console.error("Erreur dans handleAdd :", error);
            setError(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Ajouter une personne</h2>
                <Input
                    type="text"
                    placeholder="Prénom"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    className="mb-4"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {formData.name.trim() && (
                    <>
                        {["lundi", "mardi", "mercredi", "jeudi", "vendredi"].map((day) => (
                            <Input
                                key={day}
                                type="time"
                                placeholder={day.charAt(0).toUpperCase() + day.slice(1)}
                                value={formData[day]}
                                onChange={(e) => handleInputChange(e, day)}
                                className="mb-4"
                            />
                        ))}
                    </>
                )}
                <div className="mb-4">
                    <h4 className="text-gray-700 mb-2">Sélectionnez les semaines :</h4>
                    <label className="block mb-2">
                        <input
                            type="checkbox"
                            checked={selectAllWeeks}
                            onChange={handleSelectAllWeeks}
                            className="mr-2"
                        />
                        Toutes les semaines
                    </label>
                    <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                        {weeks.map((week) => (
                            <label key={week} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={formData.semaine.includes(week)}
                                    onChange={() => handleWeekChange(week)}
                                    className="mr-2"
                                />
                                {week}
                            </label>
                        ))}
                    </div>
                </div>
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

export default AddPersonModal;
