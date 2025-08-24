// Email template for claim verification
const getClaimVerificationEmail = (claimData) => {
  const {
    claimantName,
    studentName,
    userType,
    itemName,
    verificationDate,
    verificationTime,
    foundLocation
  } = claimData;

  const recipientName = claimantName || studentName || "Claimant";
  
  let userTypeDisplay = '';
  if (userType) {
    userTypeDisplay = `(${userType})`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Item Claim Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1e40af;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9fafb;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #6b7280;
        }
        .verification-box {
          background-color: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .important {
          background-color: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }
        h2, h3 {
          color: #1e40af;
        }
        ul {
          padding-left: 20px;
        }
        .button {
          display: inline-block;
          background-color: #1e40af;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DYPCOE Lost & Found</h1>
        </div>
        
        <div class="content">
          <h2>Item Claim Confirmation</h2>
          <p>Hello ${recipientName} ${userTypeDisplay}</p>
          <p>Your claim for the item "${itemName}" has been successfully recorded in our system.</p>
          
          <div class="verification-box">
            <h3>Verification Details</h3>
            <p><strong>Verification Date:</strong> ${verificationDate}</p>
            <p><strong>Verification Time:</strong> ${verificationTime}</p>
            <p><strong>Location:</strong> Security Counter, A1 Building, DYPCOE</p>
          </div>
          
          <div class="important">
            <h3>Important Instructions</h3>
            <ul>
              <li>Bring your ID card for verification</li>
              <li>Be prepared to describe the item in detail</li>
              <li>Multiple people may have claimed this item</li>
            </ul>
          </div>
          
          <p>The item was found at ${foundLocation}. Please be ready to provide specific details about the item to verify your ownership.</p>
          
          
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} DYPCOE Lost & Found Service. All rights reserved.</p>
          <p>D Y Patil College of Engineering</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  getClaimVerificationEmail
}; 