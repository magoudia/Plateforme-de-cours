import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');

try {
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8');
    console.log('Contenu du fichier .env :');
    console.log(content);
    console.log('Taille du fichier :', content.length, 'caractères');
  } else {
    console.log('Le fichier .env n\'existe pas');
  }
} catch (err) {
  console.error('Erreur lors de la lecture du fichier .env :', err);
}
