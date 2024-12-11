'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import SidebarCard from '@/components/SidebarCard';
import Accordion from '@/components/Accordion';
import TableMEN85 from '@/components/TableMEN85';
import TableBL85 from '@/components/TableBL85';
import TableFACT85 from '@/components/TableFACT85';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import { useState, useEffect, Suspense } from 'react';
import useUserStore from '@/store/userStore';
import Alert from '@/components/Alert';
import { baseURL } from '@/utils/baseURL';

const Pagination = ({ nbPage, onSubmit, entreprise }) => {
  const searchParams = useSearchParams();
  const yearParams = searchParams.get('year');

  return (
    <div className="mx-5 space-x-2">
      {nbPage.map((year, index) => (
        <Button
          variant="outline"
          key={`${year}${index}`}
          onClick={() => onSubmit({ entreprise, date: year.date })}
          className={`${
            parseInt(yearParams, 10) === year.date &&
            'border-cyan-900 bg-cyan-800 text-cyan-50 hover:bg-cyan-400'
          }`}
        >
          {year.date}
        </Button>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [entreprise, setEntreprise] = useState();
  const [data, setData] = useState(null);
  const [nbPage, setNbPage] = useState(null);

  // Vérification des rôles autorisés : 1 (Admin) et 2 (Comptabilité)
  const loading = useAuthGuard([1, 2]);

  const router = useRouter();
  const userState = useUserStore();
  const { userLevel, token } = useUserStore();

  useEffect(() => {
    if (!userLevel) {
      router.push(`/connexion`);
    } else if (userLevel > 4) {
      router.push(`/`);
    }
  }, [userLevel, router]);

  useEffect(() => {
    if (entreprise) {
      router.push(`/dashboard?company=${entreprise}&year=${nbPage[0].date}`);
    } else {
      router.push(`/dashboard`);
    }
  }, [entreprise, nbPage, router]);

  async function onSubmit(data) {
    console.log('Données soumises depuis le frontend :', data);
    const currentYear = new Date(Date.now()).getFullYear();

    let responseChart, responseAllYearDispo;

    if (!data.entreprise) {
      console.error('Erreur : entreprise non spécifiée dans onSubmit.');
      return;
    }

    try {
      if (data.entreprise === 'CDE HT') {
        responseChart = await fetch(
          `${baseURL}/dashboard/getData/${currentYear}/CDE HT`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        responseAllYearDispo = await fetch(
          `${baseURL}/dashboard/years/allYears/CDE HT`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
      } else if (data.entreprise === 'BL HT') {
        responseChart = await fetch(
          `${baseURL}/dashboard/getBLData/${currentYear}/BL HT`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        responseAllYearDispo = await fetch(
          `${baseURL}/dashboard/years/allYears/BL HT`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
      } else if (data.entreprise === 'FACT HT') {
        responseChart = await fetch(
          `${baseURL}/dashboard/getFactureData/${currentYear}/FACT HT`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        responseAllYearDispo = await fetch(
          `${baseURL}/dashboard/years/allYears/FACT HT`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
      }

      if (!responseChart.ok || !responseAllYearDispo.ok) {
        throw new Error('Erreur lors de l\'appel API.');
      }

      const responseYears = await responseAllYearDispo.json();
      const responseData = await responseChart.json();

      setNbPage(responseYears);
      setData(responseData);
      setEntreprise(data.entreprise);

      if (typeof responseData === 'string') {
        userState.removeAll();
        localStorage.clear();
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel API :', error);
    }
  }

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
          <div className="flex max-sm:flex-col max-sm:items-center max-sm:space-y-4">
            <ProfileForm onSubmit={onSubmit} userLevel={userLevel} />
            {data && typeof data !== 'string' && (
              <Suspense fallback={<div>Loading...</div>}>
                <Pagination nbPage={nbPage} onSubmit={onSubmit} entreprise={entreprise} />
              </Suspense>
            )}
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
