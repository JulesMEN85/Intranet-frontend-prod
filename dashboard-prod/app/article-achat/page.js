'use client';

import { useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SidebarCard from '@/components/SidebarCard';
import TableArticle from '@/components/TableArticle'; // Importation du composant

const TauxDeChargePage = () => {
    const loading = useAuthGuard([1, 4]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <main className="flex flex-col h-screen bg-sky-950">
            <div className="flex flex-1">
                <div className="w-64 h-full p-4">
                    <SidebarCard />
                </div>
                <div className="flex-1 p-4 ml-4">
                    <TableArticle/>
                </div>
            </div>
        </main>
    );
};

export default TauxDeChargePage;
