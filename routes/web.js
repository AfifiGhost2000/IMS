const express = require("express");
const homePageController = require("../controllers/homePageController");
const registerController = require( "../controllers/registerController");
const loginController = require("../controllers/loginController");
const auth = require("../validation/authValidation");
const path = require("path");
const initPassportLocal = require("../controllers/passportLocalController");
const resetEmailController = require("../controllers/resetEmailController");
const resetPasswordController = require("../controllers/resetPasswordController");
const adminPageController = require("../controllers/adminPageController");
const userPageController = require("../controllers/userPageController");
const filePayloadExists = require("../middleware/filePayloadExists");
const fileExtLimiter = require("../middleware/fileExtLimiter");
const fileSizeLimiter = require("../middleware/fileSizeLimiter");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        // generate the public name, removing problematic characters
        const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
        // const timestamp = Date.now()
        const extension = path.extname(file.originalname).toLowerCase()
        cb(null, originalName  + extension)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mb
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ['pdf', 'docx']
        if (!(acceptableExtensions.some(extension => 
            path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
        }
        console.log('File Uploaded Successfully!')
        callback(null, true)
    }
})





// Init all passport
initPassportLocal();

let router = express.Router();


let initWebRoutes = (app) => {

    router.get("/", loginController.checkLoggedOut, homePageController.getHomePage);
    router.get("/login",  loginController.getPageLogin);
    router.post("/login", loginController.handleLogin);

    router.get('/admin_dashboard', loginController.checkLoggedIn, adminPageController.getAdminDashboard);

        // Define a route to handle the "Accept" action
    router.post('/accept/:userId', adminPageController.acceptUserApplication);
    

    // Define a route to handle the "Reject" action
    router.post('/reject/:userId', adminPageController.rejectUserApplication);
    
  

    router.get("/user_dashboard", loginController.checkLoggedIn, userPageController.getUserDashboard);

     
    router.get("/user_dashboard/new_application", userPageController.getNewApplicationPage);
  

    router.post('/user_dashboard/new_application', upload.fields ([
        { name: 'fileUpload1', maxCount: 1 },
        { name: 'fileUpload2', maxCount: 1 }
      ]), userPageController.sendNewApplication); 

    
    
    


    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);

    // Render the forgot-passsword form
    router.get('/forgot-password', (req, res) => {
        res.render('forgot-password', { message: req.flash('message') });
    });

    router.get('/reset-password/:token', resetEmailController.verifyToken, resetPasswordController.getResetPasswordPage);

    router.get('/logout', loginController.postLogOut, homePageController.getHomePage);

    router.post('/forgot-password', resetEmailController.sendResetPasswordLink); 

    router.post('/reset-password', resetPasswordController.updatePassword );


    return app.use("/", router);
};
module.exports = initWebRoutes;

    




