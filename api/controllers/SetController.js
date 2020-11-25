const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { globals } = require('../../config/globals');

module.exports = {
    getCreateSetPage: function(req, res){
        return res.view('pages/create-set');
    },

    createData: async function(req, res){
        let title = req.body.title;
        let description = req.body.description;
        let privacy = parseInt(req.body.privacy);
        let terms = req.body.term;
        let definitions = req.body.definition;
        let userId = -1;
        let folderId = -1;
        let errors = [];

        let existedSet = await sails.models.set.findOne({title: title});
        if(existedSet){
            errors.push("Set title existed!");
            return res.view('pages/create-set', {
                errors: errors,
                value: req.body
            });
        }else{
            let createdSet = await sails.models.set.create({
                user_id: userId,
                folder_id: folderId,
                title: title,
                description: description,
                privacy: privacy,
                process: 0
            }).fetch();
            for(var i = 0; i < terms.length; i++){
                let createdCard = await sails.models.card.create({
                    set_id: createdSet.id,
                    term: terms[i],
                    definition: definitions[i],
                    status: 1
                }); 
            }
            res.redirect('/');
        }
    }
}