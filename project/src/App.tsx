import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Home from './pages/Home';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import CourseLearning from './pages/CourseLearning';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Notifications from './pages/Notifications';
import QuizPythonInteractif from './pages/QuizPythonInteractif';
import RequireLessonCompleted from './components/Common/RequireLessonCompleted';
import AdminConsole from './pages/admin/AdminConsole';


function App() {
  return (
    <NotificationProvider>
      <ProgressProvider>
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ProgressProvider>
    </NotificationProvider>
  );
}

// Separate component to use location hook under Router
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={!isAdminRoute ? "pt-16 min-h-screen bg-gray-50" : "min-h-screen bg-gray-50"}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<CourseCatalog />} />
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route
                  path="/course/:id/learn"
                  element={
                    <ProtectedRoute>
                      <CourseLearning />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz-python-interactif"
                  element={
                    <ProtectedRoute>
                      <RequireLessonCompleted courseId="3" lessonId="3-1-quiz" redirectTo="/course/3/learn">
                        <QuizPythonInteractif />
                      </RequireLessonCompleted>
                    </ProtectedRoute>
                  }
                />
                {/* Single-page Admin Console */}
                <Route path="/admin" element={<AdminConsole />} />
                
                {/* Route de test pour Supabase */}
                
              </Routes>
            </main>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;