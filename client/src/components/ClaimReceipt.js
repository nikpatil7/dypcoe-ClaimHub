import React from 'react';
import { FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';

const ClaimReceipt = ({ data, onClose }) => {
  if (!data) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="mb-2 flex justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <FaCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-800">Claim Submitted!</h2>
          <p className="text-gray-600 mt-1">Your claim for this item has been recorded</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 rounded-full p-3">
              <FaEnvelope className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-center font-bold text-lg text-blue-800">Check Your Email</p>
          <p className="text-center text-gray-600 mt-3">
            We've sent verification details to your email address.
          </p>
          <p className="text-center text-gray-600 mt-2">
            The email contains important information about when and where to verify your claim.
          </p>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>If you need help or haven't received the email, please contact the security counter at A1 Building.</p>
        </div>
      </div>
    </div>
  );
};

export default ClaimReceipt; 