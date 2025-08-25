import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React & TypeScript - Guide Complet',
    description: 'Maîtrisez React et TypeScript pour créer des applications web modernes et performantes.',
    duration: '12h 30min',
    level: 'Intermédiaire',
    category: 'Développement Web',
    price: 60000,
    rating: 4.8,
    studentsCount: 1250,
    imageUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    totalModules: 4,
    totalLessons: 16,
    certificate: true,
    lessons: [
      { id: '1-1', title: 'Introduction à React', duration: '15min', type: 'video' },
      { id: '1-2', title: 'Configuration TypeScript', duration: '20min', type: 'video' },
      { id: '1-3', title: 'Composants et Props', duration: '25min', type: 'video' },
      { id: '1-4', title: 'Quiz - Bases de React', duration: '10min', type: 'quiz' },
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Introduction à React',
        description: 'Découvrez les fondamentaux de React et préparez votre environnement de développement',
        order: 1,
        lessons: [
          {
            id: '1-1',
            title: 'Qu\'est-ce que React ?',
            description: 'Introduction aux concepts fondamentaux de React',
            duration: '15min',
            type: 'text',
            content: 'text'
          },
          {
            id: '1-2',
            title: 'Installation et configuration',
            description: 'Mise en place de votre environnement de développement',
            duration: '20min',
            type: 'text',
            content: 'text'
          },
          {
            id: '1-3',
            title: 'Premier composant React',
            description: 'Création de votre premier composant React',
            duration: '25min',
            type: 'text',
            content: 'text'
          },
          {
            id: '1-4',
            title: 'Quiz - Introduction React',
            description: 'Testez vos connaissances sur les bases de React',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-1-4',
              questions: [
                {
                  id: 'q1',
                  text: 'React est une bibliothèque JavaScript créée par :',
                  type: 'multiple-choice',
                  options: ['Google', 'Facebook', 'Microsoft', 'Apple'],
                  correctAnswer: 'Facebook',
                  explanation: 'React a été créé par Facebook (maintenant Meta) en 2013.'
                },
                {
                  id: 'q2',
                  text: 'React utilise un DOM virtuel pour optimiser les performances.',
                  type: 'true-false',
                  correctAnswer: 'Vrai',
                  explanation: 'Le DOM virtuel permet à React de minimiser les manipulations du DOM réel.'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Composants et Props',
        description: 'Apprenez à créer et utiliser des composants React avec les props',
        order: 2,
        lessons: [
          {
            id: '2-1',
            title: 'Création de composants',
            description: 'Comment créer des composants fonctionnels et de classe',
            duration: '30min',
            type: 'text',
            content: 'text'
          },
          {
            id: '2-2',
            title: 'Props et communication',
            description: 'Passage de données entre composants via les props',
            duration: '25min',
            type: 'text',
            content: 'text'
          },
          {
            id: '2-3',
            title: 'Composants enfants',
            description: 'Utilisation des enfants dans les composants',
            duration: '20min',
            type: 'text',
            content: 'text'
          },
          {
            id: '2-4',
            title: 'Exercice pratique',
            description: 'Création d\'une application de liste de tâches',
            duration: '45min',
            type: 'exercise',
            resources: [
              {
                id: 'res-2-4-1',
                title: 'Fichier de départ',
                type: 'doc',
                url: '#',
                size: '2.5 KB'
              }
            ]
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Hooks et État',
        description: 'Maîtrisez les hooks React pour gérer l\'état et les effets',
        order: 3,
        lessons: [
          {
            id: '3-1',
            title: 'useState Hook',
            description: 'Gestion de l\'état local avec useState',
            duration: '30min',
            type: 'text',
            content: 'text'
          },
          {
            id: '3-2',
            title: 'useEffect Hook',
            description: 'Gestion des effets de bord avec useEffect',
            duration: '35min',
            type: 'text',
            content: 'text'
          },
          {
            id: '3-3',
            title: 'Autres hooks utiles',
            description: 'useContext, useReducer et hooks personnalisés',
            duration: '40min',
            type: 'text',
            content: 'text'
          },
          {
            id: '3-4',
            title: 'Quiz - Hooks React',
            description: 'Testez vos connaissances sur les hooks',
            duration: '15min',
            type: 'quiz',
            quiz: {
              id: 'quiz-3-4',
              questions: [
                {
                  id: 'q1',
                  text: 'Quel hook utilisez-vous pour gérer l\'état local ?',
                  type: 'multiple-choice',
                  options: ['useEffect', 'useState', 'useContext', 'useReducer'],
                  correctAnswer: 'useState',
                  explanation: 'useState est le hook principal pour gérer l\'état local.'
                },
                {
                  id: 'q2',
                  text: 'useEffect s\'exécute après chaque rendu par défaut.',
                  type: 'true-false',
                  correctAnswer: 'Vrai',
                  explanation: 'useEffect s\'exécute après chaque rendu, mais peut être contrôlé avec des dépendances.'
                }
              ],
              passingScore: 80,
              timeLimit: 15
            }
          },
          {
            id: '3-5',
            title: 'Quiz - Python : Variables, Contrôle & Fonctions',
            description: 'Testez vos connaissances sur les bases de Python',
            duration: '15min',
            type: 'quiz',
            quiz: {
              id: 'quiz-3-5',
              questions: [
                {
                  id: 'q1',
                  text: 'Quel est le type de x = 5 ?',
                  type: 'multiple-choice',
                  options: ['str', 'int', 'float', 'bool'],
                  correctAnswer: 'int',
                  explanation: 'int est le type des nombres entiers.'
                },
                {
                  id: 'q2',
                  text: 'Comment convertir "12.5" en float ?',
                  type: 'multiple-choice',
                  options: ['float("12,5") (virgule invalide)', 'float("12.5")', 'str_to_float("12.5") (n\'existe pas)'],
                  correctAnswer: 'float("12.5")',
                  explanation: 'Utilisez float() avec un point décimal.'
                },
                {
                  id: 'q3',
                  text: 'Que fait ce code ?\n\nfor i in range(3):\n    print(i)',
                  type: 'multiple-choice',
                  options: ['Affiche 0 1 2', 'Affiche 1 2 3', 'Boucle infinie'],
                  correctAnswer: 'Affiche 0 1 2',
                  explanation: 'range(3) génère 0, 1, 2.'
                },
                {
                  id: 'q4',
                  text: 'Quel mot-clé arrête une boucle immédiatement ?',
                  type: 'multiple-choice',
                  options: ['stop', 'break', 'exit'],
                  correctAnswer: 'break',
                  explanation: 'break permet d\'arrêter une boucle immédiatement.'
                },
                {
                  id: 'q5',
                  text: 'Quelle fonction calcule le carré d\'un nombre ?\n\ndef carre(n):\n    return n ** 2\n\ncarre(4) → ?',
                  type: 'multiple-choice',
                  options: ['carre(4) → 16', 'carre(4) → 8', 'carre(4) → 44'],
                  correctAnswer: 'carre(4) → 16',
                  explanation: 'carre(4) retourne 16 car 4 ** 2 = 16.'
                }
              ],
              passingScore: 70,
              timeLimit: 15
            }
          }
        ]
      }
    ],
    modulesSchedule: [
      { start: '1 avril', end: '12 avril', module: 'Module 1', title: 'Introduction à React' },
      { start: '12 avril', end: '20 avril', module: 'Module 2', title: 'Composants et Props' },
      { start: '20 avril', end: '30 avril', module: 'Module 3', title: 'Hooks et Avancés' }
    ]
  },
  {
    id: '2',
    title: 'Design UI/UX avec Figma',
    description: 'Apprenez à créer des interfaces utilisateur attrayantes avec Figma.',
    duration: '8h 45min',
    level: 'Débutant',
    category: 'Design',
    price: 60000,
    rating: 4.6,
    studentsCount: 890,
    imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    totalModules: 3,
    totalLessons: 14,
    certificate: true,
    lessons: [
      // Module 1
      { id: '2-1', title: 'Interface Figma', duration: '12min', type: 'text' },
      { id: '2-2', title: 'Outils de base', duration: '18min', type: 'text' },
      { id: '2-3', title: 'Créer un wireframe', duration: '30min', type: 'text' },
      { id: '2-1-quiz', title: 'Quiz - Introduction à Figma', duration: '10min', type: 'quiz' },
      // Module 2
      { id: '2-4', title: 'Frames et Layout', duration: '20min', type: 'text' },
      { id: '2-5', title: 'Auto-Layout', duration: '25min', type: 'text' },
      { id: '2-6', title: 'Styles & Assets', duration: '18min', type: 'text' },
      { id: '2-7', title: 'Composants & Variants', duration: '28min', type: 'text' },
      { id: '2-2-quiz', title: 'Quiz - Outils et Techniques', duration: '12min', type: 'quiz' },
      // Module 3
      { id: '2-8', title: 'Prototypage: Interactions', duration: '22min', type: 'text' },
      { id: '2-9', title: 'Smart Animate', duration: '20min', type: 'text' },
      { id: '2-10', title: 'Handoff Développeur', duration: '18min', type: 'text' },
      { id: '2-11', title: 'Projet Pratique: Brief', duration: '25min', type: 'text' },
      { id: '2-3-quiz', title: 'Quiz - Prototypage & Handoff', duration: '12min', type: 'quiz' },
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Découverte de Figma',
        description: 'Présentation de l\'interface et des outils de base',
        order: 1,
        lessons: [
          {
            id: '2-1',
            title: 'Interface Figma',
            description: 'Navigation dans l\'interface de Figma',
            duration: '12min',
            type: 'text',
            content: `
<h2>Objectifs</h2>
<ul>
  <li>Comprendre l'interface de Figma (Barre d'outils, Canvas, Panneaux).</li>
  <li>Créer un fichier, une page, et organiser ses frames.</li>
  <li>Découvrir les raccourcis essentiels.</li>
  </ul>
<h3>Prise en main</h3>
<p>Créez un nouveau fichier, ajoutez une page "Exploration" puis insérez une frame mobile iPhone 14.</p>
<div><a href="https://help.figma.com" target="_blank" rel="noopener noreferrer">Documentation Figma</a></div>
`
          },
          {
            id: '2-2',
            title: 'Outils de base',
            description: 'Utilisation des outils de dessin et de sélection',
            duration: '18min',
            type: 'text',
            content: `
<h2>Outils de dessin</h2>
<p>Rectangle (R), Ellipse (O), Ligne (L), Plume (P). Utilisez les contraintes pour rendre vos éléments responsives.</p>
<h3>Exercice</h3>
<p>Reproduisez une barre de navigation simple avec un logo et trois liens.</p>
`
          },
          {
            id: '2-3',
            title: 'Créer un wireframe',
            description: 'Création de votre premier wireframe',
            duration: '30min',
            type: 'text',
            content: `
<h2>Méthode</h2>
<ol>
  <li>Définissez un flux (Accueil → Liste → Détail).</li>
  <li>Placez les zones (header, contenu, footer) en gris neutre.</li>
  <li>Ajoutez une grille 8px pour l'alignement.</li>
</ol>
<h3>Livrable</h3>
<p>3 écrans wireframe basse fidélité dans un frame Desktop.</p>
`
          },
          {
            id: '2-1-quiz',
            title: 'Quiz - Introduction à Figma',
            description: 'Testez vos connaissances de base sur Figma',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-2-1',
              questions: [
                {
                  id: 'q1',
                  text: 'Figma est un outil principalement utilisé pour :',
                  type: 'multiple-choice',
                  options: ['Montage vidéo', 'Design UI/UX', 'Gestion de projet'],
                  correctAnswer: 'Design UI/UX',
                  explanation: 'Figma est un outil de conception d\'interfaces et de prototypage.'
                },
                {
                  id: 'q2',
                  text: 'Figma fonctionne :',
                  type: 'multiple-choice',
                  options: ['Uniquement en local', 'Principalement dans le navigateur', 'Uniquement sur mobile'],
                  correctAnswer: 'Principalement dans le navigateur',
                  explanation: 'Figma est basé sur le cloud et fonctionne très bien dans le navigateur.'
                },
                {
                  id: 'q3',
                  text: 'Quel raccourci permet de créer rapidement un Rectangle ?',
                  type: 'multiple-choice',
                  options: ['R', 'O', 'L', 'P'],
                  correctAnswer: 'R',
                  explanation: 'R = Rectangle, O = Ellipse, L = Ligne, P = Plume.'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Outils et Techniques',
        description: 'Frames, Auto-Layout, Styles, Composants et Variants',
        order: 2,
        lessons: [
          {
            id: '2-4',
            title: 'Frames et Layout',
            description: 'Maîtriser les frames et les grilles de layout',
            duration: '20min',
            type: 'text',
            content: `
<h2>Frames vs Groups</h2>
<p>Préférez les Frames pour contraindre et aligner. Activez une grille 8pt.</p>
<h3>Exercice</h3>
<p>Construisez un layout 12 colonnes et placez une carte produit responsive.</p>
`
          },
          {
            id: '2-5',
            title: 'Auto-Layout',
            description: 'Construire des interfaces flexibles',
            duration: '25min',
            type: 'text',
            content: `
<h2>Principes</h2>
<p>Direction, spacing, padding, alignements, resizing. Empilez des Auto-Layouts.</p>
<h3>Exercice</h3>
<p>Créez un bouton avec icône et état hover en Auto-Layout.</p>
`
          },
          {
            id: '2-6',
            title: 'Styles & Assets',
            description: 'Couleurs, typographies, effets, librairies',
            duration: '18min',
            type: 'text',
            content: `
<h2>Systèmes de styles</h2>
<p>Déclarez des Styles (Couleurs, Textes, Effets) et publiez une librairie d\'assets.</p>
`
          },
          {
            id: '2-7',
            title: 'Composants & Variants',
            description: 'Créer des composants réutilisables avec états',
            duration: '28min',
            type: 'text',
            content: `
<h2>Composants</h2>
<p>Créez des Variants (Primary / Secondary, Default / Hover / Disabled) et liez des propriétés.</p>
`
          },
          {
            id: '2-2-quiz',
            title: 'Quiz - Outils et Techniques',
            description: 'Évaluez votre maîtrise des outils clés',
            duration: '12min',
            type: 'quiz',
            quiz: {
              id: 'quiz-2-2',
              questions: [
                { id: 'q1', text: 'Auto-Layout permet :', type: 'multiple-choice', options: ['De grouper des calques seulement', 'De construire des layouts flexibles', 'D\'exporter des assets'], correctAnswer: 'De construire des layouts flexibles', explanation: 'Auto-Layout rend les composants responsives.' },
                { id: 'q2', text: 'Quel objet privilégier pour contraindre et aligner ?', type: 'multiple-choice', options: ['Group', 'Frame'], correctAnswer: 'Frame', explanation: 'Les Frames prennent en charge contraintes et grilles.' },
                { id: 'q3', text: 'Les Variants servent à :', type: 'multiple-choice', options: ['Créer des composants avec états', 'Créer des pages', 'Exporter des SVG'], correctAnswer: 'Créer des composants avec états' },
                { id: 'q4', text: 'Un Style de texte contient :', type: 'multiple-choice', options: ['Uniquement la couleur', 'Famille, taille, interlignage, etc.', 'Uniquement la graisse'], correctAnswer: 'Famille, taille, interlignage, etc.' },
                { id: 'q5', text: 'Une grille 8pt signifie :', type: 'multiple-choice', options: ['Espacement en multiples de 8px', 'Colonnes 8 uniquement'], correctAnswer: 'Espacement en multiples de 8px' }
              ],
              passingScore: 70,
              timeLimit: 12
            }
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Prototypage et Handoff',
        description: 'Interactions, animations et livraison aux développeurs',
        order: 3,
        lessons: [
          {
            id: '2-8',
            title: 'Prototypage: Interactions',
            description: 'Liens, overlays, transitions',
            duration: '22min',
            type: 'text',
            content: `
<h2>Interactions</h2>
<p>On Click, While Hovering, After Delay. Testez dans l\'onglet Prototype.</p>
`
          },
          {
            id: '2-9',
            title: 'Smart Animate',
            description: 'Animer entre états proches',
            duration: '20min',
            type: 'text',
            content: `
<h2>Principe</h2>
<p>Anime automatiquement les propriétés communes (position, opacité, taille).</p>
`
          },
          {
            id: '2-10',
            title: 'Handoff Développeur',
            description: 'Inspect, tokens, export, specs',
            duration: '18min',
            type: 'text',
            content: `
<h2>Inspect & Export</h2>
<p>Utilisez Inspect pour obtenir propriétés CSS et exportez SVG/PNG/PDF selon le besoin.</p>
`
          },
          {
            id: '2-11',
            title: 'Projet Pratique: Brief',
            description: 'Mettre en pratique de bout en bout',
            duration: '25min',
            type: 'text',
            content: `
<h2>Brief</h2>
<p>Réalisez un mini-flux d\'onboarding (3 écrans) incluant composants et prototype interactif.</p>
`
          },
          {
            id: '2-3-quiz',
            title: 'Quiz - Prototypage & Handoff',
            description: 'Validez vos acquis sur le prototypage et le handoff',
            duration: '12min',
            type: 'quiz',
            quiz: {
              id: 'quiz-2-3',
              questions: [
                { id: 'q1', text: 'Smart Animate fonctionne mieux si :', type: 'multiple-choice', options: ['Les calques ont des noms différents', 'Les calques ont les mêmes noms et structure'], correctAnswer: 'Les calques ont les mêmes noms et structure' },
                { id: 'q2', text: 'Quel onglet pour récupérer les propriétés CSS ?', type: 'multiple-choice', options: ['Design', 'Prototype', 'Inspect'], correctAnswer: 'Inspect' },
                { id: 'q3', text: 'Quel format privilégier pour des icônes vectorielles ?', type: 'multiple-choice', options: ['PNG', 'JPG', 'SVG'], correctAnswer: 'SVG' },
                { id: 'q4', text: 'Une interaction Overlay sert à :', type: 'multiple-choice', options: ['Remplacer l\'écran', 'Afficher un panneau par-dessus'], correctAnswer: 'Afficher un panneau par-dessus' },
                { id: 'q5', text: 'After Delay déclenche :', type: 'multiple-choice', options: ['Une interaction au clic', 'Une interaction après un délai'], correctAnswer: 'Une interaction après un délai' }
              ],
              passingScore: 70,
              timeLimit: 12
            }
          }
        ]
      }
    ],
    modulesSchedule: [
      { start: '1 avril', end: '8 avril', module: 'Module 1', title: 'Découverte de Figma' },
      { start: '8 avril', end: '15 avril', module: 'Module 2', title: 'Outils et Techniques' },
      { start: '15 avril', end: '22 avril', module: 'Module 3', title: 'Projets Pratiques' }
    ]
  },
  {
    id: '3',
    title: 'Python pour les Débutants',
    description: 'Découvrez la programmation avec Python, langage idéal pour commencer.',
    duration: '15h 20min',
    level: 'Débutant',
    category: 'Programmation',
    price: 60000,
    rating: 4.7,
    studentsCount: 2100,
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    totalModules: 4,
    totalLessons: 20,
    certificate: true,
    lessons: [
      { id: '3-1', title: 'Installation Python', duration: '10min', type: 'video' },
      { id: '3-2', title: 'Variables et types', duration: '20min', type: 'video' },
      { id: '3-3', title: 'Structures conditionnelles', duration: '25min', type: 'video' }
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Introduction à Python',
        description: 'Premiers pas avec Python',
        order: 1,
        lessons: [
          {
            id: '3-1',
            title: 'Installation Python',
            description: 'Installation et configuration de Python',
            duration: '10min',
            type: 'text',
            content: `
    <h2>Qu'est-ce que Python&nbsp;?</h2>
    <p>
      Python est un langage de programmation interprété, multiplateforme et open-source. Il est apprécié pour sa syntaxe claire, sa polyvalence (web, data science, IA, automation) et sa grande communauté.
    </p>
    <div style="margin:1em 0;">
      <a href="https://youtu.be/PmpheCTL6yk" target="_blank" rel="noopener noreferrer">
        ▶️ Introduction à Python (vidéo)
      </a>
    </div>
    <h3>Exemple&nbsp;:</h3>
    <pre><code class="language-python"># Afficher un message
print("Bonjour le monde !")
</code></pre>
    <h2>Installer Python</h2>
    <p>
      Téléchargez Python sur le <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">site officiel</a>.<br/>
      Vérifiez l'installation&nbsp;:
    </p>
    <pre><code class="language-bash">python --version
# ou
python3 --version
</code></pre>
    <div style="margin:1em 0;">
      <a href="https://youtu.be/rq-36A2SvhE" target="_blank" rel="noopener noreferrer">
        ▶️ Tutoriel installation Python (vidéo)
      </a>
    </div>
    <h2>Les bases de Python</h2>
    <h3>Variables et types</h3>
    <pre><code class="language-python">age = 25              # Entier (int)
nom = "Alice"         # Chaîne (str)
solde = 150.75        # Flottant (float)
est_actif = True      # Booléen (bool)
print(f"{nom} a {age} ans.")
</code></pre>
    <h3>Opérations</h3>
    <pre><code class="language-python">resultat = 10 + 3 * 2  # Priorité des opérations
message = "Python" + " " + "Génial"  # Concatenation
</code></pre>
    <div style="margin:1em 0;">
      <a href="https://youtu.be/psaDHhZ0cPs" target="_blank" rel="noopener noreferrer">
        ▶️ Les bases de Python (vidéo)
      </a>
    </div>
    <h2>Pour aller plus loin</h2>
    <ul>
      <li><a href="https://youtu.be/PmpheCTL6yk" target="_blank" rel="noopener noreferrer">Introduction à Python</a></li>
      <li><a href="https://youtu.be/rq-36A2SvhE" target="_blank" rel="noopener noreferrer">Installation de Python</a></li>
      <li><a href="https://youtu.be/psaDHhZ0cPs" target="_blank" rel="noopener noreferrer">Bases de Python</a></li>
    </ul>
  `
          },
          {
            id: '3-2',
            title: 'Variables et types',
            description: 'Déclaration et utilisation des variables',
            duration: '20min',
            type: 'text',
            content: `
<h2>1. Qu'est-ce qu'une Variable ?</h2>
<p>Une variable est une boîte pour stocker des données. En Python, on crée une variable simplement en lui donnant un nom et une valeur.</p>
<pre><code class="language-python"># Exemple
nom = "Alice"
age = 25
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/XfxqOhAL8NI" target="_blank" rel="noopener noreferrer">📹 Vidéo Explicative (3 min)</a>
</div>

<h2>2. Types de Données de Base</h2>
<table>
  <thead>
    <tr><th>Type</th><th>Exemple</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>int</td><td>42</td><td>Nombre entier</td></tr>
    <tr><td>float</td><td>3.14</td><td>Nombre décimal</td></tr>
    <tr><td>str</td><td>"Bonjour"</td><td>Chaîne de caractères</td></tr>
    <tr><td>bool</td><td>True/False</td><td>Booléen</td></tr>
    <tr><td>list</td><td>[1, 2, 3]</td><td>Liste</td></tr>
  </tbody>
</table>
<pre><code class="language-python"># Exemples concrets
prix = 19.99          # float
est_valide = True     # bool
langages = ["Python", "Java", "C++"]  # list
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/vKqVnr0BEJQ" target="_blank" rel="noopener noreferrer">📹 Tutoriel Complet sur les Types (8 min)</a>
</div>

<h2>3. Vérifier le Type</h2>
<p>Utilisez <code>type()</code> pour connaître le type d'une variable :</p>
<pre><code class="language-python">print(type(age))      # Affiche <class 'int'>
print(type(nom))      # Affiche <class 'str'>
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/XKHEtdqhLK8" target="_blank" rel="noopener noreferrer">📹 Astuce Pratique (2 min)</a>
</div>

<h2>4. Conversion de Types</h2>
<p>Convertir un type en un autre avec :</p>
<ul>
  <li><code>int()</code> → Entier</li>
  <li><code>str()</code> → Chaîne</li>
  <li><code>float()</code> → Décimal</li>
</ul>
<pre><code class="language-python">nombre = "10"
nombre_entier = int(nombre)  # Convertit en int
print(nombre_entier * 2)     # Affiche 20
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/ve2pmm5JqmI" target="_blank" rel="noopener noreferrer">📹 Conversions Expliquées (5 min)</a>
</div>

<h2>5. Exercice Pratique</h2>
<p><strong>Énoncé :</strong> Créez un programme qui demande à l'utilisateur son âge et affiche "Majeur" si l'âge ≥ 18.</p>
<pre><code class="language-python">age = int(input("Quel est votre âge ? "))  # Conversion en int
if age >= 18:
    print("Majeur")
else:
    print("Mineur")
</code></pre>
<div style="margin:1em 0;">
  <span>📹 Corrigé en Vidéo (7 min)</span>
</div>

<h2>Ressources Supplémentaires</h2>
<ul>
  <li>🎓 Cours Complet sur les Variables (30 min)</li>
  <li>💡 Erreurs Courantes & Solutions</li>
</ul>
`
          },
          {
            id: '3-3',
            title: 'Structures conditionnelles',
            description: 'Utilisation des if, elif, else',
            duration: '25min',
            type: 'text',
            content: `
<h2>1. Conditions : if / elif / else</h2>
<p>Permettent d'exécuter du code seulement si une condition est vraie.</p>
<pre><code class="language-python">âge = int(input("Quel est votre âge ? "))

if âge >= 18:
    print("Accès autorisé")
elif âge >= 16:
    print("Accès avec supervision")
else:
    print("Accès refusé")
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/SiECEKZDqqk" target="_blank" rel="noopener noreferrer">📹 Vidéo Explicative (Conditions) - 6 min</a>
</div>

<h2>2. Boucles : for</h2>
<p>Pour répéter une action sur une séquence (liste, chaîne, etc.).</p>
<pre><code class="language-python"># Afficher chaque lettre d'un mot
for lettre in "Python":
    print(lettre)

# Compter de 1 à 5
for i in range(1, 6):
    print(i)
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/4AY3YiduC14" target="_blank" rel="noopener noreferrer">📹 Tutoriel Boucle for - 8 min</a>
</div>

<h2>3. Boucles : while</h2>
<p>Exécute du code tant qu'une condition est vraie.</p>
<pre><code class="language-python">compteur = 0
while compteur < 3:
    print("Chargement...")
    compteur += 1  # Ne pas oublier pour éviter une boucle infinie !
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/J8dkgM8Mck0" target="_blank" rel="noopener noreferrer">📹 Guide Boucle while - 5 min</a>
</div>

<h2>4. Mots-clés Utiles</h2>
<p><code>break</code> : Sort immédiatement de la boucle.<br/>
<code>continue</code> : Passe à l'itération suivante.</p>
<pre><code class="language-python"># Exemple avec break
for num in range(10):
    if num == 5:
        break  # Arrête à 5
    print(num)
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/JXk_XtuP3-E" target="_blank" rel="noopener noreferrer">📹 Astuces break & continue - 4 min</a>
</div>

<h2>5. Exercice Pratique</h2>
<p><strong>Énoncé :</strong> Créez un mini-jeu où l'ordinateur choisit un nombre entre 1 et 10, et l'utilisateur doit le deviner.</p>
<pre><code class="language-python">import random

nombre_secret = random.randint(1, 10)
essais = 0

while True:
    essai = int(input("Devinez le nombre (1-10) : "))
    essais += 1
    
    if essai == nombre_secret:
        print(f"Bravo ! Trouvé en {essais} essais.")
        break
    elif essai < nombre_secret:
        print("Trop petit.")
    else:
        print("Trop grand.")
</code></pre>
<div style="margin:1em 0;">
  <a href="https://youtu.be/8ext9G7xspg" target="_blank" rel="noopener noreferrer">📹 Corrigé en Vidéo - 10 min</a>
</div>
`
          },
          {
            id: '3-1-quiz',
            title: 'Quiz - Introduction à Python',
            description: 'Testez vos connaissances sur les bases de Python',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-3-1',
              questions: [
                {
                  id: 'q1',
                  text: 'Python est-il un langage compilé ?',
                  type: 'true-false',
                  correctAnswer: 'Faux',
                  explanation: 'Python est un langage interprété.'
                },
                {
                  id: 'q2',
                  text: 'Quelle commande affiche "Bonjour" en Python ?',
                  type: 'multiple-choice',
                  options: ['echo "Bonjour"', 'print("Bonjour")', 'console.log("Bonjour")'],
                  correctAnswer: 'print("Bonjour")',
                  explanation: 'print() est la fonction d\'affichage en Python.'
                },
                {
                  id: 'q3',
                  text: 'Quel site officiel permet de télécharger Python ?',
                  type: 'multiple-choice',
                  options: ['python.org', 'python.com', 'pythonsite.net'],
                  correctAnswer: 'python.org',
                  explanation: 'Le site officiel est https://www.python.org/'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          },
          {
            id: '3-2-quiz',
            title: 'Quiz - Variables et Types',
            description: 'Testez vos connaissances sur les variables et les types en Python',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-3-2',
              questions: [
                {
                  id: 'q1',
                  text: 'Quel type de donnée pour la valeur 3.14 ?',
                  type: 'multiple-choice',
                  options: ['int', 'float', 'str', 'bool'],
                  correctAnswer: 'float',
                  explanation: '3.14 est un nombre à virgule flottante.'
                },
                {
                  id: 'q2',
                  text: 'Comment déclare-t-on une variable chaîne de caractères ?',
                  type: 'multiple-choice',
                  options: ['nom = Alice', 'nom = "Alice"', 'nom = 25'],
                  correctAnswer: 'nom = "Alice"',
                  explanation: 'Les chaînes sont entre guillemets.'
                },
                {
                  id: 'q3',
                  text: 'Quelle fonction permet de connaître le type d\'une variable ?',
                  type: 'multiple-choice',
                  options: ['typeof()', 'type()', 'getType()', 'varType()'],
                  correctAnswer: 'type()',
                  explanation: 'type() retourne le type d\'une variable.'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          },
          {
            id: '3-3-quiz',
            title: 'Quiz - Structures conditionnelles',
            description: 'Testez vos connaissances sur les conditions et les boucles en Python',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-3-3',
              questions: [
                {
                  id: 'q1',
                  text: 'Quel mot-clé permet de répéter une action tant qu\'une condition est vraie ?',
                  type: 'multiple-choice',
                  options: ['for', 'while', 'if', 'repeat'],
                  correctAnswer: 'while',
                  explanation: 'while permet de faire des boucles conditionnelles.'
                },
                {
                  id: 'q2',
                  text: 'Que fait le mot-clé break ?',
                  type: 'multiple-choice',
                  options: ['Passe à l\'itération suivante', 'Arrête la boucle', 'Ignore la condition'],
                  correctAnswer: 'Arrête la boucle',
                  explanation: 'break arrête immédiatement la boucle.'
                },
                {
                  id: 'q3',
                  text: 'Quelle structure permet de choisir entre plusieurs cas ?',
                  type: 'multiple-choice',
                  options: ['if/elif/else', 'for', 'switch', 'try/except'],
                  correctAnswer: 'if/elif/else',
                  explanation: 'if/elif/else permet de gérer plusieurs cas.'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          }
        ]
      }
    ],
    modulesSchedule: [
      { start: '1 avril', end: '10 avril', module: 'Module 1', title: 'Introduction à Python' },
      { start: '10 avril', end: '20 avril', module: 'Module 2', title: 'Variables et Types' },
      { start: '20 avril', end: '30 avril', module: 'Module 3', title: 'Structures de Contrôle' },
      { start: '1 mai', end: '10 mai', module: 'Module 4', title: 'Fonctions et Modules' }
    ]
  },
  {
    id: '4',
    title: 'Marketing Digital Avancé',
    description: 'Stratégies avancées de marketing digital pour développer votre business.',
    duration: '10h 15min',
    level: 'Avancé',
    category: 'Marketing',
    price: 60000,
    rating: 4.9,
    studentsCount: 650,
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    totalModules: 4,
    totalLessons: 15,
    certificate: true,
    lessons: [
      { id: '4-1', title: 'Stratégie SEO avancée', duration: '45min', type: 'video' },
      { id: '4-2', title: 'Publicité Facebook', duration: '35min', type: 'video' },
      { id: '4-3', title: 'Analytics et métriques', duration: '40min', type: 'video' },
      { id: '4-1-quiz', title: 'Quiz - Fondamentaux Marketing Digital', duration: '10min', type: 'quiz' },
    ],
    modules: [
      {
        id: 'module-1',
        title: 'SEO Avancé',
        description: 'Techniques avancées de référencement naturel',
        order: 1,
        lessons: [
          {
            id: '4-1',
            title: 'Stratégie SEO avancée',
            description: 'Optimisation pour les moteurs de recherche',
            duration: '45min',
            type: 'text',
            content: 'text'
          },
          {
            id: '4-1-quiz',
            title: 'Quiz - Fondamentaux Marketing Digital',
            description: 'Vérifiez vos connaissances de base en marketing digital',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-4-1',
              questions: [
                {
                  id: 'q1',
                  text: 'Que signifie SEO ? ',
                  type: 'multiple-choice',
                  options: ['Search Engine Optimization', 'Social Engagement Optimization', 'Sales Enhancement Operation'],
                  correctAnswer: 'Search Engine Optimization',
                  explanation: 'SEO signifie optimisation pour les moteurs de recherche.'
                },
                {
                  id: 'q2',
                  text: 'Quel indicateur mesure le coût par conversion dans une campagne ?',
                  type: 'multiple-choice',
                  options: ['CPC', 'CPA', 'CTR'],
                  correctAnswer: 'CPA',
                  explanation: 'CPA = Coût Par Acquisition/Action.'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          }
        ]
      }
    ],
    modulesSchedule: [
      { start: '1 avril', end: '8 avril', module: 'Module 1', title: 'SEO Avancé' },
      { start: '8 avril', end: '15 avril', module: 'Module 2', title: 'Publicité Social Media' },
      { start: '15 avril', end: '22 avril', module: 'Module 3', title: 'Analytics et ROI' },
      { start: '22 avril', end: '30 avril', module: 'Module 4', title: 'Stratégies Intégrées' }
    ]
  },
  {
    id: '5',
    title: 'Photographie Numérique',
    description: 'Techniques de photographie et retouche pour créer des images professionnelles.',
    duration: '6h 30min',
    level: 'Intermédiaire',
    category: 'Créatif',
    price: 60000,
    rating: 4.5,
    studentsCount: 450,
    imageUrl: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    totalModules: 3,
    totalLessons: 10,
    certificate: false,
    lessons: [
      { id: '5-1', title: 'Réglages de base', duration: '15min', type: 'video' },
      { id: '5-2', title: 'Composition', duration: '20min', type: 'video' },
      { id: '5-3', title: 'Retouche Lightroom', duration: '30min', type: 'video' },
      { id: '5-1-quiz', title: 'Quiz - Fondamentaux Photo', duration: '10min', type: 'quiz' },
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Fondamentaux Photo',
        description: 'Bases de la photographie numérique',
        order: 1,
        lessons: [
          {
            id: '5-1',
            title: 'Réglages de base',
            description: 'Comprendre les paramètres de base de l\'appareil',
            duration: '15min',
            type: 'text',
            content: 'text'
          },
          {
            id: '5-2',
            title: 'Composition',
            description: 'Règles de composition photographique',
            duration: '20min',
            type: 'text',
            content: 'text'
          },
          {
            id: '5-3',
            title: 'Retouche Lightroom',
            description: 'Post-traitement avec Adobe Lightroom',
            duration: '30min',
            type: 'text',
            content: 'text'
          },
          {
            id: '5-1-quiz',
            title: 'Quiz - Fondamentaux Photo',
            description: 'Évaluez vos connaissances sur les bases de la photo',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-5-1',
              questions: [
                {
                  id: 'q1',
                  text: 'Quel paramètre contrôle la quantité de lumière entrant dans l\'objectif ?',
                  type: 'multiple-choice',
                  options: ['ISO', 'Ouverture', 'Vitesse d\'obturation'],
                  correctAnswer: 'Ouverture',
                  explanation: 'L\'ouverture (f/) contrôle la quantité de lumière.'
                },
                {
                  id: 'q2',
                  text: 'Quel paramètre influence principalement le bruit numérique ?',
                  type: 'multiple-choice',
                  options: ['ISO', 'Balance des blancs', 'Focale'],
                  correctAnswer: 'ISO',
                  explanation: 'Des ISO élevés augmentent le bruit.'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          }
        ]
      }
    ],
    modulesSchedule: [
      { start: '1 avril', end: '8 avril', module: 'Module 1', title: 'Fondamentaux Photo' },
      { start: '8 avril', end: '15 avril', module: 'Module 2', title: 'Composition et Cadrage' },
      { start: '15 avril', end: '22 avril', module: 'Module 3', title: 'Retouche et Post-traitement' }
    ]
  },
  {
    id: '6',
    title: 'Gestion de Projet Agile',
    description: 'Méthodologies agiles et outils pour gérer efficacement vos projets.',
    duration: '9h 45min',
    level: 'Intermédiaire',
    category: 'Gestion',
    price: 60000,
    rating: 4.4,
    studentsCount: 780,
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    totalModules: 3,
    totalLessons: 12,
    certificate: true,
    lessons: [
      { id: '6-1', title: 'Principes Agile', duration: '25min', type: 'video' },
      { id: '6-2', title: 'Scrum Framework', duration: '30min', type: 'video' },
      { id: '6-3', title: 'Outils de gestion', duration: '20min', type: 'video' },
      { id: '6-1-quiz', title: 'Quiz - Principes Agile', duration: '10min', type: 'quiz' },
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Principes Agile',
        description: 'Fondamentaux des méthodologies agiles',
        order: 1,
        lessons: [
          {
            id: '6-1',
            title: 'Principes Agile',
            description: 'Les 12 principes du manifeste Agile',
            duration: '25min',
            type: 'text',
            content: 'text'
          },
          {
            id: '6-2',
            title: 'Scrum Framework',
            description: 'Introduction au framework Scrum',
            duration: '30min',
            type: 'text',
            content: 'text'
          },
          {
            id: '6-3',
            title: 'Outils de gestion',
            description: 'Outils pour la gestion de projet agile',
            duration: '20min',
            type: 'text',
            content: 'text'
          },
          {
            id: '6-1-quiz',
            title: 'Quiz - Principes Agile',
            description: 'Testez votre compréhension des principes Agile',
            duration: '10min',
            type: 'quiz',
            quiz: {
              id: 'quiz-6-1',
              questions: [
                {
                  id: 'q1',
                  text: 'Quel est l\'objectif principal d\'Agile ?',
                  type: 'multiple-choice',
                  options: ['Documentation exhaustive', 'Livraison rapide de valeur', 'Plan fixe et immuable'],
                  correctAnswer: 'Livraison rapide de valeur',
                  explanation: 'Agile vise à livrer de la valeur en itérations courtes.'
                },
                {
                  id: 'q2',
                  text: 'Dans Scrum, quel rôle est responsable de maximiser la valeur du produit ?',
                  type: 'multiple-choice',
                  options: ['Scrum Master', 'Product Owner', 'Développeur'],
                  correctAnswer: 'Product Owner',
                  explanation: 'Le Product Owner maximise la valeur du produit.'
                }
              ],
              passingScore: 70,
              timeLimit: 10
            }
          }
        ]
      }
    ],
    modulesSchedule: [
      { start: '1 avril', end: '10 avril', module: 'Module 1', title: 'Principes Agile' },
      { start: '10 avril', end: '20 avril', module: 'Module 2', title: 'Scrum Framework' },
      { start: '20 avril', end: '30 avril', module: 'Module 3', title: 'Outils et Pratiques' }
    ]
  }
];