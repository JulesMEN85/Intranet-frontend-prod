"use client";

import SidebarCard from "@/components/SidebarCard";
import TableFamille from "@/components/TableFamille";

export default function RemisePage() {
  return (
    <main className="flex flex-col min-h-screen bg-sky-950">
      <div className="flex flex-1">
        <div className="w-64 h-full p-4">
          <SidebarCard />
        </div>

        <div className="flex-1 h-full p-4 ml-4">
          <TableFamille />
        </div>
      </div>
    </main>
  );
}
