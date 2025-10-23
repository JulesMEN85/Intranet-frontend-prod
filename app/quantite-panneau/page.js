"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import SidebarCard from "@/components/SidebarCard";
import TableQuantitePanneauAchat from "@/components/TableQuantitePanneauAchat";

const QuantitePanneauAchatPage = () => {
  const loading = useAuthGuard([1, 3]);

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
          <TableQuantitePanneauAchat />
        </div>
      </div>
    </main>
  );
};

export default QuantitePanneauAchatPage;
