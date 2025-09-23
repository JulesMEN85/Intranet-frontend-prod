"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import SidebarCard from "@/components/SidebarCard";
import FilterForm from "@/components/FilterForm";
import ResultsTable from "@/components/ResultsTable";
import { useState } from "react";

const Page = () => {
  const loading = useAuthGuard([1, 2, 6]);

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async (filters) => {
    const { filterType, filterValue, startDate, endDate } = filters;

    setLoadingData(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/statscompta?startDate=${startDate}&endDate=${endDate}&filterType=${filterType}&filterValue=${filterValue}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

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
              Statistiques Comptables
            </h1>
            <div className="mb-6">
              <FilterForm onFilterSubmit={fetchStats} />
            </div>
            {loadingData && <p className="text-white">Chargement des données...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="overflow-x-auto">
              <ResultsTable data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
