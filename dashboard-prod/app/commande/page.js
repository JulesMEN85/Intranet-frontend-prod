'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import SidebarCard from '@/components/SidebarCard';
import FournisseurFilter from '@/components/FournisseurFilter';
import { useState } from 'react';
import TableOrder from '@/components/TableOrder';

const Commande = () => {
  const [data, setData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  // Vérification des rôles : seuls les utilisateurs avec les rôles 1 et 4 sont autorisés
  const loading = useAuthGuard([1, 4]);

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
          <FournisseurFilter setData={setData} setOrderData={setOrderData} pageName="commande" />
          <TableOrder data={data} orderData={orderData} />
        </div>
      </div>
    </main>
  );
};

export default Commande;
