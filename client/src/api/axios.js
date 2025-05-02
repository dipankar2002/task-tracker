import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://task-tracker-server-i7st.onrender.com/api',
  withCredentials: true, // For cookies
});
