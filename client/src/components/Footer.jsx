import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Lost & Found - DYPCOE
            </h3>
            <p className="text-secondary-300 text-sm">
              Helping students find their lost belongings and return them to
              their rightful owners.
            </p>
            <div className="mt-4 flex items-center">
              <img
                src="/DYP_LOGO_black.png"
                alt="DYPCOE Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="text-sm text-secondary-300">
                DYPCOE College, Pune
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-secondary-300">
              <li>
                <Link to="/" className="hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/lost-items" className="hover:text-primary-400">
                  Lost Items
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400">
                  Guard Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2 text-sm text-secondary-300">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 text-primary-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  D. Y. Patil Educational Complex, Sector 29, Nigdi Pradhikaran,
                  Akurdi, Pune 411044.
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-primary-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@dypcoeakurdi.ac.in</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-primary-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>020-27653054 </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-secondary-700 text-sm text-secondary-400 text-center">
          <p>
            © {new Date().getFullYear()} DYPCOE College Lost & Found. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;