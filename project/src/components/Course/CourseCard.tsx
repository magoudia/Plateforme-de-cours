import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Crown } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.isPremium && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white p-1 rounded-full">
            <Crown className="h-4 w-4" />
          </div>
        )}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(course.level)}`}>
          {course.level}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium">{course.category}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.studentsCount.toLocaleString('fr-FR')}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
            <span>{course.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <div className="text-xl font-bold text-blue-600">
            X CFA
          </div>
        </div>
        
        <Link
          to={`/course/${course.id}`}
          className="mt-4 w-full bg-iai-blue text-white py-2 px-4 rounded-lg hover:bg-iai-bordeaux transition-colors font-medium text-center block"
        >
          Voir le cours
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;