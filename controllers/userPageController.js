const userPageModel = require("../models/userPageModel");



let getUserDashboard = (req, res) => {

     // Assuming you have the user id in req.user.id
     const userId = req.user.id;

     userPageModel.getUserData(userId, (result) => {
         if (result.err) {
             // Handle the error
             console.error(result.err);
             return res.status(500).send("Database error");
         }
 
         if (!result.user) {
             // Handle the case where the user object is undefined or null
             return res.status(404).send("User not found");
         }
 
         // The user object is defined, render the template with user data
         return res.render('user_dashboard.ejs', { user: result.user, userapplications: result.userapplications,  rowCount: result.rowCount });
     });

}
   
let getNewApplicationPage = (req, res) => {


    // Assuming you have the user id in req.user.id
     const userId = req.user.id;

     userPageModel.getUserData(userId, (result) => {
         if (result.err) {
             // Handle the error
             console.error(result.err);
             return res.status(500).send("Database error");
         }
 
         if (!result.user) {
             // Handle the case where the user object is undefined or null
             return res.status(404).send("User not found");
         }
 
         // The user object is defined, render the template with user data
         return res.render('new_application.ejs', { user: result.user, rowCount: result.rowCount });
     });




}

let sendNewApplication = (req, res) => {

    // create new application
    const newApplicationData = {

        userId : req.user.id,
        uniname : req.body.uniname,
        major : req.body.major,
        graduation_year : req.body.graduation_year,
        resume: req.files.fileUpload1[0].filename,
        coverLetter: req.files.fileUpload2[0].filename
        

    };


    // Object.keys(files).forEach(key=>

    //     files[key].mv(path.join(__dirname,'uploads', files[key].name), (err)=>{

    //         if(err) return res.status(500).send(err);


            try{    
                userPageModel.createNewUserApplication(newApplicationData);
                return res.redirect('/user_dashboard/new_application');
            }
            catch(err){
                request.flash('error',err);
                return res.redirect('/user_dashboard/new_application');
            }


    //     });
        
    // });

    




};

module.exports = {
    getUserDashboard: getUserDashboard,
    getNewApplicationPage: getNewApplicationPage,
    sendNewApplication : sendNewApplication
}
