'use client';

import { useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SidebarCard from '@/components/SidebarCard';
import TableArticle from '@/components/TableArticle'; // Importation du composant

const TauxDeChargePage = () => {
    const loading = useAuthGuard([1, 4, 6]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <main className="flex flex-col h-screen w-screen bg-sky-950">
            <div className="flex flex-1 w-full h-full pt-6"> {/* Padding ajouté au-dessus */}
                {/* Sidebar */}
                <div className="w-64 h-full p-4 bg-sky-950">
                    <SidebarCard />
                </div>
                {/* Table */}
                <div className="flex-1 p-4 ml-4 h-full bg-sky-950">
                    <div className="w-[95%] mx-auto"> {/* Réduction légère de TableArticle */}
                        <TableArticle />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TauxDeChargePage;
