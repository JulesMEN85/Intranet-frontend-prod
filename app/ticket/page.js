"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import SidebarCard from "@/components/SidebarCard";
import TicketForm from "@/components/TicketForm";

const Page = () => {
  const loading = useAuthGuard([1, 2, 6]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-sky-950">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-sky-950 overflow-hidden">
      <main className="flex flex-row h-full w-full">
        {/* Sidebar */}
        <div className="w-64 h-full bg-sky-950 p-4">
          <SidebarCard />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 h-full p-6 overflow-x-hidden">
          <div className="bg-sky-900 shadow-lg rounded-lg p-6 w-full">
            <h1 className="text-2xl font-bold text-white mb-4">
              Création d'un Ticket
            </h1>

            {/* Formulaire pour créer un ticket */}
            <div className="mb-6">
              <TicketForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
