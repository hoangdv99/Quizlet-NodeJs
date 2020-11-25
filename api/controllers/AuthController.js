var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var Emailaddresses = require('machinepack-emailaddresses')
var {globals} = require('../../config/globals');
module.exports = {
	// patch /api/users/login
	login: async function(req, res) {
		var errors = [];
		var user = await sails.models.user.findOne({
			email: req.body.email
		})
		if (!user){
			errors.push("Wrong email or password");
		}else{
			await bcrypt.compare(req.body.password, user.password, function(err){
				if(err){
					errors.push("Wrong account or password!");
				}else{
					// if no errors were thrown, then grant them a new token
					// set these config vars in config/local.js, or preferably in config/env/production.js as an environment variable
					var token = jwt.sign({user: user.id}, globals.jwtSecret, {expiresIn: globals.jwtExpires})
					// set a cookie on the client side that they can't modify unless they sign out (just for web apps)
					res.cookie('sailsjwt', token, {
						signed: true,
						// domain: '.yourdomain.com', // always use this in production to whitelist your domain
						maxAge: globals.jwtExpires
					})
					// provide the token to the client in case they want to store it locally to use in the header (eg mobile/desktop apps)
					return res.ok(token)
				}
			});
		}
		if(errors.length !== 0){
			return res.view('pages/login', {
				layout: null,
				errors: errors
			});
		}
	},

	// patch /api/users/logout
	logout: function(req, res) {
		res.clearCookie('sailsjwt')
		req.user = null
		return res.ok()
	},

	// post /api/users/register
	register: function(req, res) {
		if (_.isUndefined(req.body.email)) {
			return res.badRequest('An email is required.')
		}

		if (_.isUndefined(req.body.password)) {
			return res.badRequest('A password is required.')
		}

		if (req.body.password.length < 8) {
			return res.badRequest('Password must be at least 8 characters.')
		}

		Emailaddresses.validate({
			string: req.body.password,
		}).exec({
			error: function(err) {
				return res.serverError(err)
			},
			invalid: function() {
				return res.badRequest('Doesn\'t look like an email address.')
			},
			success: async function() {
				var user = await sails.helpers.createUser({
					email: req.body.email,
					password: req.body.password,
				})

				// after creating a user record, log them in at the same time by issuing their first jwt token and setting a cookie
				var token = jwt.sign({user: user.id}, globals.jwtSecret, {expiresIn: globals.jwtExpires})
				res.cookie('sailsjwt', token, {
					signed: true,
					// domain: '.yourdomain.com', // always use this in production to whitelist your domain
					maxAge: globals.jwtExpires
				})

				// if this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
				// send a 200 response letting the user agent know the signup was successful.
				if (req.wantsJSON) {
					return res.ok(token)
				}

				// otherwise if this is an HTML-wanting browser, redirect to /welcome.
				return res.redirect('/')
			}
		})
	},
}