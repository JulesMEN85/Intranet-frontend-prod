## Creer un processus avec node-windows, pm2-installer et pm2:

### 1- configurer npm de manière à ce qu'il conserve ses fichiers globaux dans *C:\ProgramData\npm* :

#### Définir le chemin global pour les paquets npm :

Ouvrez un terminal ou un invite de commande avec des privilèges administratifs et exécutez les commandes suivantes :

```powershell
npm config set prefix "C:\ProgramData\npm"
```

#### Définir le chemin global pour le cache npm :

```powershell
npm config set cache "C:\ProgramData\npm-cache"
```

#### Ajouter le chemin global aux variables d'environnement :

Pour s'assurer que les exécutables installés globalement sont accessibles depuis n'importe quel terminal, ajoutez **C:\ProgramData\npm\bin** au PATH de votre système.

    Pour Windows 10 :
        Faites un clic droit sur le bouton Démarrer et sélectionnez Système.
        Cliquez sur Paramètres système avancés.
        Cliquez sur Variables d'environnement.
        Dans la section Variables système, recherchez et sélectionnez la variable Path, puis cliquez sur Modifier.
        Cliquez sur Nouveau et ajoutez C:\ProgramData\npm\bin.
        Cliquez sur OK pour fermer toutes les fenêtres.

Vérifier la configuration :
Après avoir effectué les modifications ci-dessus, vous pouvez vérifier la configuration actuelle de npm pour vous assurer qu'elle est correcte :

```bash
npm config get prefix
npm config get cache
```

Ces commandes devraient renvoyer C:\ProgramData\npm et C:\ProgramData\npm-cache respectivement.


#### Migration des Paquets Globaux Existant

Lister les Paquets Globaux Actuels :
```powershell
    npm ls -g --depth=0
```
Après avoir changé la configuration, vous pouvez réinstaller les paquets globaux listés précédemment :
```powershell
   npm install -g <package-name>
```
    

### 2- Créer le Répertoire C:\ProgramData\pm2 et Définir PM2_HOME :

Créer le Dossier **C:\ProgramData\pm2**

#### Définir la Variable d'Environnement PM2_HOME :

```powershell
[System.Environment]::SetEnvironmentVariable('PM2_HOME', 'C:\ProgramData\pm2', [System.EnvironmentVariableTarget]::Machine)
```

#### Définir les Permissions

Pour donner à l'utilisateur Local Service l'accès aux répertoires C:\ProgramData\npm et C:\ProgramData\pm2, vous pouvez utiliser la commande icacls :

**Définir les Permissions pour npm :**

```bash
icacls "C:\ProgramData\npm" /grant "LOCAL SERVICE:(OI)(CI)F"
```

**Définir les Permissions pour pm2 :**

```bash
icacls "C:\ProgramData\pm2" /grant "LOCAL SERVICE:(OI)(CI)F"
```

### 3- Utiliser node-windows pour Installer un Nouveau Service Windows :
#### Installer node-windows depuis le dossier du projet (a faire pour chaque projet) :

```bash
npm link node-windows
```

#### Créez un script JavaScript pour définir et installer le service. Par exemple, créez un fichier installServiceFront.js avec le contenu suivant :

```javascript
var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name: 'frontNext',
  description: 'My Next.js application as a Windows service.',
  script: 'D:\\intranet\\dashboard\\node_modules/next/dist/bin/next',
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    },
    {
      name: "PM2_HOME",
      value: "C:\\ProgramData\\pm2"
    }
  ],
  // Ajoutez les arguments pour "next start" ici
  scriptOptions: 'start'  // Lance le script avec "next start"
});

// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install', function() {
  svc.start();
});

// Install the service
svc.install();
```

#### Exécuter le script pour installer le Service :
```bash
node installServiceFront.js
```

#### Configurer le Service pour qu'il s'exécute en tant qu'utilisateur Local Service

Ouvrez PowerShell en tant qu'administrateur et exécutez les commandes suivantes pour configurer le service :

```powershell
sc.exe config frontNext obj= "NT AUTHORITY\LocalService" password= ""
sc.exe start frontNext
```

### 4- configurer pm2-installer:

Installer pm2 via: 
```bash
npm install pm2 -g
```

Puis télécharger pm2-installer via le repo github et dézippé:
[page github de pm2-installer](https://github.com/jessety/pm2-installer)

Enfin au sein du dossier dézippé tapper les commandes en mode admin:

```bash
npm run configure
npm run configure-policy
```

et pour finir:

```bash
npm run setup
```

## Supprimer un processus (service windows) :

#### Créez un script JavaScript pour définir et supprimer le service. Par exemple, créez un fichier deleteServiceFront.js avec le contenu suivant :

```javascript
var Service = require('node-windows').Service;

var svc = new Service({
  name: 'frontNext',
  description: 'My Next.js application as a Windows service.',
  script: 'D:\\intranet\\dashboard\\node_modules/next/dist/bin/next',
  env: {
    name: "PM2_HOME",
    value: "C:\\ProgramData\\pm2"
  }
});

svc.on('uninstall', function() {
  console.log('Service uninstalled');
  console.log('The service exists: ',svc.exists);
});

svc.uninstall();
```

#### Exécuter le script pour supprimer le Service :
```bash
node deleteServiceFront.js
```

***Le service a bien été supprimer.***
