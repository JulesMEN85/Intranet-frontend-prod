"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import SidebarCard from "@/components/SidebarCard";
import StatsEncodeur from "@/components/statsEncodeur"; // Import du composant des cartes

const StatsPage = () => {
  // Utilisation du hook pour vérifier l'authentification
  const loading = useAuthGuard([1, 3]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex h-screen bg-sky-950 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-full p-4 bg-sky-950 shadow-lg flex flex-col">
        <SidebarCard />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-4 ml-4 rounded-lg shadow-lg flex flex-col justify-start">
        <div className="h-full flex flex-col gap-4">
          {/* Intégration des cartes */}
          <StatsEncodeur />
        </div>
      </div>
    </main>
  );
};

export default StatsPage;
