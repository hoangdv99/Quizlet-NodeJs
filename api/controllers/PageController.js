module.exports = {
	home: function (req, res) {
		let user = req.signedCookies.user;
		res.view("pages/homepage", {
			user: user
		})
	},

	login: function(req, res) {
		if (req.user) return res.redirect('pages/homepage')
		return res.view('pages/login', {layout: null})
	},

	register: function(req, res) {
		return res.view('pages/register', {layout: null})
	},

	profile: function(req, res) {
		return res.view('pages/profile')
	}
}