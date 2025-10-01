import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { XIcon, MenuIcon, Search, MapPin, Sun, Moon } from 'lucide-react';
import AuthForm from '../components/AuthForm.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';

const colors = ["bg-red-600", "bg-blue-600", "bg-green-600", "bg-purple-600", "bg-pink-600", "bg-yellow-600", "bg-indigo-600", "bg-teal-600"];

const getColorForUser = (name) => {
  if (!name) return colors[0];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfileAvatar = ({ name }) => {
  const bgColor = getColorForUser(name);
  const initials = getInitials(name || "U");

  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${bgColor}`}
      title={name || "User"}
    >
      {initials}
    </div>
  );
};

const Navbar = ({ searchValue, setSearchValue, onGoogleLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (!user) setShowAuth(true);
    else {
      navigate(path);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`sticky top-0 left-0 right-0 z-50 px-4 py-2 shadow-md transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={assets.logo} alt="Logo" className="w-20 md:w-40 h-auto" />
        </Link>

        {/* Search Bar */}
        <div className={`flex items-center border rounded-full overflow-hidden flex-1 mx-2 md:mx-6 max-w-[700px] transition-colors duration-300 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Movies, Events, Plays, Sports"
            className={`flex-1 px-3 md:px-4 py-1 md:py-2 text-sm md:text-base outline-none transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-pink-600 placeholder-gray-400'}`}
          />
          <button className={`flex items-center justify-center w-10 h-10 shrink-0 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-pink-600'}`}>
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* City Selector + Nav Links + Auth */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* City selector (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            <MapPin className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-[#00bcd4]'}`} />
            <select
              className={`ml-1 font-medium bg-transparent outline-none transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#f83784]'}`}
              defaultValue="Bangalore"
            >
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          {/* Nav Links (desktop) */}
          <div className={`hidden md:flex items-center gap-8 font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#00bcd4]'}`}>
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/my-bookings">MyBookings</Link>
          </div>

          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>

          {/* Auth/Profile */}
          {!user ? (
            <button
              onClick={() => setShowAuth(true)}
              className="px-4 py-2 bg-pink-600 hover:bg-cyan-500 transition rounded-full font-medium text-white"
            >
              Login / Signup
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <ProfileAvatar name={user.name} />
                <span className="hidden md:inline">{user.name}</span>
              </button>
              {isProfileMenuOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-lg p-2 shadow-lg z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <div className="p-2">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm text-gray-400 capitalize">{user.role}</div>
                  </div>
                  <hr className="my-2 border-gray-500" />
                  <button className="w-full text-left p-2 hover:bg-gray-500 rounded" onClick={onGoogleLogin}>Continue with Google</button>
                  <button className="w-full text-left p-2 hover:bg-gray-500 rounded text-red-500" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <MenuIcon className="w-6 h-6 cursor-pointer md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center gap-6 z-40 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-[#f83784]'}`}>
          <XIcon className="w-8 h-8 absolute top-6 right-6 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <select className="font-medium bg-transparent outline-none" defaultValue="Bangalore">
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/">Home</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/movies">Movies</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/my-bookings">My Bookings</Link>
          {!user && (
            <button
              onClick={() => setShowAuth(true)}
              className="px-6 py-2 bg-pink-600 hover:bg-cyan-500 text-white rounded-full text-lg"
            >
              Login / Signup
            </button>
          )}
        </div>
      )}

      {/* Auth Form Modal */}
      <AuthForm
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onGoogleLogin={() => { onGoogleLogin(); setShowAuth(false); }}
      />
    </nav>
  );
};

export default Navbar;
