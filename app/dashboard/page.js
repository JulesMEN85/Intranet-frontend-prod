'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import SidebarCard from '@/components/SidebarCard';
import Accordion from '@/components/Accordion';
import TableMEN85 from '@/components/TableMEN85';
import TableBL85 from '@/components/TableBL85';
import TableFACT85 from '@/components/TableFACT85';
import { Button } from '@/components/ui/button';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import Alert from '@/components/Alert';
import { baseURL } from '@/utils/baseURL';

const Pagination = ({ nbPage, activeYear, setActiveYear }) => {
  if (!nbPage || nbPage.length === 0) {
    return <div className="text-white">Aucune année disponible</div>;
  }

  return (
    <div className="mx-5 space-x-2">
      {nbPage.map((year, index) => (
        <Button
          variant="outline"
          key={`${year.date}-${index}`}
          onClick={() => {
            setActiveYear(year.date);
            console.log('Année sélectionnée :', year.date); // Log pour débogage
          }}
          className={`${
            year.date === activeYear
              ? 'border-blue-900 bg-blue-800 text-white'
              : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-200'
          }`}
        >
          {year.date}
        </Button>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [entreprise, setEntreprise] = useState('CDE HT'); // Par défaut
  const [data, setData] = useState(null);
  const [nbPage, setNbPage] = useState([]);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear()); // Année actuelle
  const router = useRouter();
  const { userLevel, token } = useUserStore();

  // Vérification des rôles autorisés
  const loading = useAuthGuard([1, 2, 6]);

  useEffect(() => {
    if (!userLevel) {
      router.push(`/connexion`);
    } else if (userLevel > 6) {
      router.push(`/`);
    }
  }, [userLevel, router]);

  // Récupère les années disponibles en fonction de l'entreprise
  useEffect(() => {
    const fetchYears = async () => {
      if (!token) {
        console.error('Erreur : le token est null ou non défini.');
        return;
      }

      try {
        console.log('Token envoyé pour la requête :', token);
        const response = await fetch(`${baseURL}/dashboard/years/allYears/${entreprise}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des années.');
        }

        const years = await response.json();
        console.log('Années disponibles récupérées :', years);

        setNbPage(years);

        const currentYear = new Date().getFullYear();
        if (years.some((year) => year.date === currentYear)) {
          setActiveYear(currentYear);
        } else if (years.length > 0) {
          setActiveYear(years[0].date);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des années :', error);
      }
    };

    fetchYears();
  }, [entreprise, token]);

  // Requête déclenchée par la sélection de l'année ou de l'entreprise
  useEffect(() => {
    const fetchData = async () => {
      if (!activeYear || !entreprise) {
        console.error('Erreur : Année ou entreprise non définie.');
        return;
      }

      try {
        console.log(`Requête pour ${entreprise} et année ${activeYear}`);
        let response;

        if (entreprise === 'CDE HT') {
          response = await fetch(`${baseURL}/dashboard/getData/${activeYear}/CDE HT`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } else if (entreprise === 'BL HT') {
          response = await fetch(`${baseURL}/dashboard/getBLData/${activeYear}/BL HT`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } else if (entreprise === 'FACT HT') {
          response = await fetch(`${baseURL}/dashboard/getFactureData/${activeYear}/FACT HT`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        }

        if (!response.ok) {
          throw new Error('Erreur lors de l\'appel API.');
        }

        const responseData = await response.json();
        console.log('Données récupérées :', responseData);
        setData(responseData);
      } catch (error) {
        console.error('Erreur lors de l\'appel API :', error);
      }
    };

    fetchData();
  }, [activeYear, entreprise]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <main className="flex flex-col min-h-screen bg-sky-950">
      <div className="flex flex-1">
        <div className="w-64 h-full p-4">
          <SidebarCard />
        </div>
        <div className="flex-1 h-full p-12 max-xl:p-10">
          <div className="flex flex-col max-sm:space-y-4">
            <div className="flex space-x-4 mb-4">
              <Button
                variant="outline"
                className={`${
                  entreprise === 'CDE HT'
                    ? 'border-blue-900 bg-blue-800 text-white'
                    : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setEntreprise('CDE HT')}
              >
                CDE HT
              </Button>
              <Button
                variant="outline"
                className={`${
                  entreprise === 'BL HT'
                    ? 'border-blue-900 bg-blue-800 text-white'
                    : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setEntreprise('BL HT')}
              >
                BL HT
              </Button>
              <Button
                variant="outline"
                className={`${
                  entreprise === 'FACT HT'
                    ? 'border-blue-900 bg-blue-800 text-white'
                    : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setEntreprise('FACT HT')}
              >
                FACT HT
              </Button>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
              <Pagination nbPage={nbPage} activeYear={activeYear} setActiveYear={setActiveYear} />
            </Suspense>
          </div>

          {typeof data === 'string' ? (
            <Alert codeError={500}>{data}</Alert>
          ) : (
            <div className="grid my-5 grid-cols-2 gap-5 max-lg:grid-cols-1">
              {data &&
                Object.keys(data).map((month, index) => {
                  console.log('Mois affiché dans Accordion:', month);
                  const monthData = data[month];
                  return (
                    <Accordion month={month} key={index}>
                      {entreprise === 'CDE HT' ? (
                        <TableMEN85 data={monthData} />
                      ) : entreprise === 'BL HT' ? (
                        <TableBL85 data={monthData} />
                      ) : (
                        <TableFACT85 data={monthData} />
                      )}
                    </Accordion>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
