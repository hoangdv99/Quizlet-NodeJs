module.exports = {
    createFolder: async function (req, res) {
        var user = req.signedCookies.user;
        var folderTitle = req.body.folder_title;
        var folderDescription = req.body.folder_description;

        var newFolder = await sails.models.folder.create({
            user_id: user.id,
            title: folderTitle,
            description: folderDescription
        }).fetch();
        res.redirect(`/${user.username}/folders/${newFolder.id}`);
    },

    getFolder: async function(req, res){
        var folderId = req.params.folderId;
        var folder = await sails.models.folder.findOne({ id: folderId });
        var setsInFolder = await sails.models.set.find({ folder_id: folderId });
        var curUser = await sails.models.user.findOne({ username: req.signedCookies.user.username });
        var curUserSets = await sails.models.set.find({ user_id: curUser.id });
        var owner = await sails.models.user.findOne({id: folder.user_id });
        return res.view('pages/folder', {
            user: req.signedCookies.user,
            owner: owner,
            folder: folder,
            setsInFolder: setsInFolder,
            curUserSets: curUserSets
        });
    },

    addSets: async function(req, res){
        var folderId = req.body.folderId;
        var setsCheck = req.body.set;
        var user = await sails.models.user.findOne({username: req.signedCookies.user.username });
        var curUserSets = await sails.models.set.find({user_id: user.id});

        for(var i = 0; i < curUserSets.length; i++){
            if(setsCheck[i] === 'on'){
                await sails.models.set.updateOne({id: curUserSets[i].id}).set({folder_id: folderId});
            }
        }
        res.redirect(`/${user.username}/folders/${folderId}`);
    },

    deleteFolder: async function (req, res) {
        var folderId = req.params.folderId;
        await sails.models.folder.destroy({ id: folderId });
        res.redirect(`/${req.signedCookies.user.username}/profile#folders`);
    }
}