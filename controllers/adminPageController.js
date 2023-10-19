const DBConnection = require("../configs/connectDB");


let getAdminDashboard = (req,res) => {

    // Assuming you have a SQL query to fetch user data
    const sql =                 ` SELECT
    user_applications.id AS id,
    users.full_name AS fullname,
    users.email AS email,
    user_applications.university AS university,
    user_applications.major As major,
    user_applications.status AS status,
    user_applications.graduation_year AS graduation_year,
    user_applications.application_date AS application_date,
    user_applications.resume AS resume,
    user_applications.coverLetter AS coverLetter
    FROM
        users
    INNER JOIN
        user_applications
    ON
        users.id = user_applications.user_id`;


       

   // Execute the SQL query
   DBConnection.query(sql, (err, rows) => {
   if (err) {
   console.error('Error executing SQL query:', err);
   res.status(500).send('Internal Server Error');
   return;
   }
     // Pass the user data as a local variable to the EJS template
     res.render('admin_dashboard.ejs', { users: rows, numofApplications: rows.length });
   
    })
};

let acceptUserApplication = async (req, res) => {
    const userId = req.params.userId;

    // Update the status in the database to "ACCEPTED"
    try {
        await DBConnection.query('UPDATE user_applications SET status = "ACCEPTED" WHERE user_id = ?', [userId]);
        return res.status(200).json({ status: 'success', message: 'Application accepted' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Failed to accept the application' });
    }
}

let rejectUserApplication = async (req, res) => {
    const userId = req.params.userId;

    // Update the status in the database to "REJECTED"
    try {
        await DBConnection.query('UPDATE user_applications SET status = "REJECTED" WHERE user_id = ?', [userId]);
        res.status(200).json({ status: 'success', message: 'Application rejected' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to reject the application' });
    }
}



module.exports = {
    getAdminDashboard: getAdminDashboard,
    acceptUserApplication: acceptUserApplication,
    rejectUserApplication: rejectUserApplication
    
}