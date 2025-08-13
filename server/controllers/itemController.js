const Item = require('../models/Item');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// Helper function to format verification time for an item
const formatVerificationTime = (item) => {
  if (!item || !item.verificationDateTime) return null;
  
  const verificationDate = new Date(item.verificationDateTime);
  return {
    verificationDate: verificationDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    verificationTime: verificationDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
  // Include query parameter to specify whether to include delivered items
  const { showDelivered } = req.query;
  
  let query = {};
  
  // By default, only show available and claimed items unless explicitly requested
  if (showDelivered !== 'true') {
    query.status = { $ne: 'delivered' };
  }
  
  const items = await Item.find(query).sort('-createdAt');
  
  // Format verification times for each item
  const itemsWithVerification = items.map(item => {
    const itemObj = item.toObject();
    return {
      ...itemObj,
      verification: formatVerificationTime(item)
    };
  });
  
  res.status(200).json({
    success: true,
    count: items.length,
    data: itemsWithVerification
  });
});

// @desc    Get recent items
// @route   GET /api/items/recent
// @access  Public
const getRecentItems = asyncHandler(async (req, res) => {
  // By default, only show available items
  const items = await Item.find({ status: 'available' })
    .sort('-createdAt')
    .limit(8);
    
  // Format verification times for each item
  const itemsWithVerification = items.map(item => {
    const itemObj = item.toObject();
    return {
      ...itemObj,
      verification: formatVerificationTime(item)
    };
  });
  
  res.status(200).json({
    success: true,
    count: items.length,
    data: itemsWithVerification
  });
});

// @desc    Search items
// @route   GET /api/items/search
// @access  Public
const searchItems = asyncHandler(async (req, res) => {
  const { q, showDelivered } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a search term'
    });
  }

  console.log(`Searching for items with query: ${q}`);
  
  // Get search results
  let items = await Item.searchItems(q);
  
  // Filter out delivered items unless explicitly requested
  if (showDelivered !== 'true') {
    items = items.filter(item => item.status !== 'delivered');
  }
  
  console.log(`Found ${items.length} items matching the search term`);
  
  // Format verification times for each item
  const itemsWithVerification = items.map(item => {
    const itemObj = typeof item.toObject === 'function' ? item.toObject() : item;
    return {
      ...itemObj,
      verification: formatVerificationTime(item)
    };
  });
  
  res.status(200).json({
    success: true,
    count: items.length,
    data: itemsWithVerification
  });
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Add formatted verification time for all items
  let formattedVerification = formatVerificationTime(item);

  res.status(200).json({
    success: true,
    data: item,
    verification: formattedVerification
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  // Handle file upload
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image'
    });
  }

  // Add user to req.body if auth system is active
  if (req.user && req.user.username) {
    req.body.addedBy = req.user.username;
  } else {
    req.body.addedBy = 'dypcoe_guard'; // Default fallback
  }

  try {
    // Log the received data
    console.log('Received item data:', req.body);
    console.log('Received foundDate:', req.body.foundDate);
    
    // Get contributor type
    const contributorType = req.body['contributor[userType]'] || 'Student';
    
    // Validate contributor data based on type
    if (contributorType === 'Student' && req.body['contributor[studentName]']) {
      // Validate roll number format for student (exactly 5 digits)
      if (req.body['contributor[rollNumber]'] && 
          !/^\d{5}$/.test(req.body['contributor[rollNumber]'])) {
        return res.status(400).json({
          success: false,
          message: 'Roll number must be exactly 5 digits'
        });
      }
    } else if (contributorType === 'Staff' && req.body['contributor[staffName]']) {
      // Validate mobile number format for staff (exactly 10 digits)
      if (req.body['contributor[mobileNo]'] && 
          !/^\d{10}$/.test(req.body['contributor[mobileNo]'])) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number must be exactly 10 digits'
        });
      }
    }
    
    // Parse the foundDate explicitly if it exists
    const itemData = { ...req.body };
    
    // Structure contributor data based on type
    if (contributorType === 'Student' && itemData['contributor[studentName]']) {
      itemData.contributor = {
        userType: 'Student',
        studentName: itemData['contributor[studentName]'],
        rollNumber: itemData['contributor[rollNumber]'],
        department: itemData['contributor[department]'],
        studyYear: itemData['contributor[studyYear]'],
        submittedDate: new Date(),
        displayUntil: new Date(new Date().setDate(new Date().getDate() + 7)) // 7 days from now
      };
      
      // Remove the flat contributor fields
      delete itemData['contributor[userType]'];
      delete itemData['contributor[studentName]'];
      delete itemData['contributor[rollNumber]'];
      delete itemData['contributor[department]'];
      delete itemData['contributor[studyYear]'];
    } 
    else if (contributorType === 'Staff' && itemData['contributor[staffName]']) {
      itemData.contributor = {
        userType: 'Staff',
        staffName: itemData['contributor[staffName]'],
        staffDepartment: itemData['contributor[staffDepartment]'],
        mobileNo: itemData['contributor[mobileNo]'],
        email: itemData['contributor[email]'],
        submittedDate: new Date(),
        displayUntil: new Date(new Date().setDate(new Date().getDate() + 7)) // 7 days from now
      };
      
      // Remove the flat contributor fields
      delete itemData['contributor[userType]'];
      delete itemData['contributor[staffName]'];
      delete itemData['contributor[staffDepartment]'];
      delete itemData['contributor[mobileNo]'];
      delete itemData['contributor[email]'];
    }
    else if (contributorType === 'Guard' && itemData['contributor[guardName]']) {
      itemData.contributor = {
        userType: 'Guard',
        guardName: itemData['contributor[guardName]'],
        email: itemData['contributor[email]'],
        submittedDate: new Date(),
        displayUntil: new Date(new Date().setDate(new Date().getDate() + 7)) // 7 days from now
      };
      
      // Remove the flat contributor fields
      delete itemData['contributor[userType]'];
      delete itemData['contributor[guardName]'];
      delete itemData['contributor[email]'];
    }
    else if (contributorType === 'Helper' && itemData['contributor[helperName]']) {
      itemData.contributor = {
        userType: 'Helper',
        helperName: itemData['contributor[helperName]'],
        email: itemData['contributor[email]'],
        submittedDate: new Date(),
        displayUntil: new Date(new Date().setDate(new Date().getDate() + 7)) // 7 days from now
      };
      
      // Remove the flat contributor fields
      delete itemData['contributor[userType]'];
      delete itemData['contributor[helperName]'];
      delete itemData['contributor[email]'];
    }
    
    if (itemData.foundDate) {
      console.log('Original foundDate from client:', itemData.foundDate);
      
      // Parse the date explicitly as a standalone date object
      try {
        // Create a date object from ISO string
        let parsedDate;
        
        // Handle DD-MM-YYYY format
        if (typeof itemData.foundDate === 'string' && itemData.foundDate.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
          const [day, month, year] = itemData.foundDate.split('-').map(Number);
          // Create date at noon UTC to avoid timezone issues
          parsedDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
          
          console.log('Parsed DD-MM-YYYY format:', {
            original: itemData.foundDate,
            parsed: parsedDate.toISOString(),
            components: {
              day, month, year,
              parsedDay: parsedDate.getUTCDate(),
              parsedMonth: parsedDate.getUTCMonth() + 1,
              parsedYear: parsedDate.getUTCFullYear()
            }
          });
        }
        // Handle YYYY-MM-DD format
        else if (typeof itemData.foundDate === 'string' && itemData.foundDate.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
          const [year, month, day] = itemData.foundDate.split('-').map(Number);
          // Create date at noon UTC to avoid timezone issues
          parsedDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
          
          console.log('Parsed YYYY-MM-DD format:', {
            original: itemData.foundDate,
            parsed: parsedDate.toISOString(),
            components: {
              year, month, day,
              parsedDay: parsedDate.getUTCDate(),
              parsedMonth: parsedDate.getUTCMonth() + 1,
              parsedYear: parsedDate.getUTCFullYear()
            }
          });
        }
        // Handle ISO format or other string formats
        else {
          // Create a date object from the string
          const tempDate = new Date(itemData.foundDate);
          
          // Create date at noon UTC to avoid timezone issues
          parsedDate = new Date(Date.UTC(
            tempDate.getFullYear(),
            tempDate.getMonth(),
            tempDate.getDate(),
            12, 0, 0
          ));
          
          console.log('Parsed ISO/other format:', {
            original: itemData.foundDate,
            parsed: parsedDate.toISOString()
          });
        }
        
        // Check if the date is valid
        if (!isNaN(parsedDate.getTime())) {
          // Check if the date is in the future
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          parsedDate.setHours(0, 0, 0, 0);
          
          if (parsedDate > today) {
            return res.status(400).json({
              success: false,
              message: 'Found date cannot be in the future'
            });
          }
          
          // Valid date - set foundDate directly
          itemData.foundDate = parsedDate;
          console.log('Parsed foundDate successfully:', itemData.foundDate);
        } else {
          console.error('Invalid date format received:', itemData.foundDate);
          return res.status(400).json({
            success: false,
            message: 'Invalid date format'
          });
        }
      } catch (err) {
        console.error('Error parsing date:', err);
        // Keep the original value for potential server-side validation error
      }
    }
    
    const item = await Item.create({
      ...itemData,
      image: `/uploads/${req.file.filename}`
    });
    
    console.log('Created item with foundDate:', item.foundDate);
    console.log('Item foundDate type:', typeof item.foundDate);
    
    // Set verification time to 24 hours from now
    const verificationTime = new Date();
    verificationTime.setHours(verificationTime.getHours() + 24);
    item.verificationDateTime = verificationTime;
    await item.save();
    
    // Fetch the item again to verify how it's stored in the database
    const savedItem = await Item.findById(item._id);
    console.log('Retrieved item after save:', savedItem);
    console.log('Retrieved foundDate:', savedItem.foundDate);

    // Format verification time for response
    const formattedVerification = formatVerificationTime(savedItem);

    res.status(201).json({
      success: true,
      data: savedItem,
      verification: formattedVerification
    });
  } catch (error) {
    // If there's an error, clean up the uploaded file
    if (req.file) {
      const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    throw error;
  }
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Make sure user is guard/admin - in real system this would check roles
  // For now, we're using the temporary auth system so this check is simplified
  if (req.user && req.user.role !== 'guard') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  // Only allow updating items with 'available' status
  if (item.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'Only available items can be edited'
    });
  }

  // Handle file upload
  const updateData = { ...req.body };
  
  // Validate foundDate if it's being updated
  if (updateData.foundDate) {
    try {
      const parsedDate = new Date(updateData.foundDate);
      
      // Check if the date is valid
      if (!isNaN(parsedDate.getTime())) {
        // Check if the date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        parsedDate.setHours(0, 0, 0, 0);
        
        if (parsedDate > today) {
          return res.status(400).json({
            success: false,
            message: 'Found date cannot be in the future'
          });
        }
        
        // Valid date - set foundDate directly
        updateData.foundDate = parsedDate;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
    } catch (err) {
      console.error('Error parsing date:', err);
      return res.status(400).json({
        success: false,
        message: 'Error processing date'
      });
    }
  }
  
  // If a new image was uploaded
  if (req.file) {
    // Delete old image if it exists
    if (item.image) {
      const oldImagePath = path.join(__dirname, '../public', item.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Set the new image path
    updateData.image = `/uploads/${req.file.filename}`;
  }

  item = await Item.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Update claimed item
// @route   PUT /api/items/:id/update-claimed
// @access  Private
const updateClaimedItem = asyncHandler(async (req, res) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Make sure user is guard/admin - in real system this would check roles
  if (req.user && req.user.role !== 'guard') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  // Only allow updating items with 'claimed' or 'delivered' status
  if (item.status !== 'claimed' && item.status !== 'delivered') {
    return res.status(400).json({
      success: false,
      message: 'Only claimed or delivered items can be edited'
    });
  }

  // Handle file upload
  const updateData = { ...req.body };
  
  // Validate foundDate if it's being updated
  if (updateData.foundDate) {
    try {
      const parsedDate = new Date(updateData.foundDate);
      
      // Check if the date is valid
      if (!isNaN(parsedDate.getTime())) {
        // Check if the date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        parsedDate.setHours(0, 0, 0, 0);
        
        if (parsedDate > today) {
          return res.status(400).json({
            success: false,
            message: 'Found date cannot be in the future'
          });
        }
        
        // Valid date - set foundDate directly
        updateData.foundDate = parsedDate;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
    } catch (err) {
      console.error('Error parsing date:', err);
      return res.status(400).json({
        success: false,
        message: 'Error processing date'
      });
    }
  }
  
  // Process student information updates
  if (updateData.claimedBy) {
    // Validate required fields for student info
    const { studentName, studentId, studentYear, contactNumber } = updateData.claimedBy;
    
    if (!studentName || !studentId || !studentYear || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'All student fields are required: studentName, studentId, studentYear, contactNumber'
      });
    }
    
    // Validate roll number (must be exactly 5 digits)
    if (!/^\d{5}$/.test(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Roll number must be exactly 5 digits'
      });
    }
    
    // Validate contact number (must be exactly 10 digits)
    if (!/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Contact number must be exactly 10 digits'
      });
    }
    
    // Map student data to proper field names
    updateData.claimedBy = {
      studentName: studentName,
      rollNumber: studentId,
      studyYear: studentYear,
      contactNumber: contactNumber,
      // Preserve original claimed date
      claimedDate: item.claimedBy?.claimedDate || new Date()
    };
  }
  
  // If a new image was uploaded
  if (req.file) {
    // Delete old image if it exists
    if (item.image) {
      const oldImagePath = path.join(__dirname, '../public', item.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Set the new image path
    updateData.image = `/uploads/${req.file.filename}`;
  }

  item = await Item.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Mark item as delivered
// @route   PUT /api/items/:id/delivered
// @access  Private
const markAsDelivered = asyncHandler(async (req, res) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Make sure user is guard/admin - in real system this would check roles
  // For now, we're using the temporary auth system so this check is simplified
  if (req.user && req.user.role !== 'guard') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  // Only items with 'claimed' status can be marked as delivered
  if (item.status !== 'claimed') {
    return res.status(400).json({
      success: false,
      message: 'Only claimed items can be marked as delivered'
    });
  }

  // Preserve the existing claimedBy information
  const claimedByData = req.body.claimedBy || item.claimedBy;
  
  // Ensure the claimedDate is preserved
  if (!claimedByData.claimedDate && item.claimedBy && item.claimedBy.claimedDate) {
    claimedByData.claimedDate = item.claimedBy.claimedDate;
  }

  item = await Item.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'delivered',
      claimedBy: claimedByData
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Make sure user is guard/admin - in real system this would check roles
  // For now, we're using the temporary auth system so this check is simplified
  if (req.user && req.user.role !== 'guard') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this item'
    });
  }

  // Delete main item image file
  if (item.image) {
    const imagePath = path.join(__dirname, '../public', item.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Delete ID proof image if it exists (for claimed items)
  if (item.claimedBy && item.claimedBy.idProofImage) {
    const idProofPath = path.join(__dirname, '../public', item.claimedBy.idProofImage);
    if (fs.existsSync(idProofPath)) {
      fs.unlinkSync(idProofPath);
    }
  }

  // Using findByIdAndDelete instead of remove()
  await Item.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get item statistics
// @route   GET /api/items/statistics
// @access  Private
const getItemStatistics = asyncHandler(async (req, res) => {
  const { year } = req.query;
  
  // Default to current year if not specified
  const currentYear = new Date().getFullYear();
  let targetYear = year ? parseInt(year) : currentYear;
  
  // Prevent future years
  if (targetYear > currentYear) {
    targetYear = currentYear;
  }
  
  try {
    // Create date range for the specified year
    const startDate = new Date(Date.UTC(targetYear, 0, 1)); // January 1st of target year
    const endDate = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999)); // December 31st of target year
    
    console.log('Statistics date range:', {
      targetYear,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    // Get monthly counts for both collected and returned items
    const monthlyStats = await Promise.all(
      Array.from({ length: 12 }, (_, i) => {
        const month = i + 1; // Month is 1-indexed (1 = January)
        // Use UTC dates to avoid timezone issues
        const monthStart = new Date(Date.UTC(targetYear, i, 1));
        const monthEnd = new Date(Date.UTC(targetYear, i + 1, 0, 23, 59, 59, 999)); // Last day of month
        
        console.log(`Stats for month ${month}:`, {
          monthStart: monthStart.toISOString(),
          monthEnd: monthEnd.toISOString()
        });
        
        return Promise.all([
          // Count items with foundDate in this month (collected)
          Item.countDocuments({
            foundDate: {
              $gte: monthStart,
              $lte: monthEnd
            }
          }),
          
          // Count items that are delivered AND were FOUND in this specific month
          // This is what we want - items found in this month that have been delivered
          Item.countDocuments({
            status: 'delivered',
            foundDate: {
              $gte: monthStart,
              $lte: monthEnd
            }
          })
        ]).then(([collected, delivered]) => ({
          month,
          collected,
          delivered
        }));
      })
    );
    
    // Get total counts for the year
    const totalCollected = await Item.countDocuments({
      foundDate: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    const totalDelivered = await Item.countDocuments({
      status: 'delivered',
      foundDate: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Get available years (years that have data)
    const distinctYears = await Item.aggregate([
      {
        $group: {
          _id: { $year: '$foundDate' }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    // Add the current year if not already in the list
    const availableYears = distinctYears.map(year => year._id);
    
    if (!availableYears.includes(targetYear)) {
      availableYears.unshift(targetYear);
    }
    
    // Make sure years are sorted in descending order and no future years
    const filteredYears = availableYears
      .filter(year => year <= currentYear)
      .sort((a, b) => b - a);
    
    console.log('Available years found:', filteredYears);
    
    res.status(200).json({
      success: true,
      data: {
        year: targetYear.toString(),
        availableYears: filteredYears,
        total: {
          collected: totalCollected,
          delivered: totalDelivered
        },
        monthly: monthlyStats
      }
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics'
    });
  }
});

// @desc    Get contributors for homepage showcase
// @route   GET /api/items/contributors
// @access  Public
const getContributors = asyncHandler(async (req, res) => {
  const now = new Date();
  
  // Find items with contributor information where displayUntil date is greater than or equal to now
  // Check for valid contributor name based on type (student, staff, guard, or helper)
  const items = await Item.find({
    $or: [
      { 'contributor.studentName': { $exists: true, $ne: '' } },
      { 'contributor.staffName': { $exists: true, $ne: '' } },
      { 'contributor.guardName': { $exists: true, $ne: '' } },
      { 'contributor.helperName': { $exists: true, $ne: '' } }
    ],
    'contributor.displayUntil': { $gte: now }
  })
  .sort('-contributor.submittedDate')
  .limit(10);
  
  res.status(200).json(items);
});

module.exports = {
  getItems,
  getRecentItems,
  searchItems,
  getItem,
  createItem,
  updateItem,
  updateClaimedItem,
  markAsDelivered,
  deleteItem,
  getItemStatistics,
  getContributors
};