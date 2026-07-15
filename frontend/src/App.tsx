// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Import the new gatekeeper
import Login from './pages/Login';
import Signup from './pages/Signup';
import VoterDashboard from './pages/VoterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';

const App = () => {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '30px', paddingBottom: '15px', borderBottom: '2px solid #eaeaea', textAlign: 'center' }}>
          <h1 style={{ color: '#007BFF', margin: 0, fontSize: '2rem' }}>🇮🇳 e-Matdaan</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>Secure Digital Voting Portal</p>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED ROUTES: Only accessible if token exists */}
          <Route element={<ProtectedRoute />}>
            <Route path="/voter-dashboard" element={<VoterDashboard />} />
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          </Route>
          
          <Route path="*" element={<h3 style={{textAlign: 'center'}}>404 - Page Not Found</h3>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;