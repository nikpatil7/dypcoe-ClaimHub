import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaInfoCircle, FaUser, FaTimes, FaClock, FaUsers, FaSearch } from 'react-icons/fa';
import ClaimForm from '../components/ClaimForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import ClaimDetailsModal from '../components/ClaimDetailsModal';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isGuard } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showClaimDetailsModal, setShowClaimDetailsModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://lost-and-found-ruddy.vercel.app/api/items/${id}`);
        setItem(response.data.data);
        setVerification(response.data.verification);
        console.log('Item verification data:', response.data.verification);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to fetch item details');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleClaimClick = () => {
    setShowClaimForm(true);
  };

  const handleCloseForm = () => {
    setShowClaimForm(false);
  };

  const handleClaimSubmitted = () => {
    // Reload the item to get updated status
    const fetchUpdatedItem = async () => {
      try {
        const response = await axios.get(`https://lost-and-found-ruddy.vercel.app/api/items/${id}`);
        setItem(response.data.data);
        setVerification(response.data.verification);
        toast.success('Claim submitted successfully!');
      } catch (err) {
        console.error('Error fetching updated item:', err);
      }
    };

    fetchUpdatedItem();
    handleCloseForm();
  };

  const handleMarkAsDelivered = async () => {
    try {
      await axios.put(`https://lost-and-found-ruddy.vercel.app/api/items/${id}/status`, {
        status: 'delivered'
      });
      toast.success('Item marked as delivered');
      // Refresh the item data
      const response = await axios.get(`https://lost-and-found-ruddy.vercel.app/api/items/${id}`);
      setItem(response.data.data);
      setVerification(response.data.verification);
    } catch (err) {
      console.error('Error marking item as delivered:', err);
      toast.error('Failed to update item status');
    }
  };

  // Get number of claims for this item
  const getClaimsCount = () => {
    if (!item || !item.claims) return 0;
    return item.claims.length;
  };

  // Check if current user has already claimed this item
  const hasUserClaimedItem = () => {
    return false; // We don't track this currently, so always allow claiming
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!item) return <div className="text-center">Item not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div 
              className="relative cursor-pointer" 
              onClick={() => setShowImageModal(true)}
            >
              <img 
                src={`https://lost-and-found-ruddy.vercel.app${item.image}`}
                alt={item.name}
                className="w-full h-64 object-cover md:h-80"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/placeholder.png';
                }}
              />
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white">
                <FaSearch className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.name}</h1>
              
              <div className="flex items-center">
                <span className={`
                  px-3 py-1 rounded-full text-sm font-semibold
                  ${item.status === 'available' ? 'bg-green-100 text-green-800' : 
                    item.status === 'claimed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-purple-100 text-purple-800'}
                `}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  
                  {/* Show claims count for claimed items */}
                  {item.status === 'claimed' && getClaimsCount() > 0 && (
                    <span className="ml-1">
                      ({getClaimsCount()})
                    </span>
                  )}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaTag className="text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Category:</span>
                <span className="ml-2">{item.category}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Found Date:</span>
                <span className="ml-2">{formatDate(item.foundDate)}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Location:</span>
                <span className="ml-2">{item.location}</span>
              </div>
              
              {item.status === 'claimed' && (
                <div className="flex items-center mb-2">
                  <FaUsers className="text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">Claims:</span>
                  <span className="ml-2">{getClaimsCount()}</span>
                </div>
              )}
              
              {/* Show verification time for ALL items */}
              {verification && (
                <div className="flex items-center mb-2">
                  <FaClock className="text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">Verification Date & Time:</span>
                  <span className="ml-2">
                    {verification.verificationDate} at {verification.verificationTime}
                  </span>
                </div>
              )}
              
              {/* Show verification info for all items */}
              <div className="flex items-start mb-4">
                <FaInfoCircle className="text-blue-600 mr-2 mt-1" />
                <div>
                  <span className="text-gray-700 font-medium">Verification Info:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Please bring your college ID card for verification with the security guard.
                    {item.status !== 'claimed' && ' You must first claim this item to proceed with verification.'}
                  </p>
                </div>
              </div>
              
              {item.status === 'delivered' && item.deliveredTo && (
                <div className="flex items-start mb-2">
                  <FaUser className="text-blue-600 mr-2 mt-1" />
                  <div>
                    <span className="text-gray-700 font-medium">Delivered To:</span>
                    <div className="ml-2 mt-1">
                      {item.deliveredTo.userType === 'Student' && (
                        <>
                          <p className="font-medium">{item.deliveredTo.studentName}</p>
                          <div className="grid grid-cols-2 gap-x-4 text-sm text-gray-600 mt-1">
                            <p>Roll: {item.deliveredTo.rollNumber}</p>
                            <p>Year: {item.deliveredTo.studyYear}</p>
                          </div>
                        </>
                      )}
                      
                      {item.deliveredTo.userType === 'Staff' && (
                        <>
                          <p className="font-medium">{item.deliveredTo.staffName}</p>
                          <div className="grid grid-cols-2 gap-x-4 text-sm text-gray-600 mt-1">
                            <p>Department: {item.deliveredTo.staffDepartment}</p>
                            <p>Mobile: {item.deliveredTo.mobileNo}</p>
                          </div>
                        </>
                      )}
                      
                      {item.deliveredTo.userType === 'Guard' && (
                        <>
                          <p className="font-medium">{item.deliveredTo.guardName}</p>
                        </>
                      )}
                      
                      {item.deliveredTo.userType === 'Helper' && (
                        <>
                          <p className="font-medium">{item.deliveredTo.helperName}</p>
                        </>
                      )}
                      
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Type:</span> {item.deliveredTo.userType}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Email: {item.deliveredTo.email || 'Not provided'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Contact: {item.deliveredTo.contactNumber || item.deliveredTo.mobileNo || 'Not provided'}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                        Delivered on: {formatDate(item.deliveredTo.deliveryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{item.description || 'No description provided.'}</p>
            </div>
            
            {/* Always show claim button unless item is delivered */}
            {item.status !== 'delivered' && !isGuard() && (
              <button
                onClick={handleClaimClick}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {item.status === 'claimed' ? 'Submit Your Claim' : 'Claim This Item'}
              </button>
            )}
            
            {item.status === 'claimed' && !isGuard() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-center text-yellow-800">
                  This item has been claimed by {getClaimsCount()} {getClaimsCount() === 1 ? 'person' : 'people'}.
                  <br />All claimants must visit the security office on {formatDateTime(item.verificationDateTime)} for verification.
                </p>
              </div>
            )}
            
            {item.status === 'claimed' && isGuard() && (
              <button
                onClick={() => setShowClaimDetailsModal(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Manage Claims
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Claim Form Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto relative">
            <button 
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            <div className="p-6">
              <ClaimForm 
                itemId={id} 
                onClaimSubmitted={handleClaimSubmitted} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            <img 
              src={`https://lost-and-found-ruddy.vercel.app${item.image}`}
              alt={item.name}
              className="w-full h-auto max-h-[90vh] object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/placeholder.png';
              }}
            />
          </div>
        </div>
      )}

      {/* Claim Details Modal */}
      {showClaimDetailsModal && item && (
        <ClaimDetailsModal
          isOpen={showClaimDetailsModal}
          onClose={() => setShowClaimDetailsModal(false)}
          item={item}
          onSuccess={() => {
            setShowClaimDetailsModal(false);
            // Refresh item data
            const fetchItem = async () => {
              try {
                const response = await axios.get(`https://lost-and-found-ruddy.vercel.app/api/items/${id}`);
                setItem(response.data.data);
                setVerification(response.data.verification);
              } catch (err) {
                console.error('Error fetching item:', err);
              }
            };
            fetchItem();
          }}
        />
      )}
    </div>
  );
};

export default ItemDetails;