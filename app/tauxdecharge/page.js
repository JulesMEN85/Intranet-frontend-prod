"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useState } from "react";
import SidebarCard from "@/components/SidebarCard";
import TdcCard from "@/components/TdcCard";

const TauxDeChargePage = () => {
  // Utilisation du hook pour vérifier l'authentification
  const loading = useAuthGuard([1, 2, 3, 4, 5,6]);

  const [data, setData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex flex-col h-screen bg-sky-950">
      {/* Conteneur principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 h-full p-4">
          <SidebarCard />
        </div>

        {/* Ajout de la marge entre la sidebar et la carte */}
        <div className="flex-1 h-full p-4 ml-4">
          <TdcCard />
        </div>
      </div>
    </main>
  );
};

export default TauxDeChargePage;
