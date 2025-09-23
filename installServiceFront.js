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
