import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllCourses } from '../services/adminCourses';
import { Course } from '../types';
import CourseCard from '../components/Course/CourseCard';
import logo from '../assets/logo.png';
import pythonsLogo from '../assets/pythons.jpeg';
import { useNotification } from '../contexts/NotificationContext';

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  useEffect(() => {
    const onStorage = () => setCourses(getAllCourses());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const featuredCourses = courses.slice(0, 3);
  const { addNotification } = useNotification();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-iai-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Développez vos compétences
              <span className="block text-white">avec IAI-Compétences</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              Accédez à des milliers de cours en ligne créés par des experts pour booster votre carrière
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="bg-white text-iai-blue px-8 py-3 rounded-lg font-semibold border-2 border-white transition-colors inline-flex items-center justify-center"
              >
                Explorer les cours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                onClick={() => {
                  addNotification({ type: 'success', title: 'Inscription', message: 'Vous vous êtes inscrit avec succès !' });
                }}
                className="bg-iai-bordeaux text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-iai-bordeaux transition-colors inline-flex items-center justify-center"
              >
                Commencer gratuitement
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-iai-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-iai-blue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-iai-blue" />
              </div>
              <h3 className="text-3xl font-bold text-iai-blue mb-2">100+</h3>
              <p className="text-iai-blue">Cours disponibles</p>
            </div>
            <div className="text-center">
              <div className="bg-iai-blue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-iai-blue" />
              </div>
              <h3 className="text-3xl font-bold text-iai-blue mb-2">10K+</h3>
              <p className="text-iai-blue">Étudiants actifs</p>
            </div>
            <div className="text-center">
              <div className="bg-iai-blue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-iai-blue" />
              </div>
              <h3 className="text-3xl font-bold text-iai-blue mb-2">98%</h3>
              <p className="text-iai-blue">Taux de satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-iai-blue mb-4">
              Cours populaires
            </h2>
            <p className="text-xl text-iai-blue max-w-2xl mx-auto">
              Découvrez nos cours les plus appréciés par la communauté
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/courses"
              className="px-8 py-3 border-2 border-iai-bordeaux text-iai-bordeaux bg-transparent rounded-full font-semibold transition-colors duration-200 inline-flex items-center shadow-sm hover:bg-iai-bordeaux hover:text-white hover:shadow-lg"
            >
              Voir tous les cours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-iai-blue-light text-iai-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à commencer votre apprentissage ?
            </h2>
            <p className="text-xl text-iai-blue mb-8">
              Rejoignez des milliers d'apprenants et développez vos compétences dès aujourd'hui
            </p>
            <Link
              to="/register"
              className="bg-iai-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-iai-bordeaux transition-colors inline-flex items-center text-lg"
            >
              <Play className="mr-2 h-6 w-6" />
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="bg-white text-iai-blue py-16 border-t">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Formulaire de contact */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Contactez-nous</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">Nom</label>
                <input id="name" name="name" type="text" required className="w-full px-4 py-2 border border-iai-blue rounded-lg focus:ring-2 focus:ring-iai-blue focus:outline-none" placeholder="Votre nom" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                <input id="email" name="email" type="email" required className="w-full px-4 py-2 border border-iai-blue rounded-lg focus:ring-2 focus:ring-iai-blue focus:outline-none" placeholder="Votre email" />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                <textarea id="message" name="message" rows={5} required className="w-full px-4 py-2 border border-iai-blue rounded-lg focus:ring-2 focus:ring-iai-blue focus:outline-none" placeholder="Votre message..." />
              </div>
              <button type="submit" className="bg-iai-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-iai-bordeaux transition-colors">Envoyer</button>
            </form>
          </div>
          {/* Image Python et texte */}
          <div className="flex flex-col items-center justify-center">
            <img src={pythonsLogo} alt="Logo Pythons" className="max-w-xs w-full object-contain rounded-xl shadow-lg mb-4" />
            <p className="text-lg text-iai-blue text-center">Découvrez la puissance de Python pour vos projets IA et data science.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;