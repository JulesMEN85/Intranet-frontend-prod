import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StatsTempsChart = ({ tempsData }) => (
  <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center hover:shadow-2xl transition-transform duration-300 ease-out min-w-[320px] min-h-[250px] relative hover:ring-4 hover:ring-blue-300/50">
    <h2 className="text-2xl font-bold mb-4">⏳ Temps Saisi vs Disponible</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={tempsData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="poste" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="saisi" fill="#FF6347" name="Temps Saisi" />
        <Bar dataKey="dispo" fill="#00C49F" name="Temps Disponible" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default StatsTempsChart;
