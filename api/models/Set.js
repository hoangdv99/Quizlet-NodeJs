const { PrivacyConst } = require('../../config/globals');

module.exports = {
    tableName: 'profiles',
    attributes: {
        user_id: {type: 'number', required: true, isInteger: true},
        folder_id: {type: 'number', required: true, isInteger: true},
        title: {type: 'String', required: true, maxLength: 255},
        description: {type: 'String', required: true, maxLength: 255},
        privacy: {
            type: 'number',
            isIn: [PrivacyConst.Public, PrivacyConst.Private]
        }
    }
}