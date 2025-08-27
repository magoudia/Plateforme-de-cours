import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');

try {
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8');
    console.log('Contenu du fichier .env :');
    console.log('----------------------------------------');
    console.log(content);
    console.log('----------------------------------------');
    console.log('Taille du fichier :', content.length, 'caractères');
    
    // Vérifier le format des variables
    const lines = content.split('\n').filter(line => line.trim() !== '');
    console.log('\nVariables détectées :');
    lines.forEach((line, index) => {
      console.log(`${index + 1}. ${line}`);
    });
  } else {
    console.log('Le fichier .env n\'existe pas');
  }
} catch (err) {
  console.error('Erreur lors de la lecture du fichier .env :', err);
}
