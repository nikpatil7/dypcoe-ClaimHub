import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {  logout, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-600 font-semibold' : 'text-secondary-700 hover:text-primary-600';
  };
  
  return (
    <nav className="bg-white shadow-md w-full">
      <div className="w-full px-0">
        <div className="flex justify-between h-20">
          {/* Logo - Extreme Left */}
          <div className="flex items-center pl-2 sm:pl-6">
            <Link to="/" className="flex items-center">
              <img
                className="h-12 w-auto"
                src="/DYP_LOGO_black.png"
                alt="DYP Logo"
              />
              <span className="ml-3 text-2xl font-bold text-secondary-900">Lost & Found - DYP College</span>
            </Link>
          </div>
          
          {/* Desktop menu - Extreme Right */}
          <div className="hidden sm:flex sm:items-center pr-2 sm:pr-6">
            <div className="flex space-x-6">
              <Link to="/" className={`px-4 py-2 rounded-md text-base font-medium ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/lost-items" className={`px-4 py-2 rounded-md text-base font-medium ${isActive('/lost-items')}`}>
                Lost Items
              </Link>
              <Link to="/about" className={`px-4 py-2 rounded-md text-base font-medium ${isActive('/about')}`}>
                About Us
              </Link>
              
              {isAuthenticated() ? (
                <>
                  <Link to="/GuardDashboard" className={`px-4 py-2 rounded-md text-base font-medium ${isActive('/GuardDashboard') || isActive('/dashboard')}`}>
                    Dashboard
                  </Link>
                  <Link to="/data-analysis" className={`px-4 py-2 rounded-md text-base font-medium ${isActive('/data-analysis')}`}>
                    Data Analysis
                  </Link>
                  <button
                    onClick={logout}
                    className="ml-2 px-4 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/contact" className={`px-4 py-2 rounded-md text-base font-medium ${isActive('/contact')}`}>
                    Contact Us
                  </Link>
                  <Link
                    to="/login"
                    className="ml-2 px-4 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Guard Login
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden pr-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-7 w-7`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-7 w-7`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1 px-2">
          <Link
            to="/"
            className={`block px-4 py-3 rounded-md text-lg font-medium ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600'}`}
          >
            Home
          </Link>
          <Link
            to="/lost-items"
            className={`block px-4 py-3 rounded-md text-lg font-medium ${isActive('/lost-items') ? 'bg-primary-50 text-primary-600' : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600'}`}
          >
            Lost Items
          </Link>
          <Link
            to="/about"
            className={`block px-4 py-3 rounded-md text-lg font-medium ${isActive('/about') ? 'bg-primary-50 text-primary-600' : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600'}`}
          >
            About Us
          </Link>
          
          {isAuthenticated() ? (
            <>
              <Link
                to="/GuardDashboard"
                className={`block px-4 py-3 rounded-md text-lg font-medium ${isActive('/GuardDashboard') || isActive('/dashboard') ? 'bg-primary-50 text-primary-600' : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/data-analysis"
                className={`block px-4 py-3 rounded-md text-lg font-medium ${isActive('/data-analysis') ? 'bg-primary-50 text-primary-600' : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600'}`}
              >
                Data Analysis
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-3 rounded-md text-lg font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/contact"
                className={`block px-4 py-3 rounded-md text-lg font-medium ${isActive('/contact') ? 'bg-primary-50 text-primary-600' : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary-600'}`}
              >
                Contact Us
              </Link>
              <Link
                to="/login"
                className="block w-full text-center px-4 py-3 rounded-md text-lg font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Guard Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;