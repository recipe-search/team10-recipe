'use strict';

const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = (req, res, next) => {
    let token = req.headers.token;

    try {
        let decoded = verifyToken(token);
        let { id, email } = decoded;

        User.findByPk(id)
            .then((result) => {
                if (result) {
                    req.currentUserId = id;
                    req.currentUserEmail = email;
                    next();
                } else {
                    throw {
                        msg: 'Please login first',
                        code: 401,
                    };
                }
            })
            .catch((err) => {
                next(err);
            });
    } catch (error) {
        next(error);
    }
};

const emailAuthorization = (req, res, next) => {};

module.exports = { authentication, emailAuthorization };
