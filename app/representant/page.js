"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import SidebarCard from "@/components/SidebarCard";
import RepresentantClients from "@/components/RepresentantClients";

const Page = () => {
  // Utilisation du hook pour vérifier l'authentification
  const loading = useAuthGuard([1, 2, 3, 6]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex flex-col min-h-screen bg-sky-950">
      {/* Conteneur principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 h-full p-4">
          <SidebarCard />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 h-full p-4 ml-4">
          <RepresentantClients />
        </div>
      </div>
    </main>
  );
};

export default Page;
