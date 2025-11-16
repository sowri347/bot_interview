/**
 * Main App component with routing
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateInterview from './components/admin/CreateInterview';
import InterviewDashboard from './components/admin/InterviewDashboard';
import ViewReport from './components/admin/ViewReport';
import CandidateLogin from './components/candidate/CandidateLogin';
import InterviewScreen from './components/candidate/InterviewScreen';
import About from './components/About';
import { getAdminToken, getCandidateToken } from './utils/auth';

// Protected route component for admin
const ProtectedAdminRoute = ({ children }) => {
  const token = getAdminToken();
  return token ? children : <Navigate to="/admin/login" replace />;
};

// Protected route component for candidate
const ProtectedCandidateRoute = ({ children }) => {
  const token = getCandidateToken();
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/create-interview"
          element={
            <ProtectedAdminRoute>
              <CreateInterview />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/interview/:id"
          element={
            <ProtectedAdminRoute>
              <InterviewDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/report/:candidateId"
          element={
            <ProtectedAdminRoute>
              <ViewReport />
            </ProtectedAdminRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/interview/:linkId" element={<CandidateLogin />} />

        {/* Candidate Routes */}
        <Route
          path="/candidate/interview/:linkId"
          element={
            <ProtectedCandidateRoute>
              <InterviewScreen />
            </ProtectedCandidateRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

