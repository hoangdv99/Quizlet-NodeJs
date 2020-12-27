
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
module.exports = {
    getCreateSet: async function (req, res) {
        var currentUser = req.signedCookies.user;
        return res.view('pages/create-set', {
            user: currentUser
        });
    },
    getEditSet: async function (req, res) {
        var currentUser = req.signedCookies.user;
        var set = await sails.models.set.findOne({ title: req.params.title });
        var cards = await sails.models.card.find({ set_id: set.id });
        res.view('pages/edit-set', {
            user: currentUser,
            set: set,
            cards: cards
        });
    },
    getSetLearn: async function (req, res) {
        var title = req.params.title;
        var set = await sails.models.set.findOne({ title: title });
        var cards = await sails.models.card.find({ set_id: set.id });
        var globals = require('../../config/globals');
        var owner = await sails.models.user.findOne({ id: set.user_id });

        var quizzes = []
        //create learn quizzes
        var terms = [], definitions = [];
        for(var i = 0; i < cards.length; i++){
            terms.push(cards[i].term);
            definitions.push(cards[i].definition);
        }
        for(var i = 0; i < terms.length; i++){
            var answers = [], count = 0, answerTexts = [];
            var answer = {
                text: terms[i],
                correct: true
            }
            answers.push(answer);
            answerTexts.push(terms[i]);
            while(count < 3){
                var randomTerm = terms[Math.floor(Math.random() * terms.length)];
                if(!answerTexts.includes(randomTerm)){
                    answer = {
                        text: randomTerm,
                        correct: false
                    }
                    answerTexts.push(randomTerm);
                    answers.push(answer);
                    count++;
                }
            }
            var quiz = {
                question: definitions[i],
                answers: shuffle(answers),
                status: 0
            }
            quizzes.push(quiz);
        }

        return res.view('pages/learn', {
            user: req.signedCookies.user,
            cards: cards,
            set: set,
            globals: globals,
            owner: owner,
            quizzes: shuffle(quizzes)
        });
    },

    getTest: async function(req, res){
        var title = req.params.title;
        var set = await sails.models.set.findOne({ title: title });
        var cards = await sails.models.card.find({ set_id: set.id });
        var globals = require('../../config/globals');
        var owner = await sails.models.user.findOne({ id: set.user_id });

        var quizzes = []
        //create learn quizzes
        var terms = [], definitions = [];
        for(var i = 0; i < cards.length; i++){
            terms.push(cards[i].term);
            definitions.push(cards[i].definition);
        }
        for(var i = 0; i < terms.length; i++){
            var answers = [], count = 0, answerTexts = [];
            var answer = {
                text: definitions[i],
                correct: true
            }
            answers.push(answer);
            answerTexts.push(definitions[i]);
            while(count < 3){
                var randomDef = definitions[Math.floor(Math.random() * definitions.length)];
                if(!answerTexts.includes(randomDef)){
                    answer = {
                        text: randomDef,
                        correct: false
                    }
                    answerTexts.push(randomDef);
                    answers.push(answer);
                    count++;
                }
            }
            shuffle(answers);
            var quiz = {
                question: terms[i],
                answers: answers
            }
            quizzes.push(quiz);
        }
        return res.view('pages/test', {
            user: req.signedCookies.user,
            cards: cards,
            set: set,
            globals: globals,
            owner: owner,
            quizzes: shuffle(quizzes)
        });
    },

    getWrite: async function(req, res){
        var title = req.params.title;
        var set = await sails.models.set.findOne({ title: title });
        var cards = await sails.models.card.find({ set_id: set.id });
        var globals = require('../../config/globals');
        var owner = await sails.models.user.findOne({ id: set.user_id });

        return res.view('pages/write', {
            user: req.signedCookies.user,
            cards: shuffle(cards),
            set: set,
            globals: globals,
            owner: owner,
        });
    },

    postEditSet: async function (req, res) {
        let oldTitle = req.params.title;
        let title = req.body.title;
        let description = req.body.description;
        let privacy = parseInt(req.body.privacy);
        let terms = req.body.term;
        let definitions = req.body.definition;
        let folderId = -1;
        let errors = [];
        let user = req.signedCookies.user;
        let set = await sails.models.set.findOne({ title: oldTitle });
        var cards = await sails.models.card.find({ set_id: set.id });
        let existedSet = await sails.models.set.findOne({ title: title });
        if (existedSet) {
            errors.push("Set title existed!");
            return res.view('pages/edit-set', {
                errors: errors,
                set: set,
                user: user,
                cards: cards
            });
        } else {
            await sails.models.set.updateOne({ title: oldTitle }).set({
                folder_id: folderId,
                title: title,
                description: description,
                privacy: privacy,
                progress: 0
            });

            await sails.models.card.destroy({ set_id: set.id });
            console.log(set.id);
            for (var i = 0; i < terms.length; i++) {
                await sails.models.card.create({
                    set_id: set.id,
                    term: terms[i],
                    definition: definitions[i],
                    status: 1
                });
            }
            res.redirect(`/${user.username}/${title}`);
        }
    },

    createData: async function (req, res) {
        let title = req.body.title;
        let description = req.body.description;
        let privacy = parseInt(req.body.privacy);
        let terms = req.body.term;
        let definitions = req.body.definition;
        let folderId = -1;
        let errors = [];
        let user = req.signedCookies.user;

        let existedSet = await sails.models.set.findOne({ title: title });
        if (existedSet) {
            errors.push("Set title existed!");
        }
        if(title === ''){
            errors.push('Title requires!');
        }
        if(description === ''){
            errors.push('Description requires!');
        }
        if(terms.includes('') || definitions.includes('')){
            errors.push("Terms and definition require!");
        }
        if(terms.length < 4){
            errors.push("Set must have 4 cards least!");
        }
        if(errors.length > 0){
            return res.view('pages/create-set', {
                errors: errors,
                value: req.body,
                user: user
            });
        } else {
            let createdSet = await sails.models.set.create({
                user_id: user.id,
                folder_id: folderId,
                title: title,
                description: description,
                privacy: privacy,
                progress: 0
            }).fetch();
            for (var i = 0; i < terms.length; i++) {
                let createdCard = await sails.models.card.create({
                    set_id: createdSet.id,
                    term: terms[i],
                    definition: definitions[i],
                    status: 1
                });
            }
            res.redirect(`/${user.username}/${title}`);
        }
    },
    getSet: async function (req, res) {
        var title = req.params.title;
        var set = await sails.models.set.findOne({ title: title });
        var cards = await sails.models.card.find({ set_id: set.id });
        var globals = require('../../config/globals');
        var owner = await sails.models.user.findOne({ id: set.user_id });
        console.log(owner);
        console.log(req.signedCookies.user);
        if (req.signedCookies.user.username != owner.username && set.privacy === globals.PrivacyConst.Private) {
            res.view('pages/protected-set', {
                user: req.signedCookies.user
            });
        } else {
            res.view('pages/set', {
                user: req.signedCookies.user,
                cards: cards,
                set: set,
                globals: globals,
                owner: owner
            });
        }
    },

    deleteSet: async function (req, res) {
        var title = req.params.title;
        await sails.models.set.destroy({ title: title });
        res.redirect(`/${req.signedCookies.user.username}/profile#created`);
    }
}