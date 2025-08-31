import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCamera, FaUpload, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { formatDate, parseDateForServer } from '../utils/dateUtils';
import ContextualHelp from '../components/ContextualHelp';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    foundDate: new Date().toISOString().split('T')[0], // Keep this in YYYY-MM-DD format for input[type=date]
    status: 'available',
    contributor: {
      userType: 'Student',
      studentName: '',
      rollNumber: '',
      department: '',
      studyYear: '',
      // Staff fields
      staffName: '',
      staffDepartment: '',
      mobileNo: '',
      // Guard & Helper fields
      guardName: '',
      helperName: '',
      email: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Categories for lost items
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

  // Campus locations
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

  // Study years
  const studyYears = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ];
  
  // Departments
  const departments = [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'AI & DS',
    'ECE',
    'Administration',
    'Accounts',
    'Library',
    'Placement Cell',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For foundDate, prevent future dates
    if (name === 'foundDate') {
      const selectedDate = new Date(value);
      const today = new Date();
      
      // Reset time parts for comparison (compare dates only)
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        // If future date, display error and don't update state
        toast.error('Found date cannot be in the future');
        return;
      }
    }
    
    // Validate roll number (must be exactly 5 digits)
    if (name === 'contributor.rollNumber') {
      if (value && !/^\d{0,5}$/.test(value)) {
        toast.error('Roll number must be numeric and maximum 5 digits');
        return;
      }
    }
    
    // Validate mobile number (must be exactly 10 digits)
    if (name === 'contributor.mobileNo') {
      if (value && !/^\d{0,10}$/.test(value)) {
        toast.error('Mobile number must be numeric and maximum 10 digits');
        return;
      }
    }
    
    // Don't validate email format during typing, only store the value
    // Email will be validated on form submission instead
    
    if (name.startsWith('contributor.')) {
      const contributorField = name.split('.')[1];
      setFormData({
        ...formData,
        contributor: {
          ...formData.contributor,
          [contributorField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size cannot exceed 5MB');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!imageFile) {
      toast.error('Please upload an image of the item');
      return;
    }
    
    // Validate contributor data based on userType
    const { userType } = formData.contributor;
    
    if (userType === 'Student' && formData.contributor.studentName) {
      // Validate roll number if provided for student
      if (formData.contributor.rollNumber && !/^\d{5}$/.test(formData.contributor.rollNumber)) {
        toast.error('Roll number must be exactly 5 digits');
        return;
      }
    } else if (userType === 'Staff' && formData.contributor.staffName) {
      // Validate required fields for staff
      if (!formData.contributor.staffDepartment) {
        toast.error('Please provide department for staff contributor');
        return;
      }
      // Validate mobile number for staff
      if (formData.contributor.mobileNo && !/^\d{10}$/.test(formData.contributor.mobileNo)) {
        toast.error('Mobile number must be exactly 10 digits');
        return;
      }
    }
    
    // Validate email format if provided for any contributor type
    if (formData.contributor.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.contributor.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Create form data to send the image file
      const itemFormData = new FormData();
      itemFormData.append('image', imageFile);
      itemFormData.append('name', formData.name);
      itemFormData.append('category', formData.category);
      itemFormData.append('description', formData.description);
      itemFormData.append('location', formData.location);
      
      // Add contributor information based on userType
      const { contributor } = formData;
      if (contributor.userType) {
        itemFormData.append('contributor[userType]', contributor.userType);
        
        if (contributor.userType === 'Student' && contributor.studentName) {
          itemFormData.append('contributor[studentName]', contributor.studentName);
          itemFormData.append('contributor[rollNumber]', contributor.rollNumber);
          itemFormData.append('contributor[department]', contributor.department);
          itemFormData.append('contributor[studyYear]', contributor.studyYear);
        } 
        else if (contributor.userType === 'Staff' && contributor.staffName) {
          itemFormData.append('contributor[staffName]', contributor.staffName);
          itemFormData.append('contributor[staffDepartment]', contributor.staffDepartment);
          itemFormData.append('contributor[mobileNo]', contributor.mobileNo);
          itemFormData.append('contributor[email]', contributor.email);
        }
        else if (contributor.userType === 'Guard' && contributor.guardName) {
          itemFormData.append('contributor[guardName]', contributor.guardName);
          itemFormData.append('contributor[email]', contributor.email);
        }
        else if (contributor.userType === 'Helper' && contributor.helperName) {
          itemFormData.append('contributor[helperName]', contributor.helperName);
          itemFormData.append('contributor[email]', contributor.email);
        }
      }
      
      // Ensure foundDate is sent as ISO string with the selected date
      console.log('Selected date from form:', formData.foundDate);
      
      // Validate the date - past or today only, no future dates
      const selectedDate = new Date(formData.foundDate);
      const today = new Date();
      
      // Reset time parts for comparison (compare dates only)
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        toast.error('Found date cannot be in the future');
        setLoading(false);
        return;
      }
      
      // Format the date for the server
      try {
        const formattedDate = parseDateForServer(formData.foundDate);
        console.log('Formatted date for server:', formattedDate);
        itemFormData.append('foundDate', formattedDate);
      } catch (error) {
        console.error('Error formatting date:', error);
        toast.error('Invalid date format. Please select a valid date.');
        setLoading(false);
        return;
      }
      
      itemFormData.append('status', formData.status);
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Use the imported axios instance or directly call the API
      const apiUrl = 'https://lost-and-found-ruddy.vercel.app/api/items';
      
      const response = await axios.post(
        apiUrl,
        itemFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      toast.success('Item added successfully!');
      
      // Navigate to the dashboard after a brief delay
      setTimeout(() => {
        navigate('/GuardDashboard');
      }, 1500);
      
    } catch (error) {
      console.error("Error adding item:", error);
      const errorMessage = error.response?.data?.message || 'Failed to add item. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render contributor form fields based on selected contributor type
  const renderContributorFields = () => {
    const { userType } = formData.contributor;
    
    if (userType === 'Student') {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contributor.studentName" className="block text-gray-700 text-sm font-bold mb-2">
              Student Name
            </label>
            <input
              type="text"
              id="contributor.studentName"
              name="contributor.studentName"
              value={formData.contributor.studentName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="contributor.rollNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Roll Number
            </label>
            <input
              type="text"
              id="contributor.rollNumber"
              name="contributor.rollNumber"
              value={formData.contributor.rollNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 12345"
              maxLength={5}
            />
          </div>
          
          <div>
            <label htmlFor="contributor.department" className="block text-gray-700 text-sm font-bold mb-2">
              Department
            </label>
            <select
              id="contributor.department"
              name="contributor.department"
              value={formData.contributor.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select department</option>
              {departments.map((department, index) => (
                <option key={index} value={department}>{department}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="contributor.studyYear" className="block text-gray-700 text-sm font-bold mb-2">
              Study Year
            </label>
            <select
              id="contributor.studyYear"
              name="contributor.studyYear"
              value={formData.contributor.studyYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select year</option>
              {studyYears.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      );
    } 
    else if (userType === 'Staff') {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contributor.staffName" className="block text-gray-700 text-sm font-bold mb-2">
              Staff Name
            </label>
            <input
              type="text"
              id="contributor.staffName"
              name="contributor.staffName"
              value={formData.contributor.staffName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="contributor.staffDepartment" className="block text-gray-700 text-sm font-bold mb-2">
              Department
            </label>
            <select
              id="contributor.staffDepartment"
              name="contributor.staffDepartment"
              value={formData.contributor.staffDepartment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select department</option>
              {departments.map((department, index) => (
                <option key={index} value={department}>{department}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="contributor.mobileNo" className="block text-gray-700 text-sm font-bold mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              id="contributor.mobileNo"
              name="contributor.mobileNo"
              value={formData.contributor.mobileNo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 9876543210"
              maxLength={10}
            />
          </div>
          
          <div>
            <label htmlFor="contributor.email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="contributor.email"
              name="contributor.email"
              value={formData.contributor.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., john.doe@example.com"
            />
          </div>
        </div>
      );
    }
    else if (userType === 'Guard') {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contributor.guardName" className="block text-gray-700 text-sm font-bold mb-2">
              Guard Name
            </label>
            <input
              type="text"
              id="contributor.guardName"
              name="contributor.guardName"
              value={formData.contributor.guardName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="contributor.email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="contributor.email"
              name="contributor.email"
              value={formData.contributor.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., john.doe@example.com"
            />
          </div>
        </div>
      );
    }
    else if (userType === 'Helper') {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contributor.helperName" className="block text-gray-700 text-sm font-bold mb-2">
              Helper Name
            </label>
            <input
              type="text"
              id="contributor.helperName"
              name="contributor.helperName"
              value={formData.contributor.helperName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="contributor.email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="contributor.email"
              name="contributor.email"
              value={formData.contributor.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., john.doe@example.com"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-blue-50 border-b">
          <h1 className="text-2xl font-bold text-blue-800">Add Lost Item</h1>
          <p className="text-gray-600 mt-1">
            Fill in the details of the lost item that was submitted to the lost and found office.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-3">
              Item Image* <ContextualHelp topic="upload-photo" />
            </label>
            
            {!imagePreview ? (
              <div 
                onClick={handleImageClick}
                className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                <FaCamera className="text-gray-400 text-5xl mb-3" />
                <p className="text-gray-500 mb-2">Click to upload an image</p>
                <p className="text-gray-400 text-xs">JPG, PNG or GIF (Max 5MB)</p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Item preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Item Name* <ContextualHelp topic="add-item" />
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Blue Backpack"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                Category* <ContextualHelp topic="add-item" />
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                Found Location* <ContextualHelp topic="add-item" />
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a location</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="foundDate" className="block text-gray-700 text-sm font-bold mb-2">
                Date Found* <ContextualHelp topic="add-item" />
              </label>
              <input
                type="date"
                id="foundDate"
                name="foundDate"
                value={formData.foundDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Select the date when the item was found (cannot be a future date)
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description <ContextualHelp topic="add-item" />
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide any additional details about the item (color, brand, condition, etc.)"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Contributor Information</h3>
            <p className="text-gray-600 mb-4 flex items-center">
              Please enter details of the person who found and submitted this item.
              <ContextualHelp topic="add-item" position="right" />
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contributor Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Student', 'Staff', 'Guard', 'Helper'].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="radio"
                      id={`contributorType_${type}`}
                      name="contributor.userType"
                      value={type}
                      checked={formData.contributor.userType === type}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor={`contributorType_${type}`}>{type}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {renderContributorFields()}
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <FaCheckCircle className="mr-2" />
                  Save Item
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;