import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaCheck, FaUser, FaTimes, FaUserTie, FaUserShield, FaUserCog } from 'react-icons/fa';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import { deliverItem } from '../services/itemService';
import { toast } from 'react-toastify';

const ClaimDetailsModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [selectedClaimIndex, setSelectedClaimIndex] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!item) return null;
  
  const handleDeliverToClaimant = async () => {
    if (selectedClaimIndex === null) {
      toast.error('Please select a claimant first');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const selectedClaim = item.claims[selectedClaimIndex];
      await deliverItem(item._id, selectedClaimIndex);
      
      toast.success('Item marked as delivered successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to deliver item');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const claimsCount = item.claims?.length || 0;
  
  // Get the appropriate icon for the user type
  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'Staff':
        return <FaUserTie className="h-8 w-8 text-blue-500" />;
      case 'Guard':
        return <FaUserShield className="h-8 w-8 text-green-500" />;
      case 'Helper':
        return <FaUserCog className="h-8 w-8 text-purple-500" />;
      case 'Student':
      default:
        return <FaUser className="h-8 w-8 text-gray-500" />;
    }
  };
  
  // Render claim details based on user type
  const renderClaimDetails = (claim) => {
    const userType = claim.userType || 'Student';
    
    if (userType === 'Student') {
      return (
        <>
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold flex items-center">
                {claim.studentName}
                {selectedClaimIndex === item.claims.indexOf(claim) && (
                  <FaCheck className="h-5 w-5 text-blue-600 ml-2" />
                )}
              </h4>
              <p className="text-sm text-gray-600">Roll Number: {claim.rollNumber}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold">Type:</span> Student</p>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Claimed on</p>
              <p className="text-sm">{formatDate(claim.claimedDate)}</p>
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-x-4">
            <div>
              <p className="text-xs text-gray-500">Year</p>
              <p className="text-sm">{claim.studyYear}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="text-sm">{claim.contactNumber}</p>
            </div>
          </div>
        </>
      );
    } 
    else if (userType === 'Staff') {
      return (
        <>
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold flex items-center">
                {claim.staffName}
                {selectedClaimIndex === item.claims.indexOf(claim) && (
                  <FaCheck className="h-5 w-5 text-blue-600 ml-2" />
                )}
              </h4>
              <p className="text-sm text-gray-600">Department: {claim.staffDepartment}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold">Type:</span> Staff</p>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Claimed on</p>
              <p className="text-sm">{formatDate(claim.claimedDate)}</p>
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-x-4">
            <div>
              <p className="text-xs text-gray-500">Mobile</p>
              <p className="text-sm">{claim.mobileNo}</p>
            </div>
          </div>
        </>
      );
    }
    else if (userType === 'Guard') {
      return (
        <>
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold flex items-center">
                {claim.guardName}
                {selectedClaimIndex === item.claims.indexOf(claim) && (
                  <FaCheck className="h-5 w-5 text-blue-600 ml-2" />
                )}
              </h4>
              <p className="text-sm text-gray-600"><span className="font-semibold">Type:</span> Guard</p>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Claimed on</p>
              <p className="text-sm">{formatDate(claim.claimedDate)}</p>
            </div>
          </div>
        </>
      );
    }
    else if (userType === 'Helper') {
      return (
        <>
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold flex items-center">
                {claim.helperName}
                {selectedClaimIndex === item.claims.indexOf(claim) && (
                  <FaCheck className="h-5 w-5 text-blue-600 ml-2" />
                )}
              </h4>
              <p className="text-sm text-gray-600"><span className="font-semibold">Type:</span> Helper</p>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Claimed on</p>
              <p className="text-sm">{formatDate(claim.claimedDate)}</p>
            </div>
          </div>
        </>
      );
    }
  };
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-4xl w-full shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              Claim Details: {item.name}
            </Dialog.Title>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row mb-6 gap-6">
              <div className="md:w-1/3">
                <img
                  src={`https://lost-and-found-ruddy.vercel.app${item.image}`}
                  alt={item.name}
                  className="w-full h-auto rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/placeholder.png';
                  }}
                />
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Found Date</p>
                    <p className="font-medium">{formatDate(item.foundDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{item.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{item.status}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p>{item.description || 'No description provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Verification Information</h3>
                <p className="text-blue-800">
                  <span className="font-medium">Verification Date & Time:</span> {formatDateTime(item.verificationDateTime)}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Claimants must verify their identity and claim at this time.
                </p>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Claims ({claimsCount})</h3>
                
                {claimsCount > 0 && (
                  <p className="text-sm text-gray-600">
                    Select the person who is the rightful owner
                  </p>
                )}
              </div>
              
              {claimsCount > 0 ? (
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {item.claims.map((claim, index) => (
                    <div
                      key={claim.uniqueClaimId}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition
                        ${selectedClaimIndex === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50 border-gray-200'
                        }
                      `}
                      onClick={() => setSelectedClaimIndex(index)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getUserTypeIcon(claim.userType)}
                        </div>
                        
                        <div className="flex-grow">
                          {renderClaimDetails(claim)}
                          
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm">{claim.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                  No claims have been made for this item yet
                </div>
              )}
              
              {claimsCount > 0 && (
                <div className="flex justify-end mt-6">
                  <button
                    className={`
                      px-4 py-2 rounded-lg font-medium
                      ${selectedClaimIndex !== null
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                    onClick={handleDeliverToClaimant}
                    disabled={selectedClaimIndex === null || isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Mark as Delivered'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ClaimDetailsModal; 