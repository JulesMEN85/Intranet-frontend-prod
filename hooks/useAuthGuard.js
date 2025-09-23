import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import { useEffect, useState } from 'react';

export const useAuthGuard = (allowedRoles) => {
  const router = useRouter();
  const { userLevel } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Rôle utilisateur :', userLevel);
    console.log('Rôles autorisés :', allowedRoles);

    if (userLevel === null) {
      console.log('En attente de mise à jour de userLevel...');
      return;
    }

    // Conversion en nombres pour éviter les problèmes de type
    const numericUserLevel = parseInt(userLevel, 10);
    const numericAllowedRoles = allowedRoles.map(role => parseInt(role, 10));

    console.log('userLevel après conversion :', numericUserLevel);
    console.log('Rôles autorisés après conversion :', numericAllowedRoles);

    if (!numericAllowedRoles.includes(numericUserLevel)) {
      console.log('Rôle non autorisé, redirection vers /unauthorized');
      setLoading(false); // Permet de stopper le chargement immédiatement
      router.replace('/unauthorized'); // Utilise `replace` pour éviter d'empiler l'historique
    } else {
      console.log('Accès autorisé, affichage de la page');
      setLoading(false);
    }
  }, [userLevel, allowedRoles, router]);

  return loading;
};
