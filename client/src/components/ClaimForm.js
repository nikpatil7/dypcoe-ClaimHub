import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { claimItem } from '../services/itemService';
import ClaimReceipt from './ClaimReceipt';
import ContextualHelp from './ContextualHelp';

const ClaimForm = ({ itemId, onClaimSubmitted }) => {
  const [userType, setUserType] = useState('Student');
  const [formData, setFormData] = useState({
    // Student fields
    studentName: '',
    studentId: '',
    studentYear: '',
    // Staff fields
    staffName: '',
    staffDepartment: '',
    mobileNo: '',
    // Guard and Helper fields
    guardName: '',
    helperName: '',
    // Common fields
    contactNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Departments list
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

  // Study years
  const studyYears = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ];

  // Handle user type change
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    // Clear errors when user type changes
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any previous error for this field
    setErrors({
      ...errors,
      [name]: ''
    });
    
    // For studentId (roll number) - allow only digits and limit to 5 characters
    if (name === 'studentId') {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        setErrors({
          ...errors,
          studentId: 'Roll number must contain only digits'
        });
        return;
      }
      // Limit to max 5 digits
      if (value.length > 5) {
        return;
      }
    }
    
    // For contactNumber and mobileNo - allow only digits and limit to 10 characters
    if (name === 'contactNumber' || name === 'mobileNo') {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Contact number must contain only digits'
        });
        return;
      }
      // Limit to max 10 digits
      if (value.length > 10) {
        return;
      }
    }
    
    // For email - validate email format
    if (name === 'email' && value.trim() !== '') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          email: 'Please enter a valid email address'
        });
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate based on user type
    if (userType === 'Student') {
      // Validate all required fields for student
      if (!formData.studentName.trim()) {
        newErrors.studentName = 'Name is required';
      }
      
      // Validate student ID / roll number
      if (!formData.studentId.trim()) {
        newErrors.studentId = 'Roll number is required';
      } else if (!/^\d{5}$/.test(formData.studentId)) {
        newErrors.studentId = 'Roll number must be exactly 5 digits';
      }
      
      // Validate student year
      if (!formData.studentYear) {
        newErrors.studentYear = 'Study year is required';
      }
      
      // Validate contact number
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      } else if (!/^\d{10}$/.test(formData.contactNumber)) {
        newErrors.contactNumber = 'Contact number must be exactly 10 digits';
      }
    } 
    else if (userType === 'Staff') {
      // Validate staff fields
      if (!formData.staffName.trim()) {
        newErrors.staffName = 'Name is required';
      }
      
      if (!formData.staffDepartment) {
        newErrors.staffDepartment = 'Department is required';
      }
      
      if (!formData.mobileNo.trim()) {
        newErrors.mobileNo = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.mobileNo)) {
        newErrors.mobileNo = 'Mobile number must be exactly 10 digits';
      }
    }
    else if (userType === 'Guard') {
      if (!formData.guardName.trim()) {
        newErrors.guardName = 'Name is required';
      }
    }
    else if (userType === 'Helper') {
      if (!formData.helperName.trim()) {
        newErrors.helperName = 'Name is required';
      }
    }
    
    // Validate email for all user types
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      // Show error toast for the first error
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Build claim data object based on user type
      let claimData = {
        userType: userType,
        email: formData.email
      };
      
      // Add fields based on user type
      if (userType === 'Student') {
        claimData = {
          ...claimData,
          studentName: formData.studentName,
          studentId: formData.studentId,      // This gets mapped to rollNumber in the backend
          studentYear: formData.studentYear,  // This gets mapped to studyYear in the backend
          contactNumber: formData.contactNumber
        };
      } 
      else if (userType === 'Staff') {
        claimData = {
          ...claimData,
          staffName: formData.staffName,
          staffDepartment: formData.staffDepartment,
          mobileNo: formData.mobileNo
        };
      }
      else if (userType === 'Guard') {
        claimData = {
          ...claimData,
          guardName: formData.guardName
        };
      }
      else if (userType === 'Helper') {
        claimData = {
          ...claimData,
          helperName: formData.helperName
        };
      }
      
      console.log('Submitting claim data:', claimData);
      
      // Use the API to claim the item
      const response = await claimItem(itemId, claimData);
      console.log('Claim response:', response);
      
      // Store receipt data and show the receipt
      setReceiptData(response.claim);
      setShowReceipt(true);
      
      // Reset form
      setFormData({
        studentName: '',
        studentId: '',
        studentYear: '',
        staffName: '',
        staffDepartment: '',
        mobileNo: '',
        guardName: '',
        helperName: '',
        contactNumber: '',
        email: ''
      });
      
      // Don't notify parent component yet - will do that after user closes receipt
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error(error.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseReceipt = () => {
    setShowReceipt(false);
    
    // Now notify parent component that claim is complete
    if (onClaimSubmitted) {
      onClaimSubmitted();
    }
  };

  // Render form fields based on user type
  const renderFormFields = () => {
    if (userType === 'Student') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentName">
              Full Name *
            </label>
            <input
              className={`shadow appearance-none border ${errors.studentName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="studentName"
              name="studentName"
              type="text"
              placeholder="Your full name"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
            {errors.studentName && (
              <p className="text-red-500 text-xs italic mt-1">{errors.studentName}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
              Student ID / Roll Number * (5 digits)
            </label>
            <input
              className={`shadow appearance-none border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="studentId"
              name="studentId"
              type="text"
              placeholder="5-digit roll number"
              value={formData.studentId}
              onChange={handleChange}
              maxLength={5}
              required
            />
            {errors.studentId && (
              <p className="text-red-500 text-xs italic mt-1">{errors.studentId}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentYear">
              Study Year *
            </label>
            <select
              className={`shadow appearance-none border ${errors.studentYear ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="studentYear"
              name="studentYear"
              value={formData.studentYear}
              onChange={handleChange}
              required
            >
              <option value="">Select your year</option>
              {studyYears.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            {errors.studentYear && (
              <p className="text-red-500 text-xs italic mt-1">{errors.studentYear}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
              Contact Number * (10 digits)
            </label>
            <input
              className={`shadow appearance-none border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="contactNumber"
              name="contactNumber"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.contactNumber}
              onChange={handleChange}
              maxLength={10}
              required
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs italic mt-1">{errors.contactNumber}</p>
            )}
          </div>
        </>
      );
    } else if (userType === 'Staff') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="staffName">
              Full Name *
            </label>
            <input
              className={`shadow appearance-none border ${errors.staffName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="staffName"
              name="staffName"
              type="text"
              placeholder="Your full name"
              value={formData.staffName}
              onChange={handleChange}
              required
            />
            {errors.staffName && (
              <p className="text-red-500 text-xs italic mt-1">{errors.staffName}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="staffDepartment">
              Department *
            </label>
            <select
              className={`shadow appearance-none border ${errors.staffDepartment ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="staffDepartment"
              name="staffDepartment"
              value={formData.staffDepartment}
              onChange={handleChange}
              required
            >
              <option value="">Select department</option>
              {departments.map((department, index) => (
                <option key={index} value={department}>{department}</option>
              ))}
            </select>
            {errors.staffDepartment && (
              <p className="text-red-500 text-xs italic mt-1">{errors.staffDepartment}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
              Mobile Number * (10 digits)
            </label>
            <input
              className={`shadow appearance-none border ${errors.mobileNo ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="mobileNo"
              name="mobileNo"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobileNo}
              onChange={handleChange}
              maxLength={10}
              required
            />
            {errors.mobileNo && (
              <p className="text-red-500 text-xs italic mt-1">{errors.mobileNo}</p>
            )}
          </div>
        </>
      );
    } else if (userType === 'Guard') {
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardName">
            Full Name *
          </label>
          <input
            className={`shadow appearance-none border ${errors.guardName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="guardName"
            name="guardName"
            type="text"
            placeholder="Your full name"
            value={formData.guardName}
            onChange={handleChange}
            required
          />
          {errors.guardName && (
            <p className="text-red-500 text-xs italic mt-1">{errors.guardName}</p>
          )}
        </div>
      );
    } else if (userType === 'Helper') {
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="helperName">
            Full Name *
          </label>
          <input
            className={`shadow appearance-none border ${errors.helperName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="helperName"
            name="helperName"
            type="text"
            placeholder="Your full name"
            value={formData.helperName}
            onChange={handleChange}
            required
          />
          {errors.helperName && (
            <p className="text-red-500 text-xs italic mt-1">{errors.helperName}</p>
          )}
        </div>
      );
    }
  };

  return (
    <>
      {showReceipt ? (
        <ClaimReceipt data={receiptData} onClose={handleCloseReceipt} />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Claim This Item</h2>
          <p className="mb-4 text-gray-600 flex items-center">
            Please fill out this form to claim the item. Verification details will be sent to your email address.
            <ContextualHelp topic="verify-claim" position="right" />
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                I am a: *
                <ContextualHelp topic="verify-claim" position="right" />
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Student', 'Staff', 'Guard', 'Helper'].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="radio"
                      id={`userType_${type}`}
                      name="userType"
                      value={type}
                      checked={userType === type}
                      onChange={handleUserTypeChange}
                      className="mr-2"
                    />
                    <label htmlFor={`userType_${type}`}>{type}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {renderFormFields()}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="email">
                Email Address *
                <ContextualHelp topic="verification-time" position="right" />
              </label>
              <input
                className={`shadow appearance-none border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Verification details and instructions will be sent to this email
              </p>
              {errors.email && (
                <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ClaimForm;