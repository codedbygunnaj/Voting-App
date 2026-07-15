// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, loginCandidate } from '../api/authApi'; // Apni API import kari

const Login: React.FC = () => {
  const [isUser, setIsUser] = useState<boolean>(true);
  const [aadhar, setAadhar] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // React Router ka hook URL change karne ke liye
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (isUser) {
        // 1. API Call
        const response = await loginUser({ 
          aadharNumber: aadhar, 
          password: password 
        });
        
        console.log("Login Success: ", response);
        
        // 2. Token ko Local Storage me save karna (tere backend ne 'newToken' bheja tha)
        localStorage.setItem('token', response.newToken);
        
        // 3. User ko Dashboard pe bhej dena
        navigate('/voter-dashboard');
      } else {
        const response = await loginCandidate({ 
          aadharNumber: aadhar, 
          password: password 
        });
        
        console.log("Candidate Login Success: ", response);
        
        // Token save karke candidate-dashboard par bhej do
        localStorage.setItem('token', response.newToken);
        navigate('/candidate-dashboard');
      }
    } catch (error) {
      console.error("Login failed: ", error);
      alert("Login Failed! Please check your credentials.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', border: '1px solid #ddd', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login to Voter App</h2>
      
      {/* 3. THE TOGGLE BAR */}
      <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
        <button 
          onClick={() => setIsUser(true)} 
          style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', background: isUser ? '#007BFF' : '#f0f0f0', color: isUser ? '#fff' : '#333', fontWeight: 'bold' }}
        >
          Voter
        </button>
        <button 
          onClick={() => setIsUser(false)} 
          style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', background: !isUser ? '#007BFF' : '#f0f0f0', color: !isUser ? '#fff' : '#333', fontWeight: 'bold' }}
        >
          Candidate
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Aadhar Card Number" 
          value={aadhar} 
          onChange={(e) => setAadhar(e.target.value)} 
          required 
          maxLength={12}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <button type="submit" style={{ padding: '12px', backgroundColor: isUser ? '#28a745' : '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Login as {isUser ? 'Voter' : 'Candidate'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        New here? <Link to="/signup" style={{ color: '#007BFF', textDecoration: 'none' }}>Register as {isUser ? 'Voter' : 'Candidate'}</Link>
      </p>
    </div>
  );
};

export default Login;