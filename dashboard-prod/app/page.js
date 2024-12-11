'use client';

import useUserStore from '@/store/userStore';
import SidebarCard from '@/components/SidebarCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function Home() {
  const router = useRouter();
  const { userLevel, token } = useUserStore();
  const [loading, setLoading] = useState(true);

  // Redirection si l'utilisateur n'est pas connecté ou n'a pas le bon rôle
  useEffect(() => {
    if (!userLevel) {
      router.push('/connexion'); // Redirige si non connecté
    } else if (userLevel > 4) {
      router.push('/'); // Redirige si rôle non autorisé
    } else {
      setLoading(false); // L'utilisateur est connecté et autorisé
    }
  }, [userLevel, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex flex-col h-screen bg-sky-950">
      {/* Conteneur principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 h-full p-4">
          <SidebarCard />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 h-full p-4 ml-4">
          {/* Ajoutez ici votre contenu spécifique */}
        </div>
      </div>
    </main>
  );
}

export default Home;
