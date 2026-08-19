import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

//components
import LandingPage from './pages/LandingPage/LandingPage';
import TentangKami from './pages/TentangKami/TentangKami';
import CariDokter from './pages/CariDokter/CariDokter';
import Fasilitas from './pages/Fasilitas/Fasilitas';
import ArtikelPage from './pages/ArtikelPage/ArtikelPage';
import Login from './pages/Login/Login';
import NewAppointment from './pages/NewAppointment/NewAppointment';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import BidanDashboard from './pages/BidanDashboard/BidanDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang-kami" element={<TentangKami />} />
        <Route path="/cari-dokter" element={<CariDokter />} />
        <Route path="/fasilitas" element={<Fasilitas />} />
        <Route path="/artikel" element={<ArtikelPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment" element={<NewAppointment />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/bidan-dashboard" element={<BidanDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
