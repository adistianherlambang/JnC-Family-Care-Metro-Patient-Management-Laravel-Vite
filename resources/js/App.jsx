import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

//components
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import NewAppointment from './pages/NewAppointment/NewAppointment';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment" element={<NewAppointment />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
