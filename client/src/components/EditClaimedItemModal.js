import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { updateClaimedItem } from '../services/itemService';
import { toast } from 'react-toastify';

const EditClaimedItemModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    foundDate: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setItemFormData({
        name: item.name || '',
        category: item.category || '',
        description: item.description || '',
        location: item.location || '',
        foundDate: item.foundDate ? new Date(item.foundDate).toISOString().split('T')[0] : ''
      });
      
      // Set image preview if item has an image
      if (item.image) {
        const imageUrl = item.image.startsWith('http') 
          ? item.image 
          : `https://lost-and-found-ruddy.vercel.app${item.image}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview('');
      }
    }
  }, [item]);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate item data
    if (!itemFormData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!itemFormData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!itemFormData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (!itemFormData.foundDate) {
      newErrors.foundDate = 'Found date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show error toast for the first error
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Append all item fields
      Object.keys(itemFormData).forEach(key => {
        formData.append(key, itemFormData[key]);
      });
      
      // Append image if selected
      if (image) {
        formData.append('image', image);
      }

      await updateClaimedItem(item._id, formData);
      toast.success('Item details updated successfully');
      setLoading(false);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update item');
      toast.error(err.message || 'Failed to update item');
      setLoading(false);
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Study Material',
    'Accessories',
    'ID Cards',
    'Keys',
    'Wallet/Money',
    'Other'
  ];

  const locations = [
    'Entry gate',
    'F1 Building',
    'A1 Building',
    'A2 Building',
    'A3 Building',
    'Canteen Area',
    'Library',
    'Reading Hall',
    'Computer Lab',
    'Auditorium',
    'College GYM',
    'Table Tennis Room',
    'Parking Lot',
    'Boys Hostel',
    'Girls Hostel',
    'Play Ground',
    'Student Counter',
    'Green Lawn',
    'Main Building',
    'Sports Field',
    'Other'
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Edit Claimed Item Details"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Item Details</h3>
          
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name*
              </label>
              <input
                type="text"
                name="name"
                value={itemFormData.name}
                onChange={handleItemChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                name="category"
                value={itemFormData.category}
                onChange={handleItemChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <select
                name="location"
                value={itemFormData.location}
                onChange={handleItemChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Found*
              </label>
              <input
                type="date"
                name="foundDate"
                value={itemFormData.foundDate}
                onChange={handleItemChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
              {errors.foundDate && (
                <p className="mt-1 text-sm text-red-600">{errors.foundDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={itemFormData.description}
                onChange={handleItemChange}
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Image
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview}
                      alt="Item preview" 
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-5 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 text-red-600 text-sm">
          {error}
        </div>
      )}
    </Modal>
  );
};

export default EditClaimedItemModal; 