// components/TdcCard.jsx
const TdcCard = () => {
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
      {/* Première carte */}
      <div className="bg-gray-100 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenue dans l&apos;espace &quot;Taux de Charge&quot;
        </h1>
        <p className="mt-4 text-gray-600">
          Utilisez cet espace pour analyser et visualiser les données relatives au taux de charge.
          Vous pouvez naviguer dans la sidebar pour accéder à d&apos;autres fonctionnalités.
        </p>
      </div>

      {/* Section des statistiques */}
      <div className="bg-gray-50 shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Derniers 30 jours</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Statistique 1 */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700">Total Subscribers</h3>
            <p className="text-3xl font-bold text-blue-700">
              71,897 <span className="text-sm font-normal text-gray-500">from 70,946</span>
            </p>
            <p className="mt-2 text-sm text-green-500 font-medium flex items-center">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2">▲ 12%</span>
            </p>
          </div>

          {/* Statistique 2 */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700">Avg. Open Rate</h3>
            <p className="text-3xl font-bold text-blue-700">
              58.16% <span className="text-sm font-normal text-gray-500">from 56.14%</span>
            </p>
            <p className="mt-2 text-sm text-green-500 font-medium flex items-center">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2">▲ 2.02%</span>
            </p>
          </div>

          {/* Statistique 3 */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700">Avg. Click Rate</h3>
            <p className="text-3xl font-bold text-blue-700">
              24.57% <span className="text-sm font-normal text-gray-500">from 28.62%</span>
            </p>
            <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full mr-2">▼ 4.05%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TdcCard;
