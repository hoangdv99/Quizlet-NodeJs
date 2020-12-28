const { PrivacyConst } = require('../../config/globals');

module.exports = {
    tableName: 'sets',
    attributes: {
        user_id: {type: 'number', required: true, isInteger: true},
        title: {type: 'String', required: true, maxLength: 255},
        description: {type: 'String', required: true, maxLength: 255},
        privacy: {
            type: 'number',
            isIn: [PrivacyConst.Public, PrivacyConst.Private]
        },
        progress: {type: 'number', required: true, isInteger: true},
        folders: {
            collection: 'Folder',
            via: 'sets'
        }
    }
}