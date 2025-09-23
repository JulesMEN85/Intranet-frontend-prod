"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import SidebarCard from "@/components/SidebarCard";
import EncodeurProcessingTime from "@/components/EncodeurProcessingTime";

const Page = () => {
  // Utilisation du hook pour vérifier l'authentification
  const loading = useAuthGuard([1, 3]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex h-screen bg-sky-950 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-full p-4 bg-sky-950 shadow-lg">
        <SidebarCard />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 h-full p-4 ml-4 bg-sky-950 rounded-lg shadow-lg">
        <EncodeurProcessingTime />
      </div>
    </main>
  );
};

export default Page;
