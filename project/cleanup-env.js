const fs = require('fs');
const path = require('path');

function cleanEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      // Supprimer les lignes contenant SUPABASE
      const lines = content.split('\n').filter(line => !line.includes('SUPABASE'));
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`Fichier ${filePath} nettoyé avec succès`);
    }
  } catch (error) {
    console.error(`Erreur lors du nettoyage du fichier ${filePath}:`, error);
  }
}

// Nettoyer .env
cleanEnvFile(path.join(__dirname, '.env'));

// Nettoyer .env.example
cleanEnvFile(path.join(__dirname, '.env.example'));

console.log('Nettoyage des variables d\'environnement terminé.');
