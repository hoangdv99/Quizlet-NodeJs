const bcrypt = require("bcryptjs");
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
							username: decoded.username,
							id: decoded.id,
							email: decoded.email,
						},
						{ signed: true }
					);
					res.redirect("/");
				}
			} else {
				res.redirect("/lp");
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
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var confirmPassword = req.body.confirmPassword;
		var errors = [];
		if(username == ''){
			errors.push("Username requires!");
		}
		if(email == ''){
			errors.push("Email requires!");
		}
		if(password == ''){
			errors.push("Password requires!");
		}
		var existedEmail = await sails.models.user.find({
			email: email
		});
		if (existedEmail.length > 0) {
			errors.push("This email is in use.");
		}

		var existedUsername = await sails.models.user.find({
			username: username
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
						username: username,
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
		var username = req.body.username;
		var password = req.body.password;
		var errors = [];

		var user = await sails.models.user.findOne({ username: username });
		if (user) {
			if (bcrypt.compareSync(password, user.password)) {
				res.clearCookie('user', {path: '/'});
				res.cookie(
					"user",
					{
						id: user.id,
						username: user.username,
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
		res.clearCookie('user', {path: '/'});
		res.redirect("/login");
	},

};
