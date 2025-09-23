'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import SidebarCard from '@/components/SidebarCard';
import { useState, useEffect } from 'react';
import FilterPalette from '@/components/FilterPalette';
import PaletteTable from '@/components/PaletteTable';
import axios from 'axios';

/**
 * Convertit une semaine ISO (YYYY-Wxx) en une date correspondant au lundi de cette semaine.
 * @param {string} weekString - Semaine au format ISO (ex : 2025-W04)
 * @returns {Date} Date correspondant au lundi de la semaine ou null si invalide
 */
const isoWeekToDate = (weekString) => {
    const match = weekString.match(/^(\d{4})-W(\d{2})$/);
    if (!match) return null;

    const year = parseInt(match[1], 10);
    const week = parseInt(match[2], 10);

    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay();
    const offset = jan4Day === 0 ? -6 : 1 - jan4Day;
    const weekStart = new Date(
        Date.UTC(year, 0, 4 + offset + (week - 1) * 7)
    );

    return weekStart;
};

const Palettes = () => {
    const [data, setData] = useState([]); // Données originales
    const [filteredData, setFilteredData] = useState(null); // Données filtrées (null au départ)
    const [zones, setZones] = useState([]); // Zones disponibles

    // Vérification des rôles : seuls les utilisateurs avec les rôles 1 et 5 sont autorisés
    const loading = useAuthGuard([1, 5]);

    // Charger les données initiales et extraire les zones uniques
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.1.18:4000/api/palette/palette');
                const fetchedData = response.data;
                setData(fetchedData);

                // Extraire les zones uniques
                const uniqueZones = [...new Set(fetchedData.map((item) => item.Zone_Livraison))];
                setZones(uniqueZones);

                console.log('Données brutes récupérées depuis l’API :', fetchedData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, []);

    // Gestion des filtres
    const handleFilter = ({ week, zone }) => {
        console.log('Filtres appliqués :', { week, zone });

        let filtered = [...data];

        // Filtrer par semaine
        if (week) {
            const selectedWeekStart = isoWeekToDate(week);
            if (!selectedWeekStart) {
                console.error('Semaine sélectionnée invalide :', week);
                return;
            }
            const selectedWeekEnd = new Date(selectedWeekStart);
            selectedWeekEnd.setDate(selectedWeekEnd.getDate() + 6);

            console.log('Semaine sélectionnée :', {
                start: selectedWeekStart.toISOString().split('T')[0],
                end: selectedWeekEnd.toISOString().split('T')[0],
            });

            filtered = filtered.filter((item) => {
                const deliveryDate = new Date(item.Date_Livraison);
                if (isNaN(deliveryDate)) {
                    console.error('Date de livraison invalide :', item.Date_Livraison);
                    return false;
                }
                return deliveryDate >= selectedWeekStart && deliveryDate <= selectedWeekEnd;
            });
        }

        // Filtrer par zone
        if (zone) {
            console.log('Zone sélectionnée :', zone);
            filtered = filtered.filter((item) => item.Zone_Livraison === zone);
        }

        console.log('Résultat après filtrage :', filtered);
        setFilteredData(filtered); // Met à jour uniquement après l'application des filtres
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <main className="flex flex-col min-h-screen bg-sky-950">
            <div className="flex flex-1">
                <div className="w-64 h-full p-4">
                    <SidebarCard />
                </div>
                <div className="flex-1 h-full p-4 ml-4">
                    <FilterPalette zones={zones} onFilter={handleFilter} />
                    {filteredData !== null ? ( // Afficher le tableau uniquement si les filtres sont appliqués
                        <PaletteTable data={filteredData} />
                    ) : (
                        <div className="text-center text-gray-300">
                            Veuillez appliquer des filtres pour afficher les commandes.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Palettes;
