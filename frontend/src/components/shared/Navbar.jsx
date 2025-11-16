/**
 * Navigation bar component
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAdminToken } from '../../utils/auth';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = getAdminToken();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-accent-green rounded-none flex items-center justify-center text-black text-xl font-bold">
                A
              </div>
              <span className="text-white text-xl font-bold">AI Interview Bot</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                    isActive('/admin/dashboard') 
                      ? 'text-accent-green' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/about"
                className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive('/about') 
                    ? 'text-accent-green' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
              >
                Admin
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

