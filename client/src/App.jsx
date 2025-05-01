import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import ProfileVisit from './pages/ProfileVisit';


export default function App() {
  const { authUser, checkAuth, isCheckingAuth, searchUser, selectedProject, searchProjects, searchTasks } = useAuthStore();

  useEffect(() => {
    checkAuth();
    searchUser('');
    searchProjects();
    if(selectedProject) {
      searchTasks(selectedProject._id);
    }
  },[checkAuth, selectedProject, searchUser, searchProjects, searchTasks]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Dashboard />:<Navigate to="login" />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/"/>} />
        <Route path="/user/:username" element={authUser ? <ProfileVisit /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}
