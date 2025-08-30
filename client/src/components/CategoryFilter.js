import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200
          ${!selectedCategory 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'}`}
        onClick={() => onSelectCategory(null)}
      >
        All Items
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200
            ${selectedCategory === category 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;