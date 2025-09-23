"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useState } from "react";
import SidebarCard from "@/components/SidebarCard";

const DelaisLivraisonsPage = () => {
  const [data, setData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  // Utilisation du hook pour vérifier l'authentification
  const loading = useAuthGuard([1, 3, 5, 6]);

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

        {/* Contenu principal */}
        <div className="flex-1 h-full p-4 ml-4">
          {/* Ajoutez ici votre contenu spécifique */}
          {/* Exemple : TdcCard */}
          <div>
            {/* Contenu ou informations supplémentaires */}
            {/* Utilisez les états data et orderData pour afficher les données */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DelaisLivraisonsPage;
