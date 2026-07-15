// src/pages/VoterDashboard.tsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

// 1. TypeScript Interfaces (Data structure define karna)
interface CandidateData {
  _id: string;
  Name: string;
  Party: string;
  Party_Id: string;
}

interface UserProfile {
  Name: string;
  Is_Voted: boolean;
  Voted_to: string | null;
}

const VoterDashboard: React.FC = () => {
  // 2. States for UI management
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 3. Page load hote hi data fetch karna
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Promise.all use kar rahe hain taaki dono APIs parallel me hit hon (Time bachega)
        const [profileRes, candidateRes] = await Promise.all([
          apiClient.get('/user/profile'),
          // DHYAN DE: Apna candidateRoutes.js check kar lena, wahan route '/list' tha ya '/'
          apiClient.get('/candidate/list') 
        ]);

        // Backend response se data nikal kar state me daalna
        setUser(profileRes.data.userInformation);
        setCandidates(candidateRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      } finally {
        setLoading(false); // Data aa gaya, loading ghumaana band karo
      }
    };

    fetchDashboardData();
  }, []);

  // 4. Voting Logic
  const handleVote = async (candidateId: string) => {
    const confirmVote = window.confirm("Are you sure you want to cast your vote for this candidate? This action cannot be undone.");
    if (!confirmVote) return;

    try {
      await apiClient.post('/user/vote', { partyId: candidateId });
      alert("Vote cast successfully! 🎉");
      
      window.location.reload(); 
      
    } catch (error: any) {
      console.error("Voting failed: ", error);
      alert(error.response?.data?.Error || "Failed to cast vote.");
    }
  };

  // 5. Loading Screen (Jab tak data API se aa raha hai)
  if (loading) {
    return <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>Loading your secure dashboard... ⏳</h3>;
  }

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', backgroundColor: '#ffffff' }}>
      
      {/* HEADER SECTION */}
      <div style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#007BFF', margin: 0 }}>Welcome, {user?.Name || 'Voter'}! 🇮🇳</h2>
          <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>Digital Matdaan Kendra</p>
        </div>
        
        {/* STATUS BADGE */}
        <div style={{ 
          padding: '8px 16px', 
          borderRadius: '20px', 
          fontSize: '14px', 
          fontWeight: 'bold',
          backgroundColor: user?.Is_Voted ? '#d4edda' : '#fff3cd',
          color: user?.Is_Voted ? '#155724' : '#856404'
        }}>
          Status: {user?.Is_Voted ? '✅ Voted' : '⏳ Pending'}
        </div>
      </div>

      {/* CONTENT SECTION */}
      {user?.Is_Voted ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fdf9', border: '1px solid #c3e6cb', borderRadius: '12px' }}>
          <h2 style={{ color: '#28a745', margin: '0 0 10px 0' }}>Thank You For Voting! 🗳️</h2>
          <p style={{ color: '#555' }}>Your democratic duty has been securely recorded.</p>
        </div>
      ) : (
        <>
          <p style={{ color: '#444', marginBottom: '20px', fontWeight: '500' }}>Please review the candidates below and cast your valuable vote.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* EMPTY STATE HANDLING */}
            {candidates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', border: '2px dashed #ccc', borderRadius: '12px', color: '#888' }}>
                <h4 style={{ margin: 0 }}>No Candidates Found</h4>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0' }}>The election commission hasn't added any candidates yet.</p>
              </div>
            ) : (
              /* CANDIDATE LIST */
              candidates.map((candidate) => (
                <div key={candidate._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', border: '1px solid #eaeaea', borderRadius: '12px', alignItems: 'center', backgroundColor: '#fbfcff', transition: 'transform 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                  <div>
                    <strong style={{ fontSize: '18px', color: '#222' }}>{candidate.Name}</strong>
                    <div style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#555', display: 'flex', gap: '10px' }}>
                      <span style={{ backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '4px' }}>Party: {candidate.Party}</span>
                      <span style={{ backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '4px' }}>ID: {candidate.Party_Id}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleVote(candidate._id)}
                    style={{ padding: '12px 24px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)' }}
                  >
                    Vote
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VoterDashboard;