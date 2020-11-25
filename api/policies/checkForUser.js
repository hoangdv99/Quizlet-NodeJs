module.exports = function(req, res, next) {
	sails.helpers.verifyToken({
		req: req,
		res: res
	})
	.switch({
		error: function(err) {
			return res.serverError(err)
		},
		invalid: function(err) {
			// no token, no problem -- just continue in a logged-out state
			return next()
		},
		success: function() {
			// user has been attached to the req object (ie logged in) so that's cool too
			return next()
		}
	})
}