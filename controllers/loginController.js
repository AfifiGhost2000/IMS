const { validationResult } = require("express-validator");
const loginService = require("../models/loginModel");
const passport = require('passport');

let getPageLogin = (req, res) => {
    return res.render("login.ejs", {
        errors: req.flash("errors")
    });
};



let handleLogin = (req, res, next) => {
    let errorsArr = [];
    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/login");
    }

    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            // Handle error (e.g., database error)
            return next(err);
        }
        if (!user) {
            // Authentication failed with Passport
            try {
                await loginService.handleLogin(req.body.email, req.body.password);
                req.flash('errors', 'Invalid email or password');
                return res.redirect('/login');
            } catch (err) {
                req.flash("errors", err);
                return res.redirect("/login");
            }
        }

        // Authentication succeeded with Passport, log in the user
        req.login(user, async (err) => {
            if (err) {
                return next(err);
            }

            // Use loginService even if authentication is successful with Passport
            try {
                await loginService.handleLogin(req.body.email, req.body.password);
            } catch (err) {
                req.flash("errors", err);
                return res.redirect("/login");
            }
            // Check the email and redirect accordingly
            if (req.body.email === 'afifi13.dev@gmail.com') {
                // Redirect to the admin dashboard upon successful login
                req.flash('success', 'Login successful');
                return res.redirect('/admin_dashboard');
            } else {
                // Redirect to the user dashboard upon successful login
                req.flash('success', 'Login successful');
                return res.redirect('/user_dashboard');
            }
        });
    })(req, res, next);
};


let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

let postLogOut = (req, res) => {
    req.session.destroy(function(err) {
        return res.redirect("/login");
    });
};

module.exports = {
    getPageLogin: getPageLogin,
    handleLogin: handleLogin,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
};