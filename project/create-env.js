const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = `VITE_SUPABASE_URL=https://ztssldfzzqrrbshvlifj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0c3NsZGZ6enFycmJzaHZsaWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDU1NDgsImV4cCI6MjA3MTgyMTU0OH0.C1nOm-zuKzRcfIlRU_TcGPv0u9TySqgMXQu4LNlzs3Q`;

fs.writeFileSync(envPath, envContent);
console.log('Fichier .env créé avec succès !');
