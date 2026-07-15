// src/pages/CandidateDashboard.tsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

// 1. Backend se aane wale data ka structure define kiya
interface CandidateProfile {
  Name: string;
  Party: string;
  Total_Votes: number;
}

const CandidateDashboard: React.FC = () => {
  // 2. States setup kiye: Profile data, loading state, aur error state ke liye
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 3. API se data fetch karne ka function (ise alag banaya taaki refresh button pe call kar sakein)
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Backend route hit kar rahe hain
      const response = await apiClient.get('/candidate/profile');
      setProfile(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching candidate profile:", err);
      setError("Failed to load profile. Please make sure you are logged in.");
    } finally {
      setLoading(false); // Data aane ke baad loading false kar do
    }
  };

  // 4. Page khulte hi sabse pehle fetchProfile chalega
  useEffect(() => {
    fetchProfile();
  }, []);

  // 5. Jab tak API se response nahi aata, ye loading screen dikhegi
  if (loading && !profile) {
    return <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>Loading your live dashboard... ⏳</h3>;
  }

  // 6. Agar token galat hai ya koi error hai, toh ye dikhega
  if (error) {
    return <h3 style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</h3>;
  }

  // 7. REAL UI rendering with actual data
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', backgroundColor: '#ffffff' }}>
      <h2 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>Welcome, {profile?.Name}! 🚀</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>Here is your real-time election performance.</p>
      
      <div style={{ padding: '40px', backgroundColor: '#fff3f3', borderRadius: '12px', border: '1px solid #ffcccc', position: 'relative' }}>
        <h3 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Total Votes Received</h3>
        
        {/* Live Vote Count */}
        <h1 style={{ fontSize: '72px', color: '#dc3545', margin: '20px 0', fontWeight: '900' }}>
          {profile?.Total_Votes || 0}
        </h1>
        
        <div style={{ fontSize: '18px', color: '#666', marginTop: '10px', fontWeight: '500' }}>
          <strong>{profile?.Name}</strong> | {profile?.Party}
        </div>
        
        {/* Refresh Button */}
        <button 
          onClick={fetchProfile}
          style={{ marginTop: '25px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Live Votes'}
        </button>
      </div>
    </div>
  );
};

export default CandidateDashboard;