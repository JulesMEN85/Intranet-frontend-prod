"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import TdcFilter from "@/components/TdcFilter";
import SidebarCard from "@/components/SidebarCard";
import Maxsemaine from "@/components/maxsemaine";

const PostesPage = () => {
  // 🔒 Vérification des rôles autorisés (1 et 3)
  const loading = useAuthGuard([1, 3]);

  const [selectedWeek, setSelectedWeek] = useState(""); // ✅ Semaine sélectionnée
  const sidebarRef = useRef(null); // ✅ Référence pour la sidebar
  const [sidebarHeight, setSidebarHeight] = useState(0); // ✅ État pour la hauteur

  useEffect(() => {
    if (sidebarRef.current) {
      setSidebarHeight(sidebarRef.current.offsetHeight); // ✅ Récupérer la hauteur de la sidebar
    }
  }, []);

  // ⏳ Affichage du chargement tant que l'authentification est en cours
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex flex-col min-h-screen w-full bg-sky-950">
      <div className="w-full">
        <TdcFilter setSelectedWeek={setSelectedWeek} /> {/* ✅ Passage de la semaine */}
      </div>

      <div className="flex flex-1">
        <div className="w-64 h-full p-4" ref={sidebarRef}> {/* ✅ Ajout de la référence */}
          <SidebarCard />
        </div>

        <div className="flex-1 mx-4">
          <Maxsemaine selectedWeek={selectedWeek} sidebarHeight={sidebarHeight} /> {/* ✅ Passage de la hauteur */}
        </div>
      </div>
    </main>
  );
};

export default PostesPage;
