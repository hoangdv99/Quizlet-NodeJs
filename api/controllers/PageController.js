module.exports = {
	home: async function (req, res) {
		let user = req.signedCookies.user;
		let sets = await sails.models.set.find({ user_id: user.id }).sort([
			{createdAt: 'ASC'}
		]);
		let countTerms = [];
		
		for(var i = 0; i < sets.length; i++){
			countTerms[i] = await sails.models.card.count({set_id: sets[i].id});
		}

		res.view("pages/homepage", {
			user: user,
			sets: sets,
			countTerms: countTerms
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
	},
	getStarted: function(req, res){
		return res.view('pages/lp', {layout: null});
	}
}