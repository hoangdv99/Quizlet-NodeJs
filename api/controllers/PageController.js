module.exports = {
	home: function (req, res) {
		return res.view('pages/homepage');
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