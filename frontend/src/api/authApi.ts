import apiClient from './apiClient';

export const loginUser = async (loginData: any) => {
  try {
    const response = await apiClient.post('/user/login', loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginCandidate = async (loginData: any) => {
  try {
    // Assuming we make a /candidate/login route later, 
    // so for now we structure it this way
    const response = await apiClient.post('/candidate/login', loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await apiClient.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerCandidate = async (candidateData: any) => {
  try {
    const response = await apiClient.post('/candidate/signup', candidateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Yahan kal hum loginUser aur loginCandidate ke functions bhi add karenge!