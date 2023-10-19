const registerService = require( "../models/registerModel");
const resetEmailService = require( "../models/resetEmailModel");
const db = require("../configs/connectDB");


let sendResetPasswordLink = (req, res) => {


        const email = req.body.email;

            // Check if the email exists in your database (you may have a different function for this)
            const emailExists =  registerService.checkExistEmail(email);

            emailExists.then((result) => {
                if(result) {

                    // Send the reset email here (you may have a different function for this)
                    const randomToken = resetEmailService.generateRandomToken();
                    const subject = 'Reset Password Link';
                    const html = `<p>Please click the following link to reset your password:</p><a href="http://localhost:3000/reset-password/${randomToken}" target="_blank">http://localhost:3000/reset-password/${randomToken}</a>`;
                    resetEmailService.sendResetEmail(email,subject,html)
                    .then((result) => console.log('Email sent...', result))
                    .catch((error) => console.log(error.message));

                    resetEmailService.createNewToken(randomToken);

                    // Set a success message and redirect to the same page
                    req.flash('message', 'Check Your Email!');


                }
                else {
                    // Set an error message if the email doesn't exist
                    req.flash('message', 'Email not found');
           
        
                } 
            })
            .catch((err) => {

                // Handle any errors that occur during the process
                console.error(err);
                req.flash('message', 'An error occurred');
            });
        
           

        
   
        
        // Redirect back to the forgot-password page
        res.redirect('/forgot-password');

        };


let verifyToken = (req, res) => {

    // Retrieve the token from the query parameter (e.g., from the URL)
    const token = req.params.token;

    // Retrieve the token and its expiry timestamp from the database
    db.query('SELECT token, expiry_timestamp FROM reset_password_tokens WHERE token = ?', [token], (err, rows) => {
        if (err) {
            // Handle the database error
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (rows.length === 1) {
                // Token found in the database
                const storedToken = rows[0].token;
                const expiryTimestamp = rows[0].expiry_timestamp;

                // Check if the token is valid and not expired
                const currentTime = new Date();
                if (currentTime <= expiryTimestamp) {
                    // Token is valid and not expired`
                    // Allow the user to reset their password
                    res.render('reset-password');
                } else {
                    // Token is either invalid or expired
                    // Handle accordingly, e.g., show an error message
                    res.render('reset-password-error', { message: 'Token has expired :(', text: 'Please request a new reset link.' });
                }
            } else {
                // Token not found in the database
                // Handle accordingly, e.g., show an error message
                res.render('reset-password-error', { message: 'Invalid or expired token :(' });
            }
        }
    });

};


        module.exports = {
            sendResetPasswordLink : sendResetPasswordLink,
            verifyToken : verifyToken

        }

