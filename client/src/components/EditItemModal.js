import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { updateItem } from '../services/itemService';

const EditItemModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [formData, setFormData] = useState({
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

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData to handle file upload
      const itemFormData = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        itemFormData.append(key, formData[key]);
      });
      
      // Append image if selected
      if (image) {
        itemFormData.append('image', image);
      }

      await updateItem(item._id, itemFormData);
      setLoading(false);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update item');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location Found</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Location</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="foundDate" className="block text-sm font-medium text-gray-700">Date Found</label>
          <input
            type="date"
            id="foundDate"
            name="foundDate"
            value={formData.foundDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Item Image (Optional)</label>
          <div className="mt-1 flex items-center space-x-4">
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Item preview" 
                  className="h-24 w-24 object-cover rounded border border-gray-300"
                />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to keep the current image
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditItemModal; 