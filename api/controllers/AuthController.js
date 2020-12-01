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
