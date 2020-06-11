'use strict';

const { User } = require('../models');
const bcrypt = require('bcrypt');
const { checkPassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const googleVerification = require('../helpers/googleOauthApi.js');

class UserController {
    static register(req, res, next) {
        let { email, password } = req.body;

        User.create({
            email,
            password,
        })
            .then((result) => {
                res.status(201).json({
                    id: result.id,
                    email: result.email,
                });
            })
            .catch((err) => {
                next(err);
            });
    }

    static login(req, res, next) {
        const user = {
            email: req.body.email,
            password: req.body.password,
        };
        User.findOne({ where: { email: user.email } })
            .then((dbUser) => {
                if (dbUser && bcrypt.compareSync(user.password, dbUser.password)) {
                    const accessToken = generateToken({ id: dbUser.id, email: dbUser.email });
                    res.status(200).json({ token: accessToken });
                } else {
                    next({ name: 'LOGIN_FAIL' });
                }
            })
            .catch((e) => next(e));
        // let { email, password } = req.body;

        // User.findOne({
        //     where: {
        //         email,
        //     },
        // })
        //     .then((result) => {
        //         if (result) {
        //             let compare = checkPassword(password, result.password);

        //             if (compare) {
        //                 let token = generateToken({
        //                     id: result.id,
        //                     email: result.email,
        //                 });
        //                 res.status(200).json({
        //                     token,
        //                 });
        //             } else {
        //                 next('LOGIN_FAIL');
        //             }
        //         } else {
        //             next('LOGIN_FAIL');
        //         }
        //     })
        //     .catch((err) => {
        //         next(err);
        //     });
    }

    static google(req, res, next) {
        let google_token = req.headers.google_token;
        let email = null;
        let newUser = false;

        googleVerification(google_token)
            .then((payload) => {
                email = payload.email;
                console.log(email);
                return User.findOne({
                    where: {
                        email,
                    },
                });
            })
            .then((user) => {
                if (user) {
                    return user;
                } else {
                    newUser = true;
                    return User.create({
                        email,
                        password: process.env.DEFAULT_GOOGLE_PASSWORD,
                    });
                }
            })
            .then((user) => {
                let code = newUser ? 201 : 200;

                const token = generateToken({
                    id: user.id,
                    email: user.email,
                });

                res.status(code).json({
                    token,
                });
            })
            .catch((err) => {
                next(err);
            });
    }
}

module.exports = UserController;
