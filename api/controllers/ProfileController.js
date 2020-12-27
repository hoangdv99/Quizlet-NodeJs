const { models } = require("../../config/models");

module.exports = {
    getProfile: async function(req, res) {
        let username = req.params.username;
        let loginUser = req.signedCookies.user;
        let profileUser = await sails.models.user.findOne({username: username});
        let sets = await sails.models.set.find({user_id: profileUser.id});
        let folders = await sails.models.folder.find({user_id: profileUser.id});

        res.view('pages/profile', {
            user: loginUser,
            sets: sets,
            folders: folders
        });
    }
}