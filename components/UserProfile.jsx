import { useState, useEffect } from "react";
import useUserStore from '@/store/userStore';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from "next/navigation";
const UserProfile = ({ user, onUpdateAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || "https://via.placeholder.com/40");

const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function capitalizeWords(fullName) {
    if (!fullName) return fullName;
    fullName = fullName.split("@")[0];
    fullName = fullName.replace(".", " ");
    return fullName
      .split(' ')                     
      .map(word =>                   
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
      )
      .join(' ');                    
  }

  const { userLevel, token } = useUserStore();
const pathname = usePathname();
  const userState = useUserStore();  
  const deleteToken = () => {
    userState.removeAll();
    localStorage.clear();
  };



  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
  
    try {
      const response = await fetch("http://localhost:4000/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        setAvatar(data.avatarUrl); // Met à jour l'image affichée
        if (onUpdateAvatar) onUpdateAvatar(data.avatarUrl); // Notifie le parent
      } else {
        console.error("Erreur lors du téléchargement de l'image");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };
  
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl); // Affiche l'image localement avant upload
      uploadAvatar(file); // Envoie l'image au backend
    }
  };

  return (
    <div
      className="relative w-full bg-white p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
      onClick={toggleDropdown}
    >
      {/* Contenu principal */}
      <div className="flex items-center justify-between">
        {/* Image de profil */}
        <div className="flex items-center space-x-3">
          <img
            src={avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-900 truncate max-w-full">
              { capitalizeWords(user.email) || user.name || user.email.split("@")[0] || "Utilisateur"}
            </p>
            <p className="text-sm text-gray-500 truncate max-w-full">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute top-0 right-0 mt-[-9rem] bg-white border border-gray-200 rounded-lg shadow-lg w-56">
          <ul className="py-2">
            <li>
              <a
                href="/paramcompte"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white mr-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                    clipRule="evenodd"
                  />
                </svg>
                Mon compte
              </a>
            </li>
            <li className="border-t border-gray-200 mx-4"></li>
            
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.644 3.066a1 1 0 0 1 .712 0l7 2.666A1 1 0 0 1 20 6.68a17.694 17.694 0 0 1-2.023 7.98 17.406 17.406 0 0 1-5.402 6.158 1 1 0 0 1-1.15 0 17.405 17.405 0 0 1-5.403-6.157A17.695 17.695 0 0 1 4 6.68a1 1 0 0 1 .644-.949l7-2.666Zm4.014 7.187a1 1 0 0 0-1.316-1.506l-3.296 2.884-.839-.838a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.366.046l4-3.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                Privacy policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                </svg>
                Share feedback
              </a>
            </li>
            <li className="border-t border-gray-200 mx-4"></li>
            <li>
              <Link
                href={token && userLevel ? "/" : "/connexion"}
                passHref
                onClick={token && userLevel ? () => deleteToken() : null}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-400"
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
                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  />
                </svg>
                {token && userLevel ? 'Déconnexion' : 'Connexion'}
              </Link>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
