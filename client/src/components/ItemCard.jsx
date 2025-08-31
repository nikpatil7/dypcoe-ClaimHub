import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  // Safely access item properties with defaults
  const {
    _id = '',
    name = 'Unnamed Item',
    description = '',
    category = 'Uncategorized',
    location = 'Unknown',
    foundDate = new Date(),
    status = 'available',
    image = null
  } = item || {};
  
  // Function to determine the status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    try {
      // Convert to dd-mm-yyyy format
      return new Date(dateString).toLocaleDateString('en-GB', options);
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Get the proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/images/placeholder.png';
    
    // If it's a full URL already, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise, prepend the server URL
    return `https://lost-and-found-ruddy.vercel.app${imagePath}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 bg-gray-200">
        <img
          src={getImageUrl(image)}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/placeholder.png';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
            {status === 'available' ? 'Available' : 
             status === 'claimed' ? 'Claimed' : 
             status === 'delivered' ? 'Delivered' : 'Processing'}
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-white text-sm font-medium px-2 py-1 rounded bg-primary-600">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary-900 mb-1 truncate">{name}</h3>
        <p className="text-sm text-secondary-500 mb-2">Found on {formatDate(foundDate)}</p>
        <p className="text-sm text-secondary-700 line-clamp-2 mb-4">{description || 'No description provided.'}</p>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-secondary-500">
            <span className="font-medium">Location:</span> {location}
          </p>
          <Link 
            to={`/lost-items/${_id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;