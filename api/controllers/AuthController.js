// var bcrypt = require('bcryptjs')
// var jwt = require('jsonwebtoken')
// var emailValidator = require('email-validator');
// var {globals} = require('../../config/globals');
// module.exports = {
// 	// patch /api/users/login
// 	login: async function(req, res) {
// 		var errors = [];
// 		var user = await sails.models.user.findOne({
// 			email: req.body.email
// 		})
// 		if (!user){
// 			errors.push("Wrong email or password");
// 		}else{
// 			await bcrypt.compare(req.body.password, user.password, function(err){
// 				if(err){
// 					errors.push("Wrong account or password!");
// 				}else{
// 					// if no errors were thrown, then grant them a new token
// 					// set these config vars in config/local.js, or preferably in config/env/production.js as an environment variable
// 					var token = jwt.sign({user: user.id}, globals.jwtSecret, {expiresIn: globals.jwtExpires})
// 					// set a cookie on the client side that they can't modify unless they sign out (just for web apps)
// 					res.cookie('sailsjwt', token, {
// 						signed: true,
// 						// domain: '.yourdomain.com', // always use this in production to whitelist your domain
// 						maxAge: 365 * 24 * 60 * 60
// 					})
// 					// provide the token to the client in case they want to store it locally to use in the header (eg mobile/desktop apps)
// 					return res.ok(token)
// 				}
// 			});
// 		}
// 		if(errors.length !== 0){
// 			return res.view('pages/login', {
// 				layout: null,
// 				errors: errors
// 			});
// 		}
// 	},

// 	// patch /api/users/logout
// 	logout: function(req, res) {
// 		res.clearCookie('sailsjwt')
// 		req.user = null
// 		return res.ok()
// 	},

// 	// post /api/users/register
// 	register: async function(req, res) {
// 		var errors = [];
// 		var email = req.body.email;
// 		var password = req.body.password;
// 		var confirmPassword = req.body.confirmPassword;

// 		if(email === ''){
// 			errors.push("An email is required.")
// 		}

// 		if(password === ''){
// 			errors.push("A password is required.");
// 		}

// 		if (password.length < 8) {
// 			errors.push('Password must be at least 8 characters.')
// 		}

// 		if(password !== confirmPassword){
// 			errors.push('Passwords do not match!');
// 		}

// 		if((emailValidator.validate(email)) === false){
// 			errors.push('Doesn\'t look like an email address.');
// 		}

// 		if(await sails.models.user.findOne({ email: email })){
// 			errors.push('Email already in use.');
// 		}

// 		if(errors.length !== 0){
// 			res.view('pages/register', {
// 				layout: null,
// 				errors: errors,
// 				value: req.body
// 			});
// 		}else{
// 			var hashedPassword = await bcrypt.hash(password, 10);
// 			var user = await sails.models.user.create({
// 				email: email,
// 				password: hashedPassword
// 			}).fetch();

// 			var token = jwt.sign({user: user.id}, globals.jwtSecret, {expiresIn: globals.jwtExpires});
// 			res.cookie('sailsjwt', token, {
// 				signed: true,
// 				// domain: '.yourdomain.com', // always use this in production to whitelist your domain
// 				maxAge: 365 * 24 * 60 * 60
// 			});
// 			// if this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
// 				// send a 200 response letting the user agent know the signup was successful.
// 			if (req.wantsJSON) {
// 				return res.ok(token)
// 			}
// 			return res.redirect('/');
// 		}
// 	}
// }
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
var JWT = require('jsonwebtoken');
const { globals } = require("../../config/globals");

module.exports = {
	signInToken: async function (req, res) {
		const token = req.query._token;
		const jwtSecret = globals.jwtSecret;
		JWT.verify(token, jwtSecret, async (err, decoded, next) => {
			if (decoded) {
				var existedUsername = await sails.models.user.find({ username: decoded.username });
				if (existedUsername.length > 0) {
					res.clearCookie("user");
					res.cookie(
						"user",
						{
							id: decoded.id,
							email: decoded.email,
						},
						{ signed: true }
					);
					res.redirect("/");
				}
			} else {
				res.redirect("/login");
			}
		});
	},

	// getSignup: async function (req, res) {
	// 	var token = req.param("token");
	// 	if (token) {
	// 		var user = await sails.models.user.findOne({ token: token })
	// 	}
	// 	res.view("pages/register", {
	// 		errors: null,
	// 		user: user
	// 	});
	// },

	register: async function (req, res) {
		var email = req.body.email;
		var password = req.body.password;
		var confirmPassword = req.body.confirmPassword;
		var errors = [];

		var existedUsername = await sails.models.user.find({
			email: email
		});
		if (existedUsername.length > 0) {
			errors.push("This email is in use.");
		}

		if (password !== confirmPassword) {
			errors.push("Passwords do not match.");
		}
		if (errors.length !== 0) {
			res.view("pages/register", {
				layout: null,
				errors: errors,
			});
		} else {
			bcrypt.genSalt(10, function (err, salt) {
				bcrypt.hash(password, salt, async function (err, hash) {
					if (err) {
						console.log(err);
					}
					password = hash;
					await sails.models.user.create({
						email: email,
						password: password,
					}
					);
				});
			});
			res.redirect("/login");
		}
	},

	login: async function (req, res) {
		var email = req.body.email;
		var password = req.body.password;
		var errors = [];

		var user = await sails.models.user.findOne({ email: email });
		if (user) {
			if (bcrypt.compareSync(password, user.password)) {
				res.clearCookie("user");
				res.cookie(
					"user",
					{
						id: user.id,
						email: user.email,
					},
					{ signed: true }
				);
				res.redirect('/');
			} else {
				errors.push("The password is incorrect");
			}
		} else {
			errors.push("The account does not exist");
		}
		if (errors.length > 0) {
			res.view("pages/login", {
				layout: null,
				errors: errors,
			});
		}
	},

	logout: function (req, res) {
		res.clearCookie("user");
		res.redirect("/login");
	},

};
