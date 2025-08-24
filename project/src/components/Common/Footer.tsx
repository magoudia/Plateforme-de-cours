import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-iai-blue" />
              <span className="text-xl font-bold">IAI-COMPETENCES</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Plateforme de formation et de développement des compétences numériques.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">
                  Catalogue de cours
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Catégories</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Développement Web</li>
              <li className="text-gray-300">Design</li>
              <li className="text-gray-300">Programmation</li>
              <li className="text-gray-300">Marketing</li>
              <li className="text-gray-300">Gestion</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div>Liberté 6 extension lot no16</div>
              <div className="font-semibold mt-2">Adama Aly Diao</div>
              <div>Directeur</div>
              <div className="flex items-center space-x-2 mt-2">
                <Phone className="h-4 w-4 text-iai-blue" />
                <span>77 639 58 10</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-iai-blue" />
                <span>Iai-competences@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 IAI-Compétences. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;