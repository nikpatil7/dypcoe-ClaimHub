import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle form submission (for the search button)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  // For real-time search as user types
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Call the parent's search handler as the user types
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-secondary-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-secondary-900 placeholder-secondary-400"
          placeholder="Search for lost items..."
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
          >
            <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Search
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;