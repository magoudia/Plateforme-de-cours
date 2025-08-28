/**
 * Extrait l'ID d'une vidéo Vimeo à partir d'une URL ou d'un ID
 * Supporte les formats :
 * - 1113916427
 * - https://vimeo.com/1113916427
 * - https://vimeo.com/1113916427?param=value
 * - vimeo.com/1113916427
 * - vimeo.com/video/1113916427
 * - player.vimeo.com/video/1113916427
 */
export const extractVimeoId = (input: string | null | undefined): string | null => {
  if (!input) return null;
  
  // Nettoyer l'entrée
  const trimmed = input.trim();
  if (!trimmed) return null;
  
  // Si c'est déjà un ID numérique
  if (/^\d+$/.test(trimmed)) return trimmed;
  
  try {
    // Essayer de parser comme une URL
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    
    // Vérifier le domaine
    if (!url.hostname.includes('vimeo.com') && !url.hostname.includes('player.vimeo.com')) {
      return null;
    }
    
    // Extraire l'ID du chemin ou des paramètres
    const pathMatch = url.pathname.match(/\/(\d+)/);
    if (pathMatch) return pathMatch[1];
    
    // Vérifier le paramètre 'v' si présent
    const vParam = url.searchParams.get('v');
    if (vParam && /^\d+$/.test(vParam)) return vParam;
    
    // Vérifier le dernier segment numérique
    const lastSegment = url.pathname.split('/').pop();
    if (lastSegment && /^\d+$/.test(lastSegment)) return lastSegment;
  } catch (e) {
    // En cas d'erreur d'URL, essayer une simple regex
    const simpleMatch = trimmed.match(/(?:vimeo\.com\/|\/video\/|\/)(\d+)/i);
    if (simpleMatch) return simpleMatch[1];
  }
  
  return null;
};

/**
 * Génère l'URL du lecteur Vimeo
 */
export const getVimeoEmbedUrl = (videoId: string, options: {
  autoplay?: boolean;
  loop?: boolean;
  title?: boolean;
  byline?: boolean;
  portrait?: boolean;
  muted?: boolean;
} = {}): string => {
  const params = new URLSearchParams({
    autoplay: options.autoplay ? '1' : '0',
    loop: options.loop ? '1' : '0',
    title: options.title !== false ? '1' : '0',
    byline: options.byline !== false ? '1' : '0',
    portrait: options.portrait !== false ? '1' : '0',
    dnt: '1', // Respect de la vie privée
    transparent: '0',
    muted: options.muted ? '1' : '0',
  });
  
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
};
