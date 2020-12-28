const { set } = require("grunt");
const { object } = require("underscore");

module.exports = {
    createFolder: async function (req, res) {
        var user = req.signedCookies.user;
        var folderTitle = req.body.folder_title;
        var folderDescription = req.body.folder_description;
        var newFolder = await sails.models.folder.create({
            user_id: user.id,
            title: folderTitle,
            description: folderDescription,
        }).fetch();
        res.redirect(`/${user.username}/folders/${newFolder.id}`);
    },

    getFolder: async function(req, res){
        var folderId = req.params.folderId;
        var folder = await sails.models.folder.findOne({ id: folderId });
        var setsInFolder = await sails.models.folder.findOne({ id: folderId }).populate('sets');
        var curUser = await sails.models.user.findOne({ username: req.signedCookies.user.username });
        var curUserSets = await sails.models.set.find({ user_id: curUser.id });
        var owner = await sails.models.user.findOne({id: folder.user_id });
        var notInFolder = [], curUserSetsTitle = [], setInFolderTitle = [], notInFolderSets = [];
        for(var i = 0; i < curUserSets.length; i++){
            curUserSetsTitle.push(curUserSets[i].title);
        }
        for (var i = 0; i < setsInFolder.sets.length; i++) {
            setInFolderTitle.push(setsInFolder.sets[i].title);
        }

        notInFolder = curUserSetsTitle.filter(object=>{
            return setInFolderTitle.indexOf(object) == -1;
        })
        
        for(var i = 0; i < notInFolder.length; i++){
            var notInFolderSet = await sails.models.set.findOne({title: notInFolder[i]});
            notInFolderSets.push(notInFolderSet);
        }

        return res.view('pages/folder', {
            user: req.signedCookies.user,
            owner: owner,
            folder: folder,
            setsInFolder: setsInFolder.sets,
            curUserSets: curUserSets,
            notInFolderSets: notInFolderSets
        });
    },

    addSets: async function(req, res){
        var folderId = req.body.folderId;
        var setsCheck = req.body.set;
        var user = await sails.models.user.findOne({username: req.signedCookies.user.username });
        var curUserSets = await sails.models.set.find({user_id: user.id});
        var setTitles = req.body.setTitle;

        for(var i = 0; i < setTitles.length; i++){
            if(setsCheck[i] === setTitles[i] || setsCheck === setTitles[i]){
                var set = await sails.models.set.findOne({title: setTitles[i]});
                await sails.models.folder.addToCollection(folderId, 'sets', set.id);
            }
        }
        res.redirect(`/${user.username}/folders/${folderId}`);
    },

    deleteFolder: async function (req, res) {
        var folderId = req.params.folderId;
        await sails.models.folder.destroy({ id: folderId });
        res.redirect(`/${req.signedCookies.user.username}/profile#folders`);
    },

    removeSet: async function(req, res){
        var folderId = req.params.folderId;
        var setId = req.params.setId;
        var user = await sails.models.user.findOne({username: req.signedCookies.user.username });
        await sails.models.folder.removeFromCollection(folderId, 'sets', setId);
        res.redirect(`/${user.username}/folders/${folderId}`);
    }
}