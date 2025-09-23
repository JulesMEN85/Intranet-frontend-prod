export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-600">Accès interdit</h1>
      <p className="text-lg text-gray-700 mt-2">Vous n&apos;avez pas les autorisations nécessaires pour accéder à cette page.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">Retourner à l&apos;accueil</a>
    </div>
  );
}
