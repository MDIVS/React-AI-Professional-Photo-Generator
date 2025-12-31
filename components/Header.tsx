
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ProPhoto AI</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">How it works</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Gallery</a>
          </nav>
          <div>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-sm">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
