const DBConnection = require("./../configs/connectDB");
const bcrypt = require("bcrypt");

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            // check email is exist or not
            let isEmailExist = await checkExistEmail(data.email);
            if (isEmailExist) {
                reject(`This email "${data.email}" has already exist. Please choose an other email`);
            } else {
                // hash password
                let salt = bcrypt.genSaltSync(10);
                let userItem = {
                    fullname: data.fullname,
                    email: data.email,
                    password: bcrypt.hashSync(data.password, salt)
                };

                //console.log(data);

                //create a new account
                DBConnection.query(
                    ' INSERT INTO users (full_name, email, password) VALUES(?,?,?) ',
                    [userItem.fullname, userItem.email, userItem.password],
                    function(err, rows) {
                        if (err) {
                            reject(false)
                        }
                        resolve("Create a new user successful");
                    }
                );
            }
        }
        catch(err){
            reject(err);
        }
    });
};


let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
       
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `email` = ?  ', email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows && rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
  
    });
};

let updateUserPassword = (email,password) => {
    return new Promise( (resolve, reject) => {
       
            DBConnection.query(
                ` UPDATE users SET password = ${password} WHERE email = ? `, email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows && rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
  
    });
};
module.exports = {
    createNewUser: createNewUser,
    updateUserPassword: updateUserPassword,
    checkExistEmail: checkExistEmail
};