config = require('../config/config');
const pool = require('../config/database')
module.exports.authenticate = (email, callback) => {
    let userLoginQuery = `SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
    FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`;
        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;

            } else {
                try {
                    connection.query(userLoginQuery, [email], (err, rows) => {
                        if (err) {
                            if (err) return callback(err, null);

                        } else {
                            if (rows.length == 1) {
                                console.log(rows);
                                return callback(null, rows);

                            } else {

                                return callback('Login has failed', null);
                            }
                        }
                        connection.release();

                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        }); //End of getConnection

    } //End of authenticate