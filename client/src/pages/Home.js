import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { getRecentItems } from '../services/itemService';
import axios from 'axios';

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Colors for student logos
  const bgColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500'
  ];
  
  // Get a color based on student name (consistent for the same student)
  const getColorForStudent = (name) => {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return bgColors[sum % bgColors.length];
  };
  
  // Function to format date as DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const response = await getRecentItems(8); // Fetch 8 recent items
        setRecentItems(response.data || response); // Handle both response formats
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent items:', err);
        setError('Failed to load recent items');
        setLoading(false);
      }
    };
    
    fetchRecentItems();
  }, []);
  
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        // Fetch items with contributor information that are within the display period
        const apiUrl = 'https://lost-and-found-ruddy.vercel.app/api/items/contributors';
        const response = await axios.get(apiUrl);
        setContributors(response.data || []);
      } catch (err) {
        console.error('Error fetching contributors:', err);
      }
    };
    
    fetchContributors();
    
    // Refresh contributor list every minute
    const intervalId = setInterval(fetchContributors, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Get the name and department of a contributor based on their user type
  const getContributorInfo = (contributor) => {
    const { userType } = contributor;
    
    if (userType === 'Student') {
      return {
        name: contributor.studentName,
        department: contributor.department,
        additionalInfo: contributor.studyYear
      };
    } else if (userType === 'Staff') {
      return {
        name: contributor.staffName,
        department: contributor.staffDepartment,
        additionalInfo: 'Staff'
      };
    } else if (userType === 'Guard') {
      return {
        name: contributor.guardName,
        department: 'Security',
        additionalInfo: 'Guard'
      };
    } else if (userType === 'Helper') {
      return {
        name: contributor.helperName,
        department: '',
        additionalInfo: 'Helper'
      };
    }
    
    // Default fallback
    return {
      name: contributor.studentName || contributor.staffName || contributor.guardName || contributor.helperName || 'Unknown',
      department: contributor.department || contributor.staffDepartment || '',
      additionalInfo: ''
    };
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Lost Something?
              </h1>
              <p className="mt-6 text-xl max-w-3xl">
                The DYPCOE College Lost & Found portal helps students,staff find their lost belongings. 
                Browse through items that have been found on campus and claim what's yours.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/lost-items"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50"
                >
                  Browse Lost Items
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/dyp_pic.jpg"
                alt="Lost and Found"
                className="h-96"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-secondary-500 mx-auto">
              Reuniting students with their lost belongings in a few simple steps.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="relative p-6 bg-white rounded-lg border border-secondary-200 shadow-sm">
                <div className="absolute -top-4 -left-4 bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mt-2">Find Item</h3>
                <p className="mt-2 text-base text-secondary-500">
                  Lost items found on campus are submitted to the security office by students or staff.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-secondary-200 shadow-sm">
                <div className="absolute -top-4 -left-4 bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mt-2">Submit Info</h3>
                <p className="mt-2 text-base text-secondary-500">
                  Security personnel log the item with details and photos in our system.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-secondary-200 shadow-sm">
                <div className="absolute -top-4 -left-4 bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mt-2">Claim & Collect</h3>
                <p className="mt-2 text-base text-secondary-500">
                  Students can browse, identify their belongings, claim online, and collect items from security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Items Section */}
      <section className="py-12 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              Recently Found Items
            </h2>
            <Link
              to="/lost-items"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Items →
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  getRecentItems(8)
                    .then(data => {
                      setRecentItems(data.data || data);
                      setLoading(false);
                    })
                    .catch(err => {
                      console.error('Error retrying:', err);
                      setError('Failed to load recent items');
                      setLoading(false);
                    });
                }}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentItems.length > 0 ? (
                recentItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-secondary-500">No items have been found recently.</p>
                  <p className="mt-2 text-sm text-secondary-400">Check back later or contact the lost and found office.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Contributors Showcase Section */}
      <section className="bg-primary-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Star Contributors
            </h2>
            <p className="mt-2 text-primary-200">
              Honoring people who found and returned lost items
            </p>
          </div>
          
          {contributors.length > 0 ? (
            <div className="relative contributor-carousel">
              <div className="flex animate-scroll space-x-8 pb-4">
                {contributors.map((item, index) => (
                  <div 
                    key={`${item._id}-${index}`} 
                    className="flex-shrink-0 w-64 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${getColorForStudent(getContributorInfo(item.contributor).name)} rounded-full flex items-center justify-center text-xl font-bold`}>
                        {getContributorInfo(item.contributor).name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold">{getContributorInfo(item.contributor).name}</h3>
                        <p className="text-primary-200 text-sm">{getContributorInfo(item.contributor).department}</p>
                        <p className="text-primary-200 text-sm">{getContributorInfo(item.contributor).additionalInfo}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                      <p className="text-sm">Found: <span className="font-medium">{item.name}</span></p>
                      <p className="text-xs text-primary-200">on {formatDate(item.foundDate)}</p>
                    </div>
                  </div>
                ))}
                
                {/* Duplicate cards for continuous scroll */}
                {contributors.length > 0 && contributors.map((item, index) => (
                  <div 
                    key={`${item._id}-duplicate-${index}`} 
                    className="flex-shrink-0 w-64 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${getColorForStudent(getContributorInfo(item.contributor).name)} rounded-full flex items-center justify-center text-xl font-bold`}>
                        {getContributorInfo(item.contributor).name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold">{getContributorInfo(item.contributor).name}</h3>
                        <p className="text-primary-200 text-sm">{getContributorInfo(item.contributor).department}</p>
                        <p className="text-primary-200 text-sm">{getContributorInfo(item.contributor).additionalInfo}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                      <p className="text-sm">Found Item: <span className="font-medium">{item.name}</span></p>
                      <p className="text-xs text-primary-200">on {formatDate(item.foundDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No contributors to showcase yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;