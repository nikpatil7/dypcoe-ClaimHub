/**
 * Format a date string to DD-MM-YYYY format
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    // First check if it's a string in DD-MM-YYYY format to avoid re-parsing
    if (typeof dateString === 'string' && dateString.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      const [day, month, year] = dateString.split('-').map(Number);
      
      // Verify that these are valid date components
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
      }
    }
    
    // For other date formats or Date objects
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', dateString);
      return 'Invalid date';
    }
    
    // Use UTC to avoid timezone shifts
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid date';
  }
};

/**
 * Parse a date string in format DD-MM-YYYY or YYYY-MM-DD to ISO format
 * @param {string} dateString - Date string to parse
 * @returns {string} ISO formatted date string
 */
export const parseDateForServer = (dateString) => {
  try {
    // Check if in DD-MM-YYYY format
    if (dateString.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      const [day, month, year] = dateString.split('-').map(Number);
      
      // Create date in UTC to avoid timezone issues
      const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      
      // Validate the created date has the correct day/month/year components
      if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1 || date.getUTCFullYear() !== year) {
        console.error('Date component validation failed:', {
          original: { day, month, year },
          parsed: { 
            day: date.getUTCDate(), 
            month: date.getUTCMonth() + 1, 
            year: date.getUTCFullYear() 
          }
        });
        throw new Error('Invalid date components when parsing DD-MM-YYYY');
      }
      
      return date.toISOString();
    }
    // If it's YYYY-MM-DD format from the date input
    else if (dateString.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Create date in UTC to avoid timezone issues
      const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      
      // Validate the created date has the correct day/month/year components
      if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1 || date.getUTCFullYear() !== year) {
        console.error('Date component validation failed:', {
          original: { year, month, day },
          parsed: { 
            day: date.getUTCDate(), 
            month: date.getUTCMonth() + 1, 
            year: date.getUTCFullYear() 
          }
        });
        throw new Error('Invalid date components when parsing YYYY-MM-DD');
      }
      
      return date.toISOString();
    }
    
    // Already ISO format or other format, make sure it's properly set to noon UTC
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Create a new UTC date at noon to avoid timezone issues
      return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12, 0, 0
      )).toISOString();
    }
    
    throw new Error(`Invalid date format: ${dateString}`);
  } catch (error) {
    console.error('Error parsing date:', error);
    throw error;
  }
};

/**
 * Validates that a date is not in the future
 * @param {string|Date} dateToCheck - Date to validate
 * @returns {boolean} True if date is valid and not in the future
 */
export const isValidPastOrPresentDate = (dateToCheck) => {
  try {
    const date = new Date(dateToCheck);
    const today = new Date();
    
    // Reset time parts for comparison (compare dates only)
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Check if date is valid and not in the future
    return !isNaN(date.getTime()) && date <= today;
  } catch (e) {
    console.error('Error validating date:', e);
    return false;
  }
};

/**
 * Safely parse a date string that might be in various formats
 * Ensures DD-MM-YYYY is correctly interpreted and not as MM-DD-YYYY
 * @param {string|Date} dateString - Date string to parse
 * @returns {Date} Properly parsed date object
 */
export const safeParseDateString = (dateString) => {
  if (!dateString) return null;
  
  try {
    // If it's already a Date object, return it
    if (dateString instanceof Date) {
      return isNaN(dateString.getTime()) ? null : dateString;
    }
    
    // Check if it's a DD-MM-YYYY format
    if (typeof dateString === 'string' && dateString.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      const [day, month, year] = dateString.split('-').map(Number);
      
      // Use UTC to avoid timezone issues, with noon time
      const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      
      // Verify that the parsed date has the expected components
      if (date.getUTCDate() === day && date.getUTCMonth() === month - 1 && date.getUTCFullYear() === year) {
        return date;
      }
      
      console.warn('Date components mismatch when parsing DD-MM-YYYY:', {
        input: dateString,
        components: { day, month, year },
        parsed: { 
          day: date.getUTCDate(), 
          month: date.getUTCMonth() + 1, 
          year: date.getUTCFullYear() 
        }
      });
    }
    
    // Check if it's a YYYY-MM-DD format
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Use UTC to avoid timezone issues, with noon time
      const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      
      // Verify that the parsed date has the expected components
      if (date.getUTCDate() === day && date.getUTCMonth() === month - 1 && date.getUTCFullYear() === year) {
        return date;
      }
      
      console.warn('Date components mismatch when parsing YYYY-MM-DD:', {
        input: dateString,
        components: { year, month, day },
        parsed: { 
          day: date.getUTCDate(), 
          month: date.getUTCMonth() + 1, 
          year: date.getUTCFullYear() 
        }
      });
    }
    
    // Fall back to standard date parsing with UTC noon time
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      // Create a new date with UTC noon time to avoid timezone issues
      return new Date(Date.UTC(
        parsed.getFullYear(),
        parsed.getMonth(),
        parsed.getDate(),
        12, 0, 0
      ));
    }
    
    console.error('Failed to parse date:', dateString);
    return null;
  } catch (e) {
    console.error('Error safely parsing date:', e, dateString);
    return null;
  }
};

// Add a new function to format date and time together
/**
 * Format a date with time in DD-MM-YYYY HH:MM format
 * @param {string|Date} dateTimeString - Date and time to format
 * @param {boolean} useLocalTimezone - Whether to display in local timezone (India GMT+5:30)
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateTimeString, useLocalTimezone = true) => {
  if (!dateTimeString) return 'N/A';
  
  try {
    const date = new Date(dateTimeString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', dateTimeString);
      return 'Invalid date';
    }
    
    if (useLocalTimezone) {
      // Format using local timezone (for India, this will be GMT+5:30)
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      // Format the time part (HH:MM)
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      // Convert to 12-hour format
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    } else {
      // Format using UTC time
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      
      // Format the time part (HH:MM)
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes} UTC`;
    }
  } catch (e) {
    console.error('Error formatting date and time:', e);
    return 'Invalid date';
  }
}; 