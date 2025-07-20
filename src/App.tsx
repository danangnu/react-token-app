// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavigateToLoginOrDashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

const NavigateToLoginOrDashboard = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;
