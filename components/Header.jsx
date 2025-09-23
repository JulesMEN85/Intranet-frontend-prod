'use client'

import Link from 'next/link'
import { Button } from './ui/button';
import { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import { usePathname } from "next/navigation";

const Header = () => {
  const userState = useUserStore();
  const { userLevel, token } = useUserStore();
  const pathname = usePathname();
  
  
  useEffect(() => {
    userState.setUser({token: localStorage.getItem("token"), userLevel: localStorage.getItem("userLevel")});
  }, []);

  const deleteToken = () => {
    userState.removeAll();
    localStorage.clear();
  };

  return (
    <header className="flex px-5 py-3 bg-white text-sky-950">
      <nav className="max-w-full flex justify-center">
        <div className="w-[90vw] flex items-center justify-between">
          {/* Image en haut à gauche */}
          <div className="flex items-center">
          <img
            src="/images/LogoMEN851.png"
            alt="Logo"
            className="h-8 w-auto"
          />
          </div>
  
          {/* Bouton Connexion/Déconnexion */}
          <div className="ml-auto">
            <Link
              href={token && userLevel ? "/" : "/connexion"}
              passHref
              onClick={token && userLevel ? () => deleteToken() : null}
            >
              <Button variant="ghost" className={`${pathname === '/connexion' && 'bg-sky-50'}`}>
                {token && userLevel ? 'Déconnexion' : 'Connexion'}
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
  
};

export default Header;