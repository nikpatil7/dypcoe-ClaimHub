import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { AuthContext } from '../context/AuthContext';
import { getAllItems, deleteItem } from '../services/itemService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import EditItemModal from '../components/EditItemModal';
import EditClaimedItemModal from '../components/EditClaimedItemModal';
import ClaimDetailsModal from '../components/ClaimDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import SearchBar from '../components/SearchBar';
import ContextualHelp from '../components/ContextualHelp';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const GuardDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClaimedModalOpen, setEditClaimedModalOpen] = useState(false);
  const [claimDetailsModalOpen, setClaimDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getAllItems(true);
      
      // Log a sample of the data to verify claims
      if (data && data.length > 0) {
        console.log('Sample item:', data[0]);
        console.log('Item claims:', data[0].claims);
      }
      
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items');
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.category && item.category.toLowerCase().includes(searchLower))
    );
  });

  // Handle opening edit modal
  const handleEditClick = (e, item) => {
    e.stopPropagation(); // Prevent row click event
    // Only allow editing available items
    if (item.status !== 'available') {
      setSuccessMessage('Only available items can be edited');
      setSuccessModalOpen(true);
      return;
    }
    
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  // Handle opening edit claimed item modal
  const handleEditClaimedClick = (e, item) => {
    e.stopPropagation(); // Prevent row click event
    if (item.status !== 'claimed') {
      setSuccessMessage('Only claimed items can be edited');
      setSuccessModalOpen(true);
      return;
    }
    
    setSelectedItem(item);
    setEditClaimedModalOpen(true);
  };
  
  // Handle opening claims details modal
  const handleViewClaimsClick = (item) => {
    setSelectedItem(item);
    setClaimDetailsModalOpen(true);
  };
  
  // Handle row click
  const handleRowClick = (item) => {
    navigate(`/lost-items/${item._id}`);
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (e, item) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  // Handle successful item edit
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSuccessMessage('Item updated successfully!');
    setSuccessModalOpen(true);
    
    // Refresh the items list
    fetchItems();
  };

  // Handle successful claimed item edit
  const handleEditClaimedSuccess = () => {
    setEditClaimedModalOpen(false);
    setSuccessMessage('Item details updated successfully!');
    setSuccessModalOpen(true);
    
    // Refresh the items list
    fetchItems();
  };
  
  // Handle successful delivery
  const handleDeliverySuccess = () => {
    setClaimDetailsModalOpen(false);
    setSuccessMessage('Item has been marked as delivered successfully!');
    setSuccessModalOpen(true);
    
    // Refresh the items list
    fetchItems();
  };

  // Handle item deletion
  const handleDeleteConfirm = async () => {
    try {
      await deleteItem(selectedItem._id);
      setItems(items.filter(item => item._id !== selectedItem._id));
      setSuccessMessage('Item deleted successfully!');
      setSuccessModalOpen(true);
    } catch (err) {
      setError('Failed to delete item');
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
  
  // Get claim count for an item
  const getClaimsCount = (item) => {
    return item.claims?.length || 0;
  };

  // Add a function to check if verification time is today or tomorrow
  const isUpcomingVerification = (verificationDateTime) => {
    if (!verificationDateTime) return false;
    
    const now = new Date();
    const verification = new Date(verificationDateTime);
    
    // Set time to midnight for date comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const verificationDate = new Date(verification.getFullYear(), verification.getMonth(), verification.getDate());
    
    // Calculate difference in days
    const diffTime = verificationDate - nowDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Return true if verification is today or tomorrow
    return diffDays >= 0 && diffDays <= 1;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Guard Dashboard</h1>
            <p className="text-gray-600">Manage lost and found items</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link 
              to="/add-item" 
              className="add-item-button bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Item
              <ContextualHelp topic="add-item" position="bottom" className="ml-2" />
            </Link>
          </div>
        </div>
        
        <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              Available Items
              <ContextualHelp topic="item-status" position="right" />
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {items.filter(item => item.status === 'available').length}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              Claimed Items
              <ContextualHelp topic="item-status" position="right" />
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {items.filter(item => item.status === 'claimed').length}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              Delivered Items
              <ContextualHelp topic="item-status" position="right" />
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {items.filter(item => item.status === 'delivered').length}
            </p>
          </div>
        </div>
        
        <div className="search-filter-section mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-full">
              <SearchBar onSearch={handleSearch} />
              <ContextualHelp topic="search-items" position="right" />
            </div>
          </div>
        </div>
        
        {/* Tab interface for item management */}
        <div>
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                  )
                }
              >
                Available Items
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                  )
                }
              >
                Claimed Items
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                  {items.filter(item => item.status === 'claimed').length}
                </span>
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                  )
                }
              >
                Delivered Items
              </Tab>
            </Tab.List>
            
            <Tab.Panels className="mt-2">
              {/* Available Items Panel */}
              <Tab.Panel>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left">Image</th>
                        <th className="py-3 px-4 text-left">Item Name</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Found Date</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                          <tr 
                            key={item._id} 
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(item)}
                          >
                            <td className="py-3 px-4">
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="h-16 w-16 object-cover rounded"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/assets/images/placeholder.png';
                                }}
                              />
                            </td>
                            <td className="py-3 px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-4">{item.category}</td>
                            <td className="py-3 px-4">{formatDate(item.foundDate)}</td>
                            <td className="py-3 px-4">
                              <span className={`
                                px-2 py-1 text-xs rounded-full
                                ${item.status === 'available' ? 'bg-green-100 text-green-800' : 
                                  item.status === 'claimed' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-purple-100 text-purple-800'}
                              `}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                
                                {/* Show claims count for claimed items */}
                                {item.status === 'claimed' && getClaimsCount(item) > 0 && (
                                  <span className="ml-1">
                                    ({getClaimsCount(item)})
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                                {item.status === 'available' ? (
                                  <button 
                                    onClick={(e) => handleEditClick(e, item)} 
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit item"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                ) : item.status === 'claimed' ? (
                                  <>
                                    <button 
                                      onClick={(e) => handleEditClaimedClick(e, item)} 
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Edit item details"
                                    >
                                      <PencilIcon className="h-5 w-5" />
                                    </button>
                                  </>
                                ) : null}
                                
                                {item.status !== 'delivered' && (
                                  <button 
                                    onClick={(e) => handleDeleteClick(e, item)} 
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete item"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-gray-500">
                            No items found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
              
              {/* Claimed Items Panel */}
              <Tab.Panel>
                <div className="overflow-x-auto">
                  <div className="mb-4 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-blue-800">
                      <span className="font-medium">Note:</span> Items are sorted by verification time, with the earliest time at the top.
                    </p>
                  </div>
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left">Image</th>
                        <th className="py-3 px-4 text-left">Item Name</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Found Date</th>
                        <th className="py-3 px-4 text-left">Claims</th>
                        <th className="py-3 px-4 text-left">Verification Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.filter(item => item.status === 'claimed').length > 0 ? (
                        filteredItems
                          .filter(item => item.status === 'claimed')
                          .sort((a, b) => {
                            // Sort by verification time (ascending) - earliest first
                            const dateA = new Date(a.verificationDateTime);
                            const dateB = new Date(b.verificationDateTime);
                            return dateA - dateB;
                          })
                          .map(item => (
                            <tr 
                              key={item._id} 
                              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleViewClaimsClick(item)}
                            >
                              <td className="py-3 px-4">
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="h-16 w-16 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/images/placeholder.png';
                                  }}
                                />
                              </td>
                              <td className="py-3 px-4 font-medium">{item.name}</td>
                              <td className="py-3 px-4">{item.category}</td>
                              <td className="py-3 px-4">{formatDate(item.foundDate)}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {getClaimsCount(item)} {getClaimsCount(item) === 1 ? 'claim' : 'claims'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {formatDateTime(item.verificationDateTime)}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-gray-500">
                            No claimed items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
              
              {/* Delivered Items Panel */}
              <Tab.Panel>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left">Image</th>
                        <th className="py-3 px-4 text-left">Item Name</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Delivered To</th>
                        <th className="py-3 px-4 text-left">Delivery Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.filter(item => item.status === 'delivered').length > 0 ? (
                        filteredItems
                          .filter(item => item.status === 'delivered')
                          .map(item => (
                            <tr 
                              key={item._id} 
                              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                              onClick={() => navigate(`/lost-items/${item._id}`)}
                            >
                              <td className="py-3 px-4">
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="h-16 w-16 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/images/placeholder.png';
                                  }}
                                />
                              </td>
                              <td className="py-3 px-4 font-medium">{item.name}</td>
                              <td className="py-3 px-4">{item.category}</td>
                              <td className="py-3 px-4">
                                {item.deliveredTo ? (
                                  <span className="font-medium">
                                    {item.deliveredTo.studentName || 
                                     item.deliveredTo.staffName || 
                                     item.deliveredTo.guardName || 
                                     item.deliveredTo.helperName || 
                                     item.claimedBy?.studentName || 
                                     item.claimedBy?.staffName || 
                                     "Unknown Claimant"}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Information not available</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {formatDate(item.deliveredTo?.deliveryDate)}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500">
                            No delivered items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      
      {/* Edit modal */}
      {selectedItem && editModalOpen && (
        <EditItemModal 
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          item={selectedItem}
          onSuccess={handleEditSuccess}
        />
      )}
      
      {/* Edit claimed item modal */}
      {selectedItem && editClaimedModalOpen && (
        <EditClaimedItemModal 
          isOpen={editClaimedModalOpen}
          onClose={() => setEditClaimedModalOpen(false)}
          item={selectedItem}
          onSuccess={handleEditClaimedSuccess}
        />
      )}
      
      {/* Claim details modal */}
      {selectedItem && claimDetailsModalOpen && (
        <ClaimDetailsModal 
          isOpen={claimDetailsModalOpen}
          onClose={() => setClaimDetailsModalOpen(false)}
          item={selectedItem}
          onSuccess={handleDeliverySuccess}
        />
      )}
      
      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
      {/* Success message modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
};

export default GuardDashboard;
