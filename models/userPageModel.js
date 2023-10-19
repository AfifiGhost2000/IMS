const DBConnection = require("../configs/connectDB");


let getUserData = (userId, callback) => {
    const sql = `
        SELECT
            users.id AS id,
            users.full_name AS fullname,
            DATE_FORMAT(user_applications.application_date, '%d/%m/%Y') AS application_date,
            user_applications.status AS status
        FROM
            users
        LEFT JOIN
            user_applications
        ON
            users.id = user_applications.user_id
        WHERE users.id = ?;

        SELECT COUNT(*) AS row_count
        FROM user_applications
        WHERE user_id = ?;
    `;

    // Query the database with multiStatements option
    DBConnection.query(sql, [userId, userId], (err, results) => {
        if (err) {
            // Handle the database query error
            console.error(err);
            return callback({err:err, user:null, userapplications:null, rowCount:null});
        }

        // `results` will contain an array of result sets, one for each statement
        if (results.length !== 2) {
            // Check if both result sets are present
            return callback({err:"Data not found", user:null, userapplications:null, rowCount:null});
        }

        const user = results[0][0]; // First result set
        const userapplications = results[0]; // Array of First result set
        const rowCount = results[1][0].row_count; // Second result set

        return callback({err:null, user:user, userapplications:userapplications, rowCount:rowCount});
    });
}




let createNewUserApplication = (data, callback) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userInfo = {
                userId: data.userId,
                uniname: data.uniname,
                major: data.major,
                graduation_year: data.graduation_year,
                resume: data.resume,
                coverLetter: data.coverLetter
            }

            // Get the current date in JavaScript
            //const currentDate = new Date();

            // Create a function to format the date as "d/m/y"
            // function formatDate(date) {
            //     const day = date.getDate();
            //     const month = date.getMonth() + 1; // Months are zero-based
            //     const year = date.getFullYear();

            //     // Ensure that day and month have two digits
            //     const formattedDay = day < 10 ? `0${day}` : day;
            //     const formattedMonth = month < 10 ? `0${month}` : month;

            //     return `${formattedDay}/${formattedMonth}/${year}`;
            // }

            // Format the current date
            //const CURDATE = formatDate(currentDate);

            const CURDATE = new Date().toISOString().slice(0, 19).replace('T', ' ');
    


                    // File uploaded successfully, now insert into the database
                    // Create new user application
                    DBConnection.query(
                        `INSERT INTO user_applications (user_id, university, major, status, graduation_year, application_date, resume, coverLetter) 
                        VALUES (?,?,?,?,?,?,?,?)`,
                        [userInfo.userId, userInfo.uniname, userInfo.major, 'PENDING', userInfo.graduation_year, CURDATE, userInfo.resume, userInfo.coverLetter],
                        function (err, rows) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve("Application created successfully");
                            }
                        }
                    );
                
        }
        catch (err) {
            reject(err);
        }
       
    });
}


module.exports = {
    getUserData: getUserData,
    createNewUserApplication: createNewUserApplication
}
