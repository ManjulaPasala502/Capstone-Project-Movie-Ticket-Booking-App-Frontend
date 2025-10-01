import React, { useEffect, useState, createContext } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import { Toaster } from 'react-hot-toast';
import Favorite from './pages/Favorite';

import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageMovies from './pages/Admin/ManageMovies';
import ManageTheaters from './pages/Admin/ManageTheaters';
import ManageBookings from './pages/Admin/ManageBookings';

import OwnerDashboard from './pages/Owner/OwnerDashboard';
import MyShows from './pages/Owner/MyShows';
import AddShow from './pages/Owner/AddShow';
import ManageTheatersOwner from './pages/Owner/ManageTheatersOwner';

import Footer from './components/Footer';
import BannerCarousel from './components/BannerCarousel';
import { fetchMovies } from './services/movieService';
import CheckoutForm from './components/CheckoutForm';

// Create a Theme Context
export const ThemeContext = createContext();

const App = () => {
  const [searchValue, setSearchValue] = useState(' ');
  const [moviesData, setMoviesData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => {
    const getMovies = async () => {
      const data = await fetchMovies();
      setMoviesData(data);
    };
    getMovies();
  }, []);

  const location = useLocation();

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen transition-colors duration-300`}>
        <Navbar searchValue={searchValue} setSearchValue={setSearchValue} />

        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <BannerCarousel />
                <Home moviesData={moviesData} searchValue={searchValue} />
              </>
            }
          />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/seat-layout/:showId" element={<SeatLayout />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/favorite" element={<PrivateRoute><Favorite /></PrivateRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/movies" element={<PrivateRoute><ManageMovies /></PrivateRoute>} />
          <Route path="/admin/theaters" element={<PrivateRoute><ManageTheaters /></PrivateRoute>} />
          <Route path="/admin/bookings" element={<PrivateRoute><ManageBookings /></PrivateRoute>} />

          {/* Owner routes */}
          <Route path="/owner/dashboard" element={<PrivateRoute roles={["owner"]}><OwnerDashboard /></PrivateRoute>} />
          <Route path="/owner/my-shows" element={<PrivateRoute roles={["owner"]}><MyShows /></PrivateRoute>} />
          <Route path="/owner/add-show" element={<PrivateRoute roles={["owner"]}><AddShow /></PrivateRoute>} />
          <Route path="/owner/manage-theaters" element={<PrivateRoute roles={["owner"]}><ManageTheatersOwner /></PrivateRoute>} />
        </Routes>

        <Footer />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
