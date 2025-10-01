import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme);
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', !prev);
      document.documentElement.classList.toggle('dark', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
