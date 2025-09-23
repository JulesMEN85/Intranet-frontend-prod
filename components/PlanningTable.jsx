"use client";

const PlanningTable = ({ data }) => {
    return (
        <div className="overflow-auto bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Tableau des plannings</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Nom</th>
                        <th className="border border-gray-300 p-2">Semaine</th>
                        <th className="border border-gray-300 p-2">Lundi</th>
                        <th className="border border-gray-300 p-2">Mardi</th>
                        <th className="border border-gray-300 p-2">Mercredi</th>
                        <th className="border border-gray-300 p-2">Jeudi</th>
                        <th className="border border-gray-300 p-2">Vendredi</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((planning, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 p-2">{planning.personnel_name}</td>
                                <td className="border border-gray-300 p-2">{planning.semaine}</td>
                                <td className="border border-gray-300 p-2">{planning.lundi || "-"}</td>
                                <td className="border border-gray-300 p-2">{planning.mardi || "-"}</td>
                                <td className="border border-gray-300 p-2">{planning.mercredi || "-"}</td>
                                <td className="border border-gray-300 p-2">{planning.jeudi || "-"}</td>
                                <td className="border border-gray-300 p-2">{planning.vendredi || "-"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-2">
                                Aucun planning disponible pour cette période.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PlanningTable;
