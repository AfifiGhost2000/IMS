const DBConnection = require("../configs/connectDB");
const bcrypt = require("bcrypt");

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if email exists
            let user = await findUserByEmail(email);

            if (user) {
                // Compare password
                await bcrypt.compare(password, user.password).then((isMatch) => {
                    if (isMatch) {
                        updateUserLoginByEmail(email);
                        resolve(true);
                    } else {
                        reject(`The password that you've entered is incorrect`);
                    }
                });
            } else {
                reject(`This user email "${email}" doesn't exist`);
            }
        } catch (error) {
            reject(error); // Handle any unexpected errors
        }
    });
};



let findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `email` = ?  ', email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let updateUserLoginByEmail = (email) => {
    try {
        DBConnection.query(
            'UPDATE `users` SET `updated_at` = NOW() WHERE `email` = ?',
            [email], // Pass the email as an array of parameters
            function (err, results) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Updated updated_at for user with email: ${email}`);
                }
            }
        );
    } catch (err) {
        console.error(err);
    }
};


let findUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `id` = ?  ', id,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, userObject) => {
    return new Promise(async (resolve, reject) => {
        try {
            await bcrypt.compare(password, userObject.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`The password that you've entered is incorrect`);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleLogin: handleLogin,
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    comparePassword: comparePassword
};