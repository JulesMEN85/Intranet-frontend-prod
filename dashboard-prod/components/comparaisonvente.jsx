import React, { useState } from "react";
import { Button } from "@/components/ui/button";


const Comparaison = () => {
  const [months, setMonths] = useState(["", ""]); // Liste dynamique des mois
  const [comparisonData, setComparisonData] = useState([]); // Données comparées
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComparisonData = async () => {
    if (months.some((month) => month === "")) {
      setError("Veuillez sélectionner tous les mois avant de comparer.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Envoyer les mois comme un paramètre multiple au backend
      const response = await fetch(
        `/api/encodeurs/compare-months?months=${months.join("&months=")}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }

      const data = await response.json();
      console.log("Données reçues :", data);
      setComparisonData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un mois
  const addMonth = () => {
    setMonths([...months, ""]);
  };

  // Supprimer un mois
  const removeMonth = (index) => {
    setMonths(months.filter((_, i) => i !== index));
    setComparisonData([]);
  };

  // Calcul des totaux pour un mois donné
  const calculateTotals = (monthData) => {
    if (!monthData || monthData.data.length === 0) {
      return { totalTVA: 0, totalHTVA: 0, totalCommands: 0 };
    }
    return monthData.data.reduce(
      (totals, day) => {
        totals.totalTVA += day.totalTVA;
        totals.totalHTVA += day.totalHTVA;
        totals.totalCommands += day.totalCommands;
        return totals;
      },
      { totalTVA: 0, totalHTVA: 0, totalCommands: 0 }
    );
  };

  // Formate les chiffres avec des espaces pour les milliers
  const formatNumber = (number) => {
    return new Intl.NumberFormat("fr-FR").format(number);
  };

  // Calcule les pourcentages de différence
  const calculatePercentage = (previousValue, currentValue) => {
    if (previousValue === 0 && currentValue === 0) return "0%";
    if (previousValue === 0) return "+100%";
    const percentage = ((currentValue - previousValue) / previousValue) * 100;
    return `${percentage > 0 ? "+" : ""}${percentage.toFixed(2)}%`;
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Comparaison de mois</h1>
  
        {/* Entrée des mois */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {months.map((month, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Mois {index + 1}
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => {
                    const newMonths = [...months];
                    newMonths[index] = e.target.value;
                    setMonths(newMonths);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {index > 1 && (
                <Button
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => removeMonth(index)}
                >
                  Supprimer
                </Button>
              )}
            </div>
          ))}
  
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={addMonth}
          >
            Ajouter un mois
          </Button>
        </div>
  
        {/* Boutons alignés */}
        <div className="flex justify-end space-x-4">
          <Button
            className="bg-sky-950 text-white hover:bg-sky-900"
            onClick={fetchComparisonData}
          >
            Comparer
          </Button>
        </div>
  
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
  
        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        )}
  
        {/* Résultats de la comparaison */}
        {comparisonData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {comparisonData.map((monthData, index) => {
              const totals = calculateTotals(monthData);
              const previousTotals =
                index > 0 ? calculateTotals(comparisonData[index - 1]) : null;
  
              return (
                <div key={index} className="bg-gray-100 p-6 rounded shadow">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Totaux pour Mois {index + 1} : {new Date(monthData.month).toLocaleString("fr-FR", { month: "long", year: "numeric" })}
                  </h2>
                  {["totalTVA", "totalHTVA", "totalCommands"].map((field, i) => (
                    <p key={i} className="text-sm text-gray-600 flex justify-between">
                      <span className="font-semibold">
                        {field === "totalTVA"
                          ? "Total TVA"
                          : field === "totalHTVA"
                          ? "Total HTVA"
                          : "Total Commandes"}{" "}
                        :
                      </span>
                      <span>
                        {formatNumber(totals[field])}
                        {field !== "totalCommands" ? " €" : " unités"}
                        {previousTotals && (
                          <span
                            className={`ml-2 ${
                              totals[field] > previousTotals[field]
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {totals[field] > previousTotals[field] ? "▲" : "▼"}{" "}
                            {calculatePercentage(previousTotals[field], totals[field])}
                          </span>
                        )}
                      </span>
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );  
};

export default Comparaison;
