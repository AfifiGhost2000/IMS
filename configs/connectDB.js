const mysql = require('mysql');
const fs = require('fs');

// let pool = mysql.createPool({
//     host: 'ims-app-database.mysql.database.azure.com',
//     user: 'imsroot',
//     password: 'Eldushi123',
//     database: 'ims',
//     connectionLimit: 10, // Adjust as needed,
//     ssl: {
//       ca: fs.readFileSync("C:/Users/abdul/Downloads/DigiCertGlobalRootCA.crt (1).pem") // Certificate Authority file
      
//   }
// });

// // Define the callback function
// function cb(err, data) {
//     if (err) {
//         console.error("An error occurred:", err);
//     } else {
//         console.log("Query result:", data);
//     }
// }

// // Get a connection from the pool
// pool.getConnection(function(err, connection) {
//     if (err) {
//         throw err; // Handle connection error
//     }

//     console.log('Database connected!');

//     connection.changeUser({database : "ims"});
//         connection.query("SELECT * from users", function(err, data){
//         // Release the connection back to the pool when done
//         connection.release();
//         cb(err, data);
//         });


// });

// module.exports = pool;

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'ims_sys',
    multipleStatements: true, // Enable multiple statements
    
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});

module.exports = connection;
