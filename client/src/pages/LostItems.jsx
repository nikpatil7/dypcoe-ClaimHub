import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ItemCard from '../components/ItemCard';
import { getAllItems, searchItems } from '../services/itemService';

const LostItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Pass false to exclude delivered items
        const availableItems = await getAllItems(false);
        
        setItems(availableItems);
        setFilteredItems(availableItems);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(availableItems.map(item => item.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items');
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  // Handle search as user types (dynamic search)
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      // Reset to all items if search is empty
      if (selectedCategory) {
        setFilteredItems(items.filter(item => item.category === selectedCategory));
      } else {
        setFilteredItems(items);
      }
      return;
    }
    
    // Local client-side filtering for real-time response
    const results = items.filter(item => {
      const searchLower = term.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(searchLower)) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower)) ||
        (item.location && item.location.toLowerCase().includes(searchLower))
      );
    });
    
    // Apply category filter to search results if needed
    if (selectedCategory) {
      setFilteredItems(results.filter(item => item.category === selectedCategory));
    } else {
      setFilteredItems(results);
    }
  };
  
  // For when the search button is clicked (can do more robust server-side search)
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      // Reset to all items if search is empty
      if (selectedCategory) {
        setFilteredItems(items.filter(item => item.category === selectedCategory));
      } else {
        setFilteredItems(items);
      }
      return;
    }
    
    try {
      setLoading(true);
      // Pass false to exclude delivered items from search results
      const results = await searchItems(searchTerm, false);
      
      // Apply category filter to search results if needed
      if (selectedCategory) {
        setFilteredItems(results.filter(item => item.category === selectedCategory));
      } else {
        setFilteredItems(results);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle category filter
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    
    // Apply both category filter and search term if present
    if (category) {
      // If we have a search term, filter the items that match both the category and search
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const results = items.filter(item => 
          item.category === category && 
          ((item.name && item.name.toLowerCase().includes(searchLower)) ||
           (item.description && item.description.toLowerCase().includes(searchLower)) ||
           (item.location && item.location.toLowerCase().includes(searchLower)))
        );
        setFilteredItems(results);
      } else {
        // If no search term, just filter by category
        setFilteredItems(items.filter(item => item.category === category));
      }
    } else if (searchTerm.trim()) {
      // If category is cleared but search term exists, reapply search
      handleSearchChange(searchTerm);
    } else {
      // If both are cleared, show all items
      setFilteredItems(items);
    }
  };
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Lost Items</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="w-full md:w-1/2 lg:w-2/5">
              <SearchBar onSearch={handleSearchChange} />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-secondary-700">Filter by:</span>
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {filteredItems.length > 0 ? (
              <>
                <p className="text-sm text-secondary-500 mb-4">
                  Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                  {selectedCategory ? ` in ${selectedCategory}` : ''}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <svg 
                  className="mx-auto h-12 w-12 text-secondary-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-secondary-900">No items found</h3>
                <p className="mt-1 text-sm text-secondary-500">
                  {selectedCategory 
                    ? `No items found in the ${selectedCategory} category.` 
                    : 'No items match your search criteria.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setFilteredItems(items);
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LostItems;