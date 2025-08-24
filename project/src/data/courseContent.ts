export const courseContent = {
  '1-1': {
    title: 'Qu\'est-ce que React ?',
    content: `
      <h2>Qu'est-ce que React ?</h2>
      <p>React est une bibliothèque JavaScript open-source développée par Facebook (maintenant Meta) en 2013. Elle permet de créer des interfaces utilisateur interactives et réactives.</p>
      
      <h3>Caractéristiques principales :</h3>
      <ul>
        <li><strong>Composants réutilisables :</strong> Vous pouvez créer des composants qui encapsulent leur propre logique et état</li>
        <li><strong>DOM virtuel :</strong> React utilise un DOM virtuel pour optimiser les performances</li>
        <li><strong>Unidirectionnel :</strong> Le flux de données va toujours du parent vers l'enfant</li>
        <li><strong>JSX :</strong> Syntaxe qui permet d'écrire du HTML dans JavaScript</li>
      </ul>
      
      <h3>Pourquoi React ?</h3>
      <p>React est devenu l'un des frameworks les plus populaires pour le développement web moderne grâce à sa simplicité, sa performance et son écosystème riche.</p>
      
      <div class="info-box">
        <h4>💡 Le saviez-vous ?</h4>
        <p>React est utilisé par de nombreuses entreprises comme Facebook, Instagram, Netflix, Airbnb et bien d'autres.</p>
      </div>
    `
  },
  '1-2': {
    title: 'Installation et configuration',
    content: `
      <h2>Installation et configuration</h2>
      <p>Avant de commencer à développer avec React, vous devez configurer votre environnement de développement.</p>
      
      <h3>Prérequis :</h3>
      <ul>
        <li><strong>Node.js :</strong> Version 14 ou supérieure</li>
        <li><strong>npm ou yarn :</strong> Gestionnaire de paquets</li>
        <li><strong>Éditeur de code :</strong> VS Code recommandé</li>
      </ul>
      
      <h3>Étapes d'installation :</h3>
      <ol>
        <li>Installez Node.js depuis <a href="https://nodejs.org" target="_blank">nodejs.org</a></li>
        <li>Vérifiez l'installation : <code>node --version</code></li>
        <li>Créez un nouveau projet React : <code>npx create-react-app mon-app</code></li>
        <li>Naviguez vers le projet : <code>cd mon-app</code></li>
        <li>Lancez le serveur de développement : <code>npm start</code></li>
      </ol>
      
      <h3>Structure du projet :</h3>
      <p>Un projet React typique contient :</p>
      <ul>
        <li><code>src/</code> : Code source de l'application</li>
        <li><code>public/</code> : Fichiers statiques</li>
        <li><code>package.json</code> : Dépendances et scripts</li>
      </ul>
    `
  },
  '1-3': {
    title: 'Premier composant React',
    content: `
      <h2>Premier composant React</h2>
      <p>Un composant React est une fonction ou une classe qui retourne du JSX. Voici votre premier composant :</p>
      
      <pre><code>import React from 'react';

function MonPremierComposant() {
  return (
    &lt;div&gt;
      &lt;h1&gt;Bonjour React !&lt;/h1&gt;
      &lt;p&gt;Ceci est mon premier composant.&lt;/p&gt;
    &lt;/div&gt;
  );
}

export default MonPremierComposant;</code></pre>
      
      <h3>Explications :</h3>
      <ul>
        <li><strong>import React :</strong> Importe la bibliothèque React</li>
        <li><strong>function :</strong> Définit un composant fonctionnel</li>
        <li><strong>return :</strong> Retourne le JSX à afficher</li>
        <li><strong>export default :</strong> Exporte le composant pour l'utiliser ailleurs</li>
      </ul>
      
      <h3>Utilisation :</h3>
      <p>Pour utiliser ce composant dans votre application :</p>
      <pre><code>import MonPremierComposant from './MonPremierComposant';

function App() {
  return (
    &lt;div&gt;
      &lt;MonPremierComposant /&gt;
    &lt;/div&gt;
  );
}</code></pre>
    `
  },
  '2-1': {
    title: 'Création de composants',
    content: `
      <h2>Création de composants</h2>
      <p>Les composants sont le cœur de React. Ils permettent de diviser votre interface en parties réutilisables.</p>
      
      <h3>Types de composants :</h3>
      
      <h4>1. Composants fonctionnels (recommandés)</h4>
      <pre><code>function MonComposant(props) {
  return &lt;div&gt;{props.message}&lt;/div&gt;;
}</code></pre>
      
      <h4>2. Composants de classe (ancienne syntaxe)</h4>
      <pre><code>class MonComposant extends React.Component {
  render() {
    return &lt;div&gt;{this.props.message}&lt;/div&gt;;
  }
}</code></pre>
      
      <h3>Bonnes pratiques :</h3>
      <ul>
        <li>Nommez vos composants avec une majuscule</li>
        <li>Un composant par fichier</li>
        <li>Utilisez des props pour passer des données</li>
        <li>Gardez vos composants simples et focalisés</li>
      </ul>
      
      <h3>Exemple complet :</h3>
      <pre><code>import React from 'react';

function Bouton({ texte, onClick, disabled = false }) {
  return (
    &lt;button 
      onClick={onClick}
      disabled={disabled}
      className="btn btn-primary"
    &gt;
      {texte}
    &lt;/button&gt;
  );
}

export default Bouton;</code></pre>
    `
  },
  '2-2': {
    title: 'Props et communication',
    content: `
      <h2>Props et communication</h2>
      <p>Les props (propriétés) sont le moyen principal de passer des données d'un composant parent à un composant enfant.</p>
      
      <h3>Définition des props :</h3>
      <pre><code>function MonComposant(props) {
  return (
    &lt;div&gt;
      &lt;h1&gt;{props.titre}&lt;/h1&gt;
      &lt;p&gt;{props.description}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
      
      <h3>Utilisation avec destructuring :</h3>
      <pre><code>function MonComposant({ titre, description, age }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;{titre}&lt;/h1&gt;
      &lt;p&gt;{description}&lt;/p&gt;
      &lt;p&gt;Âge : {age}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
      
      <h3>Passage de props :</h3>
      <pre><code>function App() {
  return (
    &lt;div&gt;
      &lt;MonComposant 
        titre="Mon titre"
        description="Ma description"
        age={25}
      /&gt;
    &lt;/div&gt;
  );
}</code></pre>
      
      <h3>Props par défaut :</h3>
      <pre><code>function MonComposant({ titre = "Titre par défaut" }) {
  return &lt;h1&gt;{titre}&lt;/h1&gt;;
}</code></pre>
      
      <h3>Validation des props :</h3>
      <pre><code>import PropTypes from 'prop-types';

function MonComposant({ titre, age }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;{titre}&lt;/h1&gt;
      &lt;p&gt;Âge : {age}&lt;/p&gt;
    &lt;/div&gt;
  );
}

MonComposant.propTypes = {
  titre: PropTypes.string.isRequired,
  age: PropTypes.number
};</code></pre>
    `
  },
  '3-1': {
    title: "Introduction à Python",
    content: `
      <h2>1. Qu'est-ce que Python ?</h2>
      <p>Python est un langage de programmation interprété, multiplateforme et open-source. Il est particulièrement apprécié pour :</p>
      <ul>
        <li>Sa syntaxe claire et lisible</li>
        <li>Sa polyvalence (web, data science, IA, automation)</li>
        <li>Sa communauté active</li>
      </ul>
      <h4>Exemple :</h4>
      <pre><code class="language-python"># Afficher un message
print("Bonjour le monde !")</code></pre>
      <div style="margin:1em 0;">
        <a href="https://youtu.be/PmpheCTL6yk" target="_blank" rel="noopener noreferrer">▶️ Vidéo explicative (5 min)</a>
      </div>

      <h2>2. Installer Python</h2>
      <p>Téléchargement :</p>
      <ul><li><a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">Site officiel</a></li></ul>
      <p>Vérification :</p>
      <pre><code class="language-bash">python --version
# ou
python3 --version</code></pre>
      <div style="margin:1em 0;">
        <a href="https://youtu.be/rq-36A2SvhE" target="_blank" rel="noopener noreferrer">▶️ Tutoriel d'installation (3 min)</a>
      </div>

      <h2>3. Les Bases de Python</h2>
      <h3>a) Variables et Types</h3>
      <pre><code class="language-python"># Déclaration
age = 25              # Entier (int)
nom = "Alice"         # Chaîne (str)
solde = 150.75        # Flottant (float)
est_actif = True      # Booléen (bool)

# Affichage
print(f"{nom} a {age} ans.")</code></pre>
      <h3>b) Opérations</h3>
      <pre><code class="language-python"># Mathématiques
resultat = 10 + 3 * 2  # Priorité des opérations

# Chaînes
message = "Python" + " " + "Génial"  # Concatenation</code></pre>
      <div style="margin:1em 0;">
        <a href="https://youtu.be/psaDHhZ0cPs" target="_blank" rel="noopener noreferrer">▶️ Bases en 10 min</a>
      </div>

      <h2>4. Structures de Contrôle</h2>
      <h3>Conditions (if/else)</h3>
      <pre><code class="language-python">temperature = 30

if temperature > 25:
    print("Il fait chaud")
elif temperature > 15:
    print("Température idéale")
else:
    print("Il fait froid")</code></pre>
      <h3>Boucles (for/while)</h3>
      <pre><code class="language-python"># Boucle for
for i in range(5):  # 0 à 4
    print(i)

# Boucle while
compteur = 0
while compteur < 3:
    print("En cours...")
    compteur += 1</code></pre>
      <div style="margin:1em 0;">
        <a href="https://youtu.be/8DvywoWv6fI" target="_blank" rel="noopener noreferrer">▶️ Tutoriel conditions/boucles</a>
      </div>

      <h2>5. Fonctions</h2>
      <pre><code class="language-python">def calculer_carre(nombre):
    """Retourne le carré d'un nombre"""
    return nombre ** 2

# Appel
print(calculer_carre(4))  # Affiche 16</code></pre>

      <h2>6. Exercice Pratique</h2>
      <p><strong>Énoncé :</strong> Créez un programme qui convertit les degrés Celsius en Fahrenheit.</p>
      <pre><code class="language-python">def celsius_vers_fahrenheit(celsius):
    return (celsius * 9/5) + 32

print(celsius_vers_fahrenheit(25))  # 77°F</code></pre>
      <div style="margin:1em 0;">
        <a href="https://youtu.be/1Lfv5tUGsn8" target="_blank" rel="noopener noreferrer">▶️ Corrigé en vidéo</a>
      </div>
    `
  },
  '3-2': {
    title: 'useEffect Hook',
    content: `
      <h2>useEffect Hook</h2>
      <p>Le hook useEffect permet d'effectuer des effets de bord dans les composants fonctionnels.</p>
      
      <h3>Syntaxe de base :</h3>
      <pre><code>import React, { useEffect } from 'react';

function MonComposant() {
  useEffect(() => {
    // Code à exécuter après le rendu
    console.log('Composant rendu');
    
    // Fonction de nettoyage (optionnelle)
    return () => {
      console.log('Composant démonté');
    };
  });
  
  return &lt;div&gt;Mon composant&lt;/div&gt;;
}</code></pre>
      
      <h3>Exécution conditionnelle :</h3>
      
      <h4>Exécution à chaque rendu :</h4>
      <pre><code>useEffect(() => {
  console.log('Exécuté à chaque rendu');
});</code></pre>
      
      <h4>Exécution une seule fois :</h4>
      <pre><code>useEffect(() => {
  console.log('Exécuté une seule fois');
}, []); // Tableau de dépendances vide</code></pre>
      
      <h4>Exécution quand une valeur change :</h4>
      <pre><code>useEffect(() => {
  console.log('Exécuté quand count change');
}, [count]); // Dépend de count</code></pre>
      
      <h3>Cas d'usage courants :</h3>
      
      <h4>Appels API :</h4>
      <pre><code>useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  fetchData();
}, []);</code></pre>
      
      <h4>Abonnements :</h4>
      <pre><code>useEffect(() => {
  const subscription = someAPI.subscribe(data => {
    setData(data);
  });
  
  return () => {
    subscription.unsubscribe();
  };
}, []);</code></pre>
      
      <h4>Mise à jour du titre :</h4>
      <pre><code>useEffect(() => {
  document.title = \`Nouveau titre - \${count}\`;
}, [count]);</code></pre>
      
      <h3>Bonnes pratiques :</h3>
      <ul>
        <li>Incluez toutes les dépendances dans le tableau</li>
        <li>Utilisez des fonctions de nettoyage pour éviter les fuites mémoire</li>
        <li>Évitez les effets en boucle infinie</li>
        <li>Utilisez useCallback pour les fonctions dans les dépendances</li>
      </ul>
    `
  },
  'py-intro': {
    title: "Introduction à Python",
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
  }
}; 