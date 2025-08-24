const Item = require('../models/Item');
const sendEmail = require('./emailService');

/**
 * Sends notification emails to claimants whose claims have expired
 * @param {Array} expiredClaims - Array of expired claim objects
 * @param {Object} item - The item object
 */
const sendExpiredClaimNotifications = async (expiredClaims, item) => {
  try {
    for (const claim of expiredClaims) {
      // Skip if no email is provided
      if (!claim.email) continue;
      
      // Create email content
      const emailSubject = 'DYPCOE Lost & Found: Your Claim Has Expired';
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #d32f2f; text-align: center;">Claim Expiration Notice</h2>
          <p>Dear ${claim.studentName || claim.staffName || claim.guardName || claim.helperName || 'Claimant'},</p>
          <p>Your claim for the following item has expired because you did not appear for verification within the scheduled timeframe:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Item:</strong> ${item.name}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Location Found:</strong> ${item.location}</p>
            <p><strong>Date Found:</strong> ${new Date(item.foundDate).toLocaleDateString()}</p>
            <p><strong>Claim Date:</strong> ${new Date(claim.claimedDate).toLocaleDateString()}</p>
          </div>
          
          <p>The verification window has now passed. If you still believe this item belongs to you, you will need to submit a new claim on our website.</p>
          
          <p>You can visit our Lost & Found system to view available items and submit a new claim:</p>
          <p style="text-align: center;"><a href="http://localhost:3000/lost-items" style="background-color: #1976d2; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Visit Lost & Found</a></p>
          
          <p>Note: Please make sure to attend the verification session for your next claim. Verification sessions are scheduled 24 hours after an item is uploaded.</p>
          
          <p>Regards,<br>DYPCOE Lost & Found Team</p>
        </div>
      `;
      
      // Send the email
      await sendEmail({
        email: claim.email,
        subject: emailSubject,
        message: emailContent
      });
      
      console.log(`Sent claim expiration email to ${claim.email}`);
    }
  } catch (error) {
    console.error('Error sending claim expiration emails:', error);
  }
};

/**
 * Processes items with expired verification times
 * - Resets claims if they weren't verified within 24 hours
 * - Updates verification time for the next 24 hours
 */
const processExpiredClaims = async () => {
  try {
    console.log('Running scheduled claim expiration check...');
    const now = new Date();
    
    // Find all items with verification time in the past
    const expiredItems = await Item.find({
      verificationDateTime: { $lt: now },
      status: { $in: ['available', 'claimed'] },  // Only process available or claimed items
    });
    
    console.log(`Found ${expiredItems.length} items with expired verification times`);
    
    for (const item of expiredItems) {
      // If item has claims but wasn't delivered, reset claims and make item available again
      if (item.status === 'claimed' && item.claims && item.claims.length > 0) {
        console.log(`Resetting claims for item ${item._id} (${item.name})`);
        
        // Log the expired claims for record keeping
        const expiredClaims = item.claims;
        console.log(`Expired claims: ${JSON.stringify(expiredClaims.map(c => ({
          userType: c.userType,
          name: c.studentName || c.staffName || c.guardName || c.helperName,
          email: c.email,
          claimedDate: c.claimedDate
        })))}`);
        
        // Send email notifications to all claimants
        await sendExpiredClaimNotifications(expiredClaims, item);
        
        // Reset claims and status
        item.claims = [];
        item.status = 'available';
      }
      
      // Set new verification time for 24 hours from now
      const newVerificationTime = new Date();
      newVerificationTime.setHours(newVerificationTime.getHours() + 24);
      item.verificationDateTime = newVerificationTime;
      
      console.log(`Updated verification time for item ${item._id} to ${newVerificationTime}`);
      
      // Save the updated item
      await item.save();
    }
    
    console.log('Completed claim expiration check');
  } catch (error) {
    console.error('Error processing expired claims:', error);
  }
};

/**
 * Starts the scheduler to run the claim expiration check
 * @param {number} intervalMinutes - How often to run the check (in minutes)
 */
const startScheduler = (intervalMinutes = 60) => {
  // Run immediately on startup
  processExpiredClaims();
  
  // Then schedule to run periodically
  const interval = intervalMinutes * 60 * 1000; // Convert minutes to milliseconds
  setInterval(processExpiredClaims, interval);
  
  console.log(`Claim scheduler started. Will run every ${intervalMinutes} minutes.`);
};

module.exports = {
  processExpiredClaims,
  startScheduler
}; 