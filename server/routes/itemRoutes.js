const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/itemController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/uploadMiddleware');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Request:`, 
    req.file ? { ...req.body, file: req.file.filename } : req.body);
  next();
});

// Public routes
router.get('/', getItems);
router.get('/recent', getRecentItems);
router.get('/search', searchItems);
router.get('/statistics/data', getItemStatistics);
router.get('/contributors', getContributors);
router.get('/:id', getItem);

// Middleware to handle foundDate before upload
const parseDatesMiddleware = (req, res, next) => {
  console.log('Request body before date parsing:', req.body);
  
  // Parse date if present in URL-encoded form data
  if (req.body.foundDate) {
    try {
      // Store the original foundDate value
      console.log('Original foundDate from client:', req.body.foundDate);
      next();
    } catch (err) {
      console.error('Error parsing date:', err);
      next();
    }
  } else {
    next();
  }
};

// For development/testing - allow adding items without auth
// In production, this should use auth middleware
router.post('/', parseDatesMiddleware, upload.single('image'), createItem);

// Handle claims - public route for students to claim items
router.put('/:id/claim', async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Log the request body to see what's coming in
    console.log('Claim request body:', JSON.stringify(req.body, null, 2));
    
    // Get the item from the database
    const Item = require('../models/Item');
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    // Only allow claiming if item isn't already delivered
    if (item.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been delivered and cannot be claimed'
      });
    }
    
    // Get user type from request
    const userType = req.body.userType || 'Student';
    
    // Validate fields based on user type
    let isValid = true;
    let validationMessage = '';
    
    if (userType === 'Student') {
      // Validate required student fields
      if (!req.body.studentName || !req.body.studentId || !req.body.studentYear || !req.body.contactNumber || !req.body.email) {
        isValid = false;
        validationMessage = 'All student fields are required: studentName, studentId, studentYear, contactNumber, email';
      } 
      // Validate roll number (must be exactly 5 digits)
      else if (!/^\d{5}$/.test(req.body.studentId)) {
        isValid = false;
        validationMessage = 'Roll number must be exactly 5 digits';
      }
    } 
    else if (userType === 'Staff') {
      // Validate required staff fields
      if (!req.body.staffName || !req.body.staffDepartment || !req.body.mobileNo || !req.body.email) {
        isValid = false;
        validationMessage = 'All staff fields are required: staffName, staffDepartment, mobileNo, email';
      }
    } 
    else if (userType === 'Guard' || userType === 'Helper') {
      // Validate required guard/helper fields
      const nameField = userType === 'Guard' ? 'guardName' : 'helperName';
      if (!req.body[nameField] || !req.body.email) {
        isValid = false;
        validationMessage = `All ${userType.toLowerCase()} fields are required: ${nameField}, email`;
      }
    }
    
    // Validate contact number if provided (must be exactly 10 digits)
    if (isValid && req.body.contactNumber && !/^\d{10}$/.test(req.body.contactNumber)) {
      isValid = false;
      validationMessage = 'Contact number must be exactly 10 digits';
    }
    
    // Validate mobile number for staff if provided (must be exactly 10 digits)
    if (isValid && userType === 'Staff' && !/^\d{10}$/.test(req.body.mobileNo)) {
      isValid = false;
      validationMessage = 'Mobile number must be exactly 10 digits';
    }
    
    // Validate email format
    if (isValid && req.body.email && !/^\S+@\S+\.\S+$/.test(req.body.email)) {
      isValid = false;
      validationMessage = 'Please provide a valid email address';
    }
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }
    
    // Check if this user has already claimed this item
    let existingClaim;
    if (userType === 'Student') {
      existingClaim = item.claims && item.claims.find(
        claim => claim.userType === 'Student' && claim.rollNumber === req.body.studentId
      );
    } else if (userType === 'Staff') {
      existingClaim = item.claims && item.claims.find(
        claim => claim.userType === 'Staff' && claim.staffName === req.body.staffName && claim.email === req.body.email
      );
    } else if (userType === 'Guard') {
      existingClaim = item.claims && item.claims.find(
        claim => claim.userType === 'Guard' && claim.guardName === req.body.guardName && claim.email === req.body.email
      );
    } else if (userType === 'Helper') {
      existingClaim = item.claims && item.claims.find(
        claim => claim.userType === 'Helper' && claim.helperName === req.body.helperName && claim.email === req.body.email
      );
    }
    
    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already claimed this item'
      });
    }
    
    // Create a new claim object with all potential fields
    const newClaim = {
      userType,
      claimedDate: new Date(),
      // Student fields
      studentName: req.body.studentName || '',
      rollNumber: req.body.studentId || '',
      studyYear: req.body.studentYear || '',
      // Staff fields
      staffName: req.body.staffName || '',
      staffDepartment: req.body.staffDepartment || '',
      mobileNo: req.body.mobileNo || '',
      // Guard/Helper fields
      guardName: req.body.guardName || '',
      helperName: req.body.helperName || '',
      // Common fields
      contactNumber: req.body.contactNumber || '',
      email: req.body.email || ''
    };
    
    // Initialize claims array if it doesn't exist
    if (!item.claims) {
      item.claims = [];
    }
    
    // Add to claims array and update item status
    item.claims.push(newClaim);
    
    // Set status to claimed if not already
    if (item.status !== 'claimed') {
      item.status = 'claimed';
    }
    
    // Calculate verification date if not set (24 hours after item creation)
    if (!item.verificationDateTime) {
      const verificationDate = new Date(item.createdAt);
      verificationDate.setDate(verificationDate.getDate() + 1);
      item.verificationDateTime = verificationDate;
    }
    
    await item.save();
    
    // Format verification time for the response
    const verificationDate = new Date(item.verificationDateTime);
    const formattedVerificationDate = verificationDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedVerificationTime = verificationDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Get the name of the claimant based on user type
    let claimantName = '';
    if (userType === 'Student') {
      claimantName = req.body.studentName;
    } else if (userType === 'Staff') {
      claimantName = req.body.staffName;
    } else if (userType === 'Guard') {
      claimantName = req.body.guardName;
    } else if (userType === 'Helper') {
      claimantName = req.body.helperName;
    }
    
    // Send email with verification details
    try {
      // Import email services
      const sendEmail = require('../utils/emailService');
      const { getClaimVerificationEmail } = require('../utils/emailTemplates');
      
      // Prepare email data
      const emailData = {
        claimantName: claimantName,
        userType: userType,
        itemName: item.name,
        verificationDate: formattedVerificationDate,
        verificationTime: formattedVerificationTime,
        foundLocation: item.location
      };
      
      // Generate email content
      const emailHtml = getClaimVerificationEmail(emailData);
      
      // Send the email
      await sendEmail({
        email: req.body.email,
        subject: 'DYPCOE Lost & Found: Item Claim Verification',
        message: emailHtml
      });
      
      console.log(`Verification email sent to ${req.body.email}`);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Continue process even if email fails - don't block the API response
    }
    
    res.status(200).json({
      success: true,
      data: item,
      claim: {
        verificationDate: formattedVerificationDate,
        verificationTime: formattedVerificationTime
      }
    });
  } catch (error) {
    console.error('Error claiming item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Protected routes (guard only) - these would require proper auth in production
// router.use(protect, authorize('guard'));
// router.post('/', upload.single('image'), createItem);
router.put('/:id', upload.single('image'), updateItem);
router.put('/:id/delivered', markAsDelivered);

// Route to update a claimed item (both item details and student information)
router.put('/:id/update-claimed', upload.single('image'), updateClaimedItem);

// General status update route
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['available', 'claimed', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const Item = require('../models/Item');
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating item status'
    });
  }
});

// New route for guards to deliver an item to a specific claimant
router.put('/:id/deliver', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { claimIndex, verifiedBy } = req.body;
    
    if (claimIndex === undefined || claimIndex === null) {
      return res.status(400).json({
        success: false,
        message: 'Claim index is required'
      });
    }
    
    // Get the item
    const Item = require('../models/Item');
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    // Check if the claim index is valid
    if (!item.claims || claimIndex < 0 || claimIndex >= item.claims.length) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }
    
    // Get the selected claim by index
    const selectedClaim = item.claims[claimIndex];
    
    // Update the item as delivered
    item.status = 'delivered';
    
    // Store the delivery information based on user type
    item.deliveredTo = {
      userType: selectedClaim.userType || 'Student',
      // Student fields
      studentName: selectedClaim.studentName || '',
      rollNumber: selectedClaim.rollNumber || '',
      studyYear: selectedClaim.studyYear || '',
      // Staff fields
      staffName: selectedClaim.staffName || '',
      staffDepartment: selectedClaim.staffDepartment || '',
      mobileNo: selectedClaim.mobileNo || '',
      // Guard/Helper fields
      guardName: selectedClaim.guardName || '',
      helperName: selectedClaim.helperName || '',
      // Common fields
      contactNumber: selectedClaim.contactNumber || '',
      email: selectedClaim.email || '',
      deliveryDate: new Date(),
      verifiedBy: verifiedBy || 'guard'
    };
    
    await item.save();
    
    res.status(200).json({
      success: true,
      message: 'Item delivered successfully',
      data: item
    });
  } catch (error) {
    console.error('Error delivering item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.delete('/:id', deleteItem);

module.exports = router;