"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import UserProfile from "./UserProfile";
import axios from "axios";
import useUserStore from "@/store/userStore";


const SidebarCard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubMenuComptabilite, setShowSubMenuComptabilite] = useState(false);
  const [showSubMenuAchat, setShowSubMenuAchat] = useState(false);
  const [showSubMenuVente, setShowSubMenuVente] = useState(false);
  const [showSubMenuAtelier, setShowSubMenuAtelier] = useState(false);
  const [showSubMenuTauxDeCharge, setShowSubMenuTauxDeCharge] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // État pour gérer la visibilité de la sidebar
  const { userLevel } = useUserStore(); // Récupération directe du rôle utilisateur depuis le store


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
  
        // Vérification si le token est présent
        if (!token) {
          console.warn("Token manquant. Veuillez vous connecter.");
          setIsLoading(false);
          return; // Arrête l'exécution si le token est absent
        }
  
        const response = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status !== 200) throw new Error(`Échec : ${response.statusText}`);
        setUser(response.data);
  
        // Debugging pour vérifier le rôle récupéré
        console.log("Rôle utilisateur récupéré :", response.data.role);
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Erreur inconnue lors de la récupération des données utilisateur."
        );
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUser();
  
    // Gestion de l'état initial de la sidebar (ex: localStorage pour sauvegarder l'état)
    const savedSidebarState = localStorage.getItem("sidebarVisible");
    if (savedSidebarState !== null) {
      setIsSidebarVisible(savedSidebarState === "true");
    }
  
    // Ajout d'un écouteur pour fermer la sidebar sur une fenêtre réduite
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarVisible(false);
      }
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);  

  // Fonction pour vérifier si l'utilisateur a un rôle autorisé
  const hasRole = (roles) => {
    if (!userLevel) return false; // Si aucun rôle récupéré, l'utilisateur n'a pas accès
    const numericUserLevel = parseInt(userLevel, 10); // Conversion pour éviter les problèmes de type
    return roles.includes(numericUserLevel); // Comparaison des rôles autorisés
  };
  

  return (
    <div className="relative">
    <Card className="w-64 h-[calc(100vh-6rem)] flex flex-col bg-white">
      <CardHeader className="p-4 text-center">
        <CardTitle className="text-lg font-bold">Menu</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-y-auto flex flex-col items-center">
        <nav className="flex flex-col space-y-4 w-full">
          {/* Menu Comptabilité - visible uniquement pour les rôles 1 et 2 */}
          {hasRole([1, 2, 6]) && (
              <div>
                <button
              className="flex items-center justify-between w-full text-slate-700 dark:text-slate-300 hover:underline"
              onClick={() => setShowSubMenuComptabilite(!showSubMenuComptabilite)}
            >
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 14h-2.722L11 20.278a5.511 5.511 0 0 1-.9.722H20a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM9 3H4a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V4a1 1 0 0 0-1-1ZM6.5 18.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM19.132 7.9 15.6 4.368a1 1 0 0 0-1.414 0L12 6.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                </svg>
                Comptabilité
              </span>
              <svg
                className={`w-[17px] h-[17px] text-gray-800 dark:text-white transform transition-transform duration-300 ${
                  showSubMenuComptabilite ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16.881 16H7.119a1 1 0 0 1-.772-1.636l4.881-5.927a1 1 0 0 1 1.544 0l4.88 5.927a1 1 0 0 1-.77 1.636Z"
                />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showSubMenuComptabilite ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col mt-2 ml-6 space-y-2">
                <Link href="/dashboard" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Chiffre d&apos;affaires
                </Link>
                <Link href="/representant" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Représentant
                </Link>
                <Link href="/statscompta" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Statistiques
                </Link>
              </div>
            </div>
          </div>
        )}

          {/* Menu Achat - visible uniquement pour les rôles 1 et 4 */}
        {hasRole([1, 4, 6]) && (
          <div>
            <button
              className="flex items-center justify-between w-full text-slate-700 dark:text-slate-300 hover:underline"
              onClick={() => setShowSubMenuAchat(!showSubMenuAchat)}
            >
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                  />
                </svg>
                Achat
              </span>
              <svg
                className={`w-[17px] h-[17px] text-gray-800 dark:text-white transform transition-transform duration-300 ${
                  showSubMenuAchat ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16.881 16H7.119a1 1 0 0 1-.772-1.636l4.881-5.927a1 1 0 0 1 1.544 0l4.88 5.927a1 1 0 0 1-.77 1.636Z"
                />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showSubMenuAchat ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col mt-2 ml-6 space-y-2">
                <Link href="/commande" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Commandes achat
                </Link>
                <Link href="/article-achat" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Articles
                </Link>
                <Link href="/achat/rapports" className="text-slate-700 dark:text-slate-300 hover:underline">
                  QualitySet
                </Link>
              </div>
            </div>
          </div>
        )}


          {/* Menu Vente */}
        {hasRole([1, 3]) && (
          <div>
            <button
              className="flex items-center justify-between w-full text-slate-700 dark:text-slate-300 hover:underline"
              onClick={() => setShowSubMenuVente(!showSubMenuVente)}
            >
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 18h14M5 18v3h14v-3M5 18l1-9h12l1 9M16 6v3m-4-3v3m-2-6h8v3h-8V3Zm-1 9h.01v.01H9V12Zm3 0h.01v.01H12V12Zm3 0h.01v.01H15V12Zm-6 3h.01v.01H9V15Zm3 0h.01v.01H12V15Zm3 0h.01v.01H15V15Z"
                  />
                </svg>
                Vente
              </span>
              <svg
                className={`w-[17px] h-[17px] text-gray-800 dark:text-white transform transition-transform duration-300 ${
                  showSubMenuVente ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16.881 16H7.119a1 1 0 0 1-.772-1.636l4.881-5.927a1 1 0 0 1 1.544 0l4.88 5.927a1 1 0 0 1-.77 1.636Z"
                />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showSubMenuVente ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col mt-2 ml-6 space-y-2">
                <Link href="/remiseclient" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Remise client
                </Link>
                <Link href="/encodeur" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Statistiques
                </Link>
                <Link href="/comparaisonvente" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Comparer
                </Link>
                <Link href="/psl" className="text-slate-700 dark:text-slate-300 hover:underline">
                  N° commande PSL
                </Link>
              </div>
            </div>
          </div>
        )}

          {/* Menu Atelier */}
        {hasRole([1, 5]) && (
          <div>
            <button
              className="flex items-center justify-between w-full text-slate-700 dark:text-slate-300 hover:underline"
              onClick={() => setShowSubMenuAtelier(!showSubMenuAtelier)}
            >
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                  />
                </svg>
                Atelier
              </span>
              <svg
                className={`w-[17px] h-[17px] text-gray-800 dark:text-white transform transition-transform duration-300 ${
                  showSubMenuAtelier ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16.881 16H7.119a1 1 0 0 1-.772-1.636l4.881-5.927a1 1 0 0 1 1.544 0l4.88 5.927a1 1 0 0 1-.77 1.636Z"
                />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showSubMenuAtelier ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col mt-2 ml-6 space-y-2">
                <Link href="/palettes" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Palettes
                </Link>
                <Link href="/atelier/maintenance" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Maintenance
                </Link>
                <Link href="/atelier/planification" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Planification
                </Link>
              </div>
            </div>
          </div>
        )}

          {/* Menu Taux de Charge */}
        {hasRole([1, 2, 3, 4, 5, 6]) && (
          <div>
            <button
              className="flex items-center justify-between w-full text-slate-700 dark:text-slate-300 hover:underline"
              onClick={() => setShowSubMenuTauxDeCharge(!showSubMenuTauxDeCharge)}
            >
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
                  />
                </svg>
                Taux de Charge
              </span>
              <svg
                className={`w-[17px] h-[17px] text-gray-800 dark:text-white transform transition-transform duration-300 ${
                  showSubMenuTauxDeCharge ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16.881 16H7.119a1 1 0 0 1-.772-1.636l4.881-5.927a1 1 0 0 1 1.544 0l4.88 5.927a1 1 0 0 1-.77 1.636Z"
                />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showSubMenuTauxDeCharge ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col mt-2 ml-6 space-y-2">
                <Link href="/personnels" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Personnels
                </Link>
                <Link href="/postes" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Assignations
                </Link>
                <Link href="/maxsemaine" className="text-slate-700 dark:text-slate-300 hover:underline">
                  Max / semaine
                </Link>
              </div>
            </div>
          </div>
        )}

        </nav>
      </CardContent>
      <CardFooter className="p-2.5 flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : user ? (
          <UserProfile user={user} />
        ) : (
          <div className="text-center text-red-500">Erreur : Impossible de récupérer les informations utilisateur.</div>
        )}
      </CardFooter>
    </Card>
  </div>
  );
};

export default SidebarCard;
