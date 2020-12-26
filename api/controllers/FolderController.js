// module.exports = {
//     createFolder: async function(req, res){
//         var user = req.signedCookies.user;
//         var folderTitle = req.body.folder_title;
//         var folderDescription = req.body.folder_description;
//         var errors = [];

//         if(folderTitle === ""){
//             errors.push("Title is required!");
//         }
//         if(sails.models.folders.findOne({title: req.body.folder_title})){
//             errors.push("Folder's title existed!");
//         }
//         if()
//     }
// }