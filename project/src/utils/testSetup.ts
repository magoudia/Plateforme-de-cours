// Utilitaire pour configurer un utilisateur de test
export const setupTestUser = () => {
  // Créer un utilisateur de test
  const testUser = {
    id: 'test-user-1',
    email: 'test@example.com',
    name: 'Utilisateur Test',
    enrolledCourses: ['1'] // Inscrit au cours React & TypeScript
  };

  // Sauvegarder l'utilisateur dans le localStorage
  const users = [testUser];
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(testUser));

  console.log('✅ Utilisateur de test configuré:', testUser);
  return testUser;
};

// Vérifier si l'utilisateur est inscrit à un cours
export const checkEnrollment = (courseId: string) => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    const isEnrolled = user.enrolledCourses.includes(courseId);
    console.log(`📚 Inscription au cours ${courseId}:`, isEnrolled ? '✅ Oui' : '❌ Non');
    return isEnrolled;
  }
  console.log('❌ Aucun utilisateur connecté');
  return false;
};

// Nettoyer les données de test
export const cleanupTestData = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('users');
  console.log('🧹 Données de test nettoyées');
}; 