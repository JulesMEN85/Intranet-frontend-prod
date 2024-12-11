"use client";
import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import TdcFilter from "@/components/TdcFilter";
import SidebarCard from "@/components/SidebarCard";
import PersonnelTables from "@/components/PersonnelTables";
import PosteTable from "@/components/PosteTable";

// Définition de baseURL
const baseURL = "http://localhost:4000"; // Remplacez par l'URL correcte de votre backend

const PersonnelsPage = () => {
    // Vérification de l'authentification avec les rôles autorisés
    const loading = useAuthGuard([1, 4, 5]);

    // États pour gérer les données
    const [personnelData, setPersonnelData] = useState([]); // Données des personnels
    const [planningData, setPlanningData] = useState([]); // Données des plannings
    const [basePersonnel, setBasePersonnel] = useState([]); // Données des personnels de base
    const [selectedWeek, setSelectedWeek] = useState(""); // Semaine sélectionnée

    // Récupérer les données des personnels et des plannings
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer les personnels de base
                const basePersonnelResponse = await fetch(`${baseURL}/api/planning/base-personnel`);
                if (!basePersonnelResponse.ok) {
                    throw new Error("Erreur lors de la récupération des personnels de base");
                }
                const basePersonnelData = await basePersonnelResponse.json();
                setBasePersonnel(basePersonnelData);

                // Récupérer les données des personnels
                const personnelResponse = await fetch(`${baseURL}/api/personnel`);
                if (!personnelResponse.ok) {
                    throw new Error("Erreur lors de la récupération des personnels");
                }
                const personnels = await personnelResponse.json();
                setPersonnelData(personnels);

                // Récupérer les données des plannings si une semaine est sélectionnée
                if (selectedWeek) {
                    const planningResponse = await fetch(
                        `${baseURL}/api/planning?startDate=${selectedWeek}&endDate=${selectedWeek}`
                    );
                    if (!planningResponse.ok) {
                        throw new Error("Erreur lors de la récupération des plannings");
                    }
                    const plannings = await planningResponse.json();

                    // Ajouter les personnels de base aux plannings
                    const combinedData = [...basePersonnelData, ...plannings];
                    setPlanningData(combinedData);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData();
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
                        personnelData={personnelData}
                        selectedWeek={selectedWeek}
                        setPlanningData={setPlanningData}
                    />

                    {/* Espacement entre les deux tables */}
                    <div className="my-8" />

                    {/* Table des postes (sans données récupérées dynamiquement) */}
                    <PosteTable data={[]} />
                </div>
            </div>
        </main>
    );
};

export default PersonnelsPage;
