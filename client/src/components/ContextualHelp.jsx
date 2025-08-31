import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

/**
 * A component that adds a help icon with a tooltip to any UI element
 * @param {string} topic - The help topic
 * @param {string} position - Tooltip position (top, bottom, left, right)
 * @param {string} className - Additional classes
 * @returns {JSX.Element}
 */
const ContextualHelp = ({ topic, position = 'top', className = '' }) => {
  const helpContent = {
    'add-item': 'Add a new lost item to the system. Take a photo and fill in all details.',
    'verify-claim': 'Verify a student\'s claim by checking their ID and asking relevant questions.',
    'manage-claims': 'View and manage all claims for this item. Mark items as delivered here.',
    'claim-expiry': 'Claims expire after 24 hours if not verified, and all claimants are notified by email.',
    'search-items': 'Search for items by name or category to quickly find what you\'re looking for.',
    'item-status': 'Items can be Available (unclaimed), Claimed (waiting for verification), or Delivered.',
    'verification-time': 'The deadline for claimants to verify ownership. Resets every 24 hours.',
    'upload-photo': 'Take a clear, well-lit photo of the item to help with identification.',
    'dashboard-stats': 'Overview of all items in the system and their current status.',
    'data-analysis': 'View statistics about lost items, claim rates, and return rates.',
  };

  const content = helpContent[topic] || 'Click for help with this feature';
  const tooltipId = `help-tooltip-${topic}`;

  return (
    <div className={`inline-block ml-1 text-gray-400 hover:text-gray-600 ${className}`}>
      <FaQuestionCircle 
        data-tooltip-id={tooltipId}
        data-tooltip-content={content}
        data-tooltip-place={position}
        className="cursor-help transition-transform hover:scale-110 active:scale-95"
        style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}
      />
      <Tooltip 
        id={tooltipId} 
        style={{ 
          backgroundColor: '#ffffff', 
          color: '#334155',
          maxWidth: '250px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          padding: '0.75rem',
          border: '1px solid #e2e8f0',
          zIndex: 1000
        }}
      />
    </div>
  );
};

export default ContextualHelp; 