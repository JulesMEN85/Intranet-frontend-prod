"use client";

import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard"; // ✅ Import de la vérification des rôles
import TdcFilter from "@/components/TdcFilter";
import SidebarCard from "@/components/SidebarCard";
import PostesTable from "@/components/PostesTable";

const getCurrentWeek = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
  const year = startDate.getFullYear();
  const week = Math.ceil((((startDate - new Date(year, 0, 1)) / 86400000) + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

const PostesPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [data, setData] = useState([]);

  const loading = useAuthGuard([1]); // ✅ Autoriser uniquement les rôles = 1

  useEffect(() => {
    console.log(`✅ Semaine sélectionnée lors du chargement de la page : ${selectedWeek}`);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex flex-col min-h-screen w-full bg-sky-950">
      <div className="w-full">
        <TdcFilter setSelectedWeek={setSelectedWeek} setData={setData} />
      </div>

      <div className="flex flex-1">
        <div className="w-64 h-full p-4">
          <SidebarCard />
        </div>

        <div className="flex-1 overflow-auto p-4 mx-4">
          <PostesTable selectedWeek={selectedWeek} data={data} />
        </div>
      </div>
    </main>
  );
};

export default PostesPage;
