var Service = require('node-windows').Service;

var svc = new Service({
  name: 'frontNext',
  description: 'My Next.js application as a Windows service.',
  script: 'E:\\Intranet\\dashboard-prod\\node_modules/next/dist/bin/next',
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