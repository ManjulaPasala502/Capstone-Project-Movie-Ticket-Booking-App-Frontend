// Footer.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { GiFilmSpool, GiPopcorn } from "react-icons/gi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-10 -left-10 opacity-20 text-pink-600 text-[120px]">
        <GiFilmSpool />
      </div>
      <div className="absolute -bottom-10 -right-10 opacity-20 text-pink-600 text-[120px]">
        <GiPopcorn />
      </div>

      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-16 flex flex-col md:flex-row justify-between">
        {/* Branding */}
        <div className="mb-8 md:mb-0 max-w-xs">
          <h2 className="text-3xl font-bold text-pink-600 flex items-center gap-2">
            <GiFilmSpool /> Cine_App
          </h2>
          <p className="text-gray-400 mt-3">
            Your ultimate cinema companion. Book tickets, check showtimes, and enjoy movies hassle-free!
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 md:mb-0">
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-pink-600 transition">Home</a></li>
            <li><a href="/movies" className="hover:text-pink-600 transition">Movies</a></li>
            <li><a href="/bookings" className="hover:text-pink-600 transition">My Bookings</a></li>
            <li><a href="/contact" className="hover:text-pink-600 transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400">
            <a href="#" className="hover:text-pink-600 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-pink-600 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-600 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-pink-600 transition"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Cine_App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
