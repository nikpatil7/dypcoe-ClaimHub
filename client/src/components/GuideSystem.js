import React, { useState, useEffect, useContext } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { Tooltip } from 'react-tooltip';
import { AuthContext } from '../context/AuthContext';
import { FaQuestionCircle, FaTimes, FaArrowRight, FaPlayCircle, FaLightbulb, FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const GuideSystem = () => {
  const { user } = useContext(AuthContext);
  const [runTour, setRunTour] = useState(false);
  const [showHelpButtons, setShowHelpButtons] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpTopic, setHelpTopic] = useState(null);
  const location = useLocation();
  
  // Only show help button on GuardDashboard page
  const isDashboardPage = location.pathname === '/GuardDashboard' || 
                          location.pathname === '/dashboard';
  
  // Check if this is the first login
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('guard_has_seen_guide');
    
    if (user && user.role === 'guard' && !hasSeenGuide) {
      // Show welcome popup after a slight delay
      setTimeout(() => {
        setHelpOpen(true);
        setHelpTopic('welcome');
      }, 1000);
    }
  }, [user]);
  
  // Define guided tour steps with enhanced styling and content
  const steps = [
    {
      target: 'body',
      content: (
        <div className="tour-step">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Welcome to the Lost & Found System!</h3>
          <p className="text-gray-700">This quick tour will guide you through the main features to help you manage lost items effectively.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        }
      }
    },
    {
      target: '.dashboard-stats',
      content: (
        <div className="tour-step">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Dashboard Overview</h3>
          <p className="text-gray-700">This dashboard provides a quick summary of all items in the system and their status.</p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>Available items are ready to be claimed</li>
            <li>Claimed items are awaiting verification</li>
            <li>Delivered items have been returned to their owners</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
      styles: {
        options: {
          width: 400,
        }
      }
    },
    {
      target: '.add-item-button',
      content: (
        <div className="tour-step">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Adding Items</h3>
          <p className="text-gray-700">When someone turns in a lost item, click here to add it to the system. Remember to take a clear photo and fill in all details accurately.</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
      styles: {
        options: {
          width: 350,
        }
      }
    },
    {
      target: '.search-filter-section',
      content: (
        <div className="tour-step">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Search & Filter</h3>
          <p className="text-gray-700">Use the search bar to quickly find specific items by name, category, or description.</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
      styles: {
        options: {
          width: 350,
        }
      }
    },
    {
      target: 'body',
      content: (
        <div className="tour-step">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Important Reminders</h3>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-3">
            <p className="text-yellow-800 font-medium">Claims automatically expire after 24 hours if not verified.</p>
          </div>
          <p className="text-gray-700">You can always access the help center by clicking the question mark button at the bottom right of the screen.</p>
          <p className="text-gray-700 mt-2 font-medium">Thank you for helping our community recover lost items!</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        }
      }
    },
  ];
  
  // Handle tour callback
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Save that the guard has seen the guide
      localStorage.setItem('guard_has_seen_guide', 'true');
      setRunTour(false);
    }
  };
  
  // Define help topics with improved formatting and content
  const helpTopics = {
    welcome: {
      title: "Welcome to the Lost & Found System",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
            <div className="flex items-center mb-3">
              <FaLightbulb className="text-blue-500 text-xl mr-2" />
              <h3 className="text-lg font-bold text-blue-800">Getting Started Guide</h3>
            </div>
            <p className="text-blue-800 mb-2">Hello! As a security guard, you play a vital role in helping people recover their lost items.</p>
            <p className="text-blue-800">This system makes it easy to manage the entire lost and found process from start to finish.</p>
          </div>
          
          <p className="text-gray-700">Would you like to take a quick tour of the system?</p>
          
          <div className="flex justify-between mt-6">
            <button 
              onClick={() => {
                setHelpOpen(false);
                setRunTour(true);
                localStorage.setItem('guard_has_seen_guide', 'true');
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-all shadow-sm"
            >
              <FaPlayCircle className="mr-2" /> Start Tour
            </button>
            <button 
              onClick={() => {
                setHelpOpen(false);
                localStorage.setItem('guard_has_seen_guide', 'true');
              }}
              className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50 transition-all text-gray-700"
            >
              Skip for Now
            </button>
          </div>
        </div>
      )
    },
    addItem: {
      title: "Adding a New Item",
      content: (
        <>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-blue-800 font-medium">Adding items quickly and accurately helps students find their belongings!</p>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Take a clear photo</p>
                <p className="text-gray-600 text-sm">Ensure good lighting and show the entire item</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Fill in all details accurately</p>
                <p className="text-gray-600 text-sm">Name, category, location found, etc.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Add contributor info</p>
                <p className="text-gray-600 text-sm">If someone turned in the item, record their details</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Submit the form</p>
                <p className="text-gray-600 text-sm">The item will be available for claims immediately</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm"><span className="font-medium">Pro tip:</span> Be specific with item names and descriptions to help owners find their items.</p>
          </div>
        </>
      )
    },
    verifyingClaims: {
      title: "Verifying Claims",
      content: (
        <>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-blue-800 font-medium">Proper verification ensures items are returned to their rightful owners.</p>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Check for pending claims</p>
                <p className="text-gray-600 text-sm">Review the Claimed Items tab regularly</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Verify claimant's identity</p>
                <p className="text-gray-600 text-sm">Check their college ID card</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Ask verification questions</p>
                <p className="text-gray-600 text-sm">Ask for specific details about the item that only the owner would know</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <span className="flex items-center justify-center text-blue-700 font-bold text-xs h-5 w-5">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Deliver or deny</p>
                <p className="text-gray-600 text-sm">Mark as delivered if verified, or leave pending if unsure</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm font-medium">Important: Claims expire after 24 hours automatically!</p>
          </div>
        </>
      )
    },
    expiringClaims: {
      title: "Claim Expiration System",
      content: (
        <>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-blue-800 font-medium">The automatic expiration system helps keep the database current.</p>
          </div>
          
          <p className="font-medium text-gray-800 mb-2">When claims expire:</p>
          
          <div className="bg-white rounded-lg border border-gray-200 mb-4">
            <div className="border-b border-gray-200 p-3">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <p className="text-gray-700">All claims are removed from the item</p>
              </div>
            </div>
            <div className="border-b border-gray-200 p-3">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <p className="text-gray-700">Item returns to "available" status</p>
              </div>
            </div>
            <div className="border-b border-gray-200 p-3">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <p className="text-gray-700">Claimants receive automatic email notifications</p>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <p className="text-gray-700">A new verification time is set for the next 24 hours</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">This happens automatically every 24 hours after an item is first uploaded.</p>
          </div>
        </>
      )
    },
    searchFilter: {
      title: "Finding Items Quickly",
      content: (
        <>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-blue-800 font-medium">Efficient searching helps find items faster and reunite them with owners.</p>
          </div>
          
          <p className="font-medium text-gray-800 mb-2">Search for items by:</p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white p-2 rounded border border-gray-200 text-gray-700 text-sm">Item name</div>
            <div className="bg-white p-2 rounded border border-gray-200 text-gray-700 text-sm">Category</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm"><span className="font-medium">Pro tip:</span> Use filtered tabs to browse items by their current status (Available/Claimed/Delivered).</p>
          </div>
        </>
      )
    },
  };
  
  // Floating help button with enhanced styling
  const HelpButton = () => (
    <div className="fixed bottom-6 right-6 z-50">
      {!helpOpen ? (
        <button 
          onClick={() => setHelpOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          data-tooltip-id="help-tooltip"
          data-tooltip-content="Need help? Click here!"
        >
          <FaQuestionCircle className="text-2xl" />
        </button>
      ) : (
        <button 
          onClick={() => setHelpOpen(false)}
          className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300"
        >
          <FaTimes className="text-2xl" />
        </button>
      )}
      <Tooltip id="help-tooltip" />
    </div>
  );
  
  // Help popup with enhanced styling
  const HelpPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        <div className="flex justify-between items-center border-b p-5">
          <h2 className="text-xl font-bold text-gray-800">
            {helpTopic ? helpTopics[helpTopic].title : "Help Center"}
          </h2>
          <button 
            onClick={() => {
              setHelpOpen(false);
              setHelpTopic(null);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {helpTopic ? (
            // Show specific help topic
            <div>
              {helpTopics[helpTopic].content}
              
              <div className="mt-8 flex justify-between">
                <button 
                  onClick={() => setHelpTopic(null)}
                  className="text-blue-600 flex items-center hover:text-blue-800 transition-colors"
                >
                  Back to Help Menu
                </button>
                <button 
                  onClick={() => setHelpOpen(false)}
                  className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            // Show help topics menu with enhanced styling
            <div>
              <p className="mb-5 text-gray-600">What would you like help with today?</p>
              
              <div className="space-y-3">
                {Object.keys(helpTopics).filter(topic => topic !== 'welcome').map((topic) => (
                  <button 
                    key={topic}
                    onClick={() => setHelpTopic(topic)}
                    className="w-full text-left p-4 border rounded-lg flex justify-between items-center hover:bg-blue-50 hover:border-blue-200 transition-all"
                  >
                    <span className="font-medium text-gray-700">{helpTopics[topic].title}</span>
                    <FaArrowRight className="text-blue-500" />
                  </button>
                ))}
              </div>
              
              <div className="mt-8 border-t pt-5">
                <button 
                  onClick={() => {
                    setHelpOpen(false);
                    setRunTour(true);
                  }}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <FaPlayCircle className="mr-2" /> Take System Tour
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Only render for guard users
  if (!user || user.role !== 'guard') {
    return null;
  }
  
  return (
    <>
      {/* Guided tour with enhanced styling */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        disableOverlayClose
        hideBackButton={false}
        spotlightClicks
        disableOverlay={false}
        disableScrolling={false}
        locale={{
          last: 'Done',
          next: 'Next',
          back: 'Back',
          skip: 'Skip'
        }}
        styles={{
          options: {
            primaryColor: '#2563EB',
            zIndex: 1000,
            arrowColor: '#ffffff',
            backgroundColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            textColor: '#333333',
            width: 'auto',
          },
          buttonNext: {
            backgroundColor: '#2563EB',
            borderRadius: '0.5rem',
            padding: '8px 16px',
          },
          buttonBack: {
            color: '#2563EB',
            marginRight: 10,
          },
          buttonSkip: {
            color: '#718096',
          },
          tooltip: {
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          },
        }}
        floaterProps={{
          disableAnimation: false,
          styles: {
            floater: {
              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
            },
          },
        }}
      />
      
      {/* Help button - only show on dashboard page */}
      {showHelpButtons && isDashboardPage && <HelpButton />}
      
      {/* Help popup */}
      {helpOpen && <HelpPopup />}
    </>
  );
};

export default GuideSystem; 