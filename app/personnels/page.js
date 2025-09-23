"use client";
import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import TdcFilter from "@/components/TdcFilter";
import SidebarCard from "@/components/SidebarCard";
import PersonnelTables from "@/components/PersonnelTables";

// Définition de baseURL
const baseURL = "http://192.168.1.18:4000"; // Remplacez par l'URL correcte de votre backend

const PersonnelsPage = () => {
    // Vérification de l'authentification avec les rôles autorisés
    const loading = useAuthGuard([1]);

    // États pour gérer les données
    const [planningData, setPlanningData] = useState([]); // Données des plannings (personnel + base)
    const [selectedWeek, setSelectedWeek] = useState(""); // Semaine sélectionnée

    // Récupérer les données en fonction de la semaine sélectionnée
    useEffect(() => {
        const fetchPlanningData = async () => {
            try {
                // Récupérer les plannings hebdomadaires
                const response = await fetch(
                    `${baseURL}/api/planning/weekly-planning?startDate=${selectedWeek}`
                );

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des plannings hebdomadaires");
                }

                const planning = await response.json();
                setPlanningData(planning);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        if (selectedWeek) {
            fetchPlanningData();
        }
    }, [selectedWeek]); // Dépendance à la semaine sélectionnée

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <main className="flex flex-col h-screen bg-sky-950">
            {/* TdcFilter en pleine largeur en haut */}
            <div className="w-full">
                <TdcFilter setData={setPlanningData} setSelectedWeek={setSelectedWeek} />
            </div>

            {/* Conteneur en dessous de TdcFilter */}
            <div className="flex flex-1">
                {/* Sidebar sous le filtre, occupe toute la hauteur disponible */}
                <div className="w-64 h-full p-4">
                    <SidebarCard />
                </div>

                {/* Conteneur principal */}
                <div className="flex-1 overflow-auto p-4 mx-4">
                    {/* Table des personnels et des plannings */}
                    <PersonnelTables
                        planningData={planningData}
                        selectedWeek={selectedWeek}
                        setPlanningData={setPlanningData}
                    />
                </div>
            </div>
        </main>
    );
};

export default PersonnelsPage;
