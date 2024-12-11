import { useState, useEffect } from "react";

const SettingsPage = () => {
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80" // Image actuelle par défaut
  );
  const [service, setService] = useState(null); // Stocke le service récupéré
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  // Fonction pour récupérer les informations du service depuis le backend
  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Token manquant. Veuillez vous reconnecter.");
        }

        const response = await fetch("http://localhost:4000/api/services/user-service", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération du service : ${response.statusText}`);
        }

        const data = await response.json();
        setService(data.role || "Service non défini"); // Met à jour le service avec les données
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchService();
  }, []);

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token manquant. L'utilisateur n'est pas authentifié.");
      alert("Veuillez vous reconnecter. Token d'authentification manquant.");
      return;
    }

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await fetch("http://localhost:4000/api/user/upload-avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setImage(data.avatarUrl);
          alert("Votre avatar a été mis à jour avec succès !");
        } else {
          throw new Error(data.message || "Une erreur est survenue lors de la mise à jour de l'avatar.");
        }
      } catch (error) {
        console.error(error.message);
        alert(error.message);
      }
    }
  };

  // Fonction pour réinitialiser l'image
  const resetImage = () => {
    setImage(
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
    );
  };
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      {/* Organisation en sections */}
      <div className="space-y-6">
        {/* Section : Organization Name */}
        <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 pb-6">
          <div className="col-span-6">
            <h2 className="text-sm font-semibold text-gray-700">Service</h2>
            <p className="text-sm text-gray-500">
              Information concernant le service de la personne
            </p>
          </div>
          <div className="col-span-6">
            {/* Label affichant le service */}
            <span className="text-sm font-medium text-gray-900">{service || "Chargement..."}</span>
          </div>
        </div>

        {/* Section : Organization Bio */}
        <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 pb-6">
          <div className="col-span-6">
            <h2 className="text-sm font-semibold text-gray-700">Détail de la tâche</h2>
            <p className="text-sm text-gray-500">
              Détaillez la tâche que vous effectuez au sein de votre service
            </p>
          </div>
          <div className="col-span-6">
            <textarea
              placeholder="Entrez votre texte ici..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* Section : Organization Email */}
        <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 pb-6">
          <div className="col-span-6">
            <h2 className="text-sm font-semibold text-gray-700">Email</h2>
            <p className="text-sm text-gray-500">
              Voici votre mail relié à votre compte 
            </p>
          </div>
          <div className="col-span-6">
            <div className="flex items-center space-x-4">
              <input
                type="email"
                placeholder="info@example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section : Address */}
        <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 pb-6">
          <div className="col-span-6">
            <h2 className="text-sm font-semibold text-gray-700">Informations personnelles</h2>
            <p className="text-sm text-gray-500">
              Informations personnelles concernant le compte 
            </p>
          </div>
          <div className="col-span-6 space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Nom"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Prénom"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            <input
              type="text"
              placeholder="Ligne téléphonique"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Section : Photo de profil */}
        <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 pb-6">
          <div className="col-span-6">
            <h2 className="text-sm font-semibold text-gray-700">Photo de profil</h2>
            <p className="text-sm text-gray-500">Sélectionnez une nouvelle photo de profil</p>
          </div>
          <div className="col-span-6">
            <form className="flex items-center space-x-6">
              <div className="shrink-0">
                <img
                  className="h-16 w-16 object-cover rounded-full"
                  src={image}
                  alt="Current profile photo"
                />
              </div>
              <label className="block">
                <span className="sr-only">Choisir une photo de profil</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                />
              </label>
            </form>
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={resetImage}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          Réinitialiser
        </button>
        <button
          className="px-4 py-2 bg-sky-950 text-white rounded-md hover:bg-sky-800 transition-colors duration-200"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
