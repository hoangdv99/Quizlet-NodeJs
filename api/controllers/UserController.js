const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { globals } = require('../../config/globals');

module.exports = {
    // signInToken: async function(req, res){
    //     const token = req.query._token;
    //     const jwtSecret = globals.jwtSecret;

    //     JWT.verify(token, jwtSecret, async (err, decoded, next) => {
    //         if(decoded){
    //             var existedUsername = await sails.models.user.findOne({username: decoded.username});
    //             if(existedUsername){
    //                 res.clearCookie('user');
    //                 res.cookie('user', {
    //                     id: decoded.id,
    //                     username: decoded.username,
    //                     email: decoded.email,
    //                     class_id: decoded.class_id
    //                 }, {
    //                     signed: true
    //                 });
    //                 res.redirect("/");
    //             }
    //         }else{
    //             res.redirect('/sign-in');
    //         }
    //     });
    // }
}