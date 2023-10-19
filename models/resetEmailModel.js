const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const crypto = require('crypto');
const DBConnection = require("./../configs/connectDB");

const CLIENT_ID = '99312710439-rs4oesbt0qb9hs5c8hiv6fvq3s5b4p1p.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04oRqEE5yr5QBCgYIARAAGAQSNwF-L9Irn4px4Dsu24ApszZUSsGoXe2bschf1f37e53TDszhyarxh54kDaZ-uk7sDuItsi9YPjY';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function generateRandomToken() {
    return crypto.randomBytes(32).toString('hex'); // Generates a 64-character hexadecimal token
}




// Create a function to send an email
let sendResetEmail =  async (to, subject, html) => {

  try{

      const accessToken = await oAuth2Client.getAccessToken();

      // Create a transporter object using your email service's SMTP settings
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'afifi13.dev@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });


      const mailOptions = {
        from: 'IMS app <afifi13.dev@gmail.com>',
        to,
        subject,
        html,
      };

      return await transporter.sendMail(mailOptions);


  }
  catch(err) {
    return err;
  }
};



let createNewToken = (token) => {
    return new Promise( (resolve, reject) => {
        const expiryTimestamp = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

        // Insert the token and expiry timestamp into the database
        DBConnection.query('INSERT INTO reset_password_tokens (token, expiry_timestamp) VALUES (?, ?)', [token, expiryTimestamp], (err, result) => {
            if (err) {
                // Handle the database error
                reject(err);
                console.error(err);
            } 
            resolve("New Token added successfully")
        });

});
}


module.exports = {
    sendResetEmail : sendResetEmail,
    generateRandomToken : generateRandomToken,
    createNewToken : createNewToken
} 
