import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import CitizenLogin from './pages/CitizenLogin';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import ComplaintForm from './pages/ComplaintForm';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'citizen' | 'admin' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Header />}
        
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} replace /> : <LandingPage />} />
          <Route path="/citizen-login" element={user ? <Navigate to="/dashboard" replace /> : <CitizenLogin />} />
          <Route path="/admin-login" element={user ? <Navigate to="/admin-dashboard" replace /> : <AdminLogin />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="citizen">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complaint/:departmentId" 
            element={
              <ProtectedRoute requiredRole="citizen">
                <ComplaintForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <AppRoutes />
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;