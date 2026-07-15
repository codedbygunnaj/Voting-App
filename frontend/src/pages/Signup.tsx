// src/pages/Signup.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, registerCandidate } from '../api/authApi';

const Signup: React.FC = () => {
  // 1. TOGGLE STATE: Check user type
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState<boolean>(true);

  // 2. FORM STATE: Ek bada object jisme User aur Candidate dono ke fields hain.
  // Jo field jiske kaam ka nahi hoga, API call ke time hum usko hata denge.
  const [formData, setFormData] = useState({
    Name: '',
    Date_of_Birth: '',
    Age: '',
    Gender: '',
    Email_id: '',
    Mobile: '',
    Address: '',
    AadharCard_Number: '',
    Password: '',
    Party: '',      // Only for Candidate
    Party_Id: ''    // Only for Candidate
  });

  // Ye function kisi bhi input ke change hone pe uska state update karega
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isUser) {
        const response = await registerUser(formData);
        localStorage.setItem('token', response.token); 
        
        // 3. Redirect to Voter Dashboard
        alert("Registration Successful!");
        navigate('/voter-dashboard');
      } else {
        // Candidate Route Hit
        const candidatePayload = {
            Name: formData.Name,
            Age_Of_Contender: Number(formData.Age), // Schema se name match kar diya
            Party: formData.Party,
            Party_Id: formData.Party_Id,
            AadharCard_Number: formData.AadharCard_Number,
            Password: formData.Password
        };

        const response = await registerCandidate(candidatePayload);
        localStorage.setItem('token', response.token); 
        alert("Candidate Registration Successful!");
        navigate('/candidate-dashboard');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed! Check console for errors.");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', border: '1px solid #ddd', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      {/* Naya Naam Lagaya Hai Yahan! */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register on e-Matdaan</h2>
      
      {/* TOGGLE BUTTONS */}
      <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
        <button 
          type="button"
          onClick={() => setIsUser(true)} 
          style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', background: isUser ? '#007BFF' : '#f0f0f0', color: isUser ? '#fff' : '#333', fontWeight: 'bold' }}
        >
          Voter
        </button>
        <button 
          type="button"
          onClick={() => setIsUser(false)} 
          style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', background: !isUser ? '#007BFF' : '#f0f0f0', color: !isUser ? '#fff' : '#333', fontWeight: 'bold' }}
        >
          Candidate
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* COMMON FIELDS (Dono ko chahiye) */}
        <input type="text" name="Name" placeholder="Full Name" value={formData.Name} onChange={handleChange} required style={inputStyle} />
        
        <input type="text" name="AadharCard_Number" placeholder="Aadhar Card Number (12 digits)" value={formData.AadharCard_Number} onChange={handleChange} required maxLength={12} style={inputStyle} />
        
        <input type="password" name="Password" placeholder="Create Password" value={formData.Password} onChange={handleChange} required style={inputStyle} />

        {/* ========================================= */}
        {/* CONDITIONAL FIELDS: Sirf User (Voter) ke liye */}
        {/* ========================================= */}
        {isUser && (
          <>
            <input type="date" name="Date_of_Birth" value={formData.Date_of_Birth} onChange={handleChange} required style={inputStyle} />
            
            <input type="number" name="Age" placeholder="Age" value={formData.Age} onChange={handleChange} required style={inputStyle} />
            
            <select name="Gender" value={formData.Gender} onChange={handleChange} required style={inputStyle}>
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            
            <input type="email" name="Email_id" placeholder="Email Address (Optional)" value={formData.Email_id} onChange={handleChange} style={inputStyle} />
            
            <input type="text" name="Mobile" placeholder="Mobile Number (Optional)" value={formData.Mobile} onChange={handleChange} style={inputStyle} />
            
            <input type="text" name="Address" placeholder="Full Address" value={formData.Address} onChange={handleChange} required style={inputStyle} />
          </>
        )}

        {/* ========================================= */}
        {/* CONDITIONAL FIELDS: Sirf Candidate ke liye */}
        {/* ========================================= */}
        {!isUser && (
          <>
            <input type="number" name="Age" placeholder="Age of Contender" value={formData.Age} onChange={handleChange} required style={inputStyle} />
            <input type="text" name="Party" placeholder="Party Name (e.g., BJP, AAP)" value={formData.Party} onChange={handleChange} required style={inputStyle} />
            <input type="text" name="Party_Id" placeholder="Party ID (Unique)" value={formData.Party_Id} onChange={handleChange} required style={inputStyle} />
          </>
        )}

        <button type="submit" style={{ padding: '12px', backgroundColor: isUser ? '#28a745' : '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register as {isUser ? 'Voter' : 'Candidate'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Already have an account? <Link to="/login" style={{ color: '#007BFF', textDecoration: 'none' }}>Log in here</Link>
      </p>
    </div>
  );
};

// Ek chota sa CSS object taaki har input me baar baar inline style na likhna pade
const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

export default Signup;