const resetPasswordService = require( "../models/registerModel");
const {validationResult} = require("express-validator");

let getResetPasswordPage = (req, res) => {

    return res.render("reset-password.ejs", {
        errors: req.flash("errors")
    });
}

let updatePassword = (req, res) => {
    const newPassword = req.body.password;
    const userId = req.user.id; // Assuming you have user authentication and user ID is available in req.user

    // Hash the new password before updating it in the database
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            // Update the user's password in the database
            db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.redirect('/login'); // Redirect to the login page after password update
                }
            });
        }
    });
};

module.exports = {
    updatePassword: updatePassword,
    getResetPasswordPage: getResetPasswordPage
}

