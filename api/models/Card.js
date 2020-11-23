const { CardStatus } = require('../../config/globals');

module.exports = {
    tableName: 'cards',
    attributes: {
        set_id: {type: 'number', required: true, isInteger: true},
        term: {type: 'String', required: true, maxLength: 255},
        definition: {type: 'String', required: true, maxLength: 255},
        status: {
            type: 'number',
            isIn: [CardStatus.New, CardStatus.Seen, CardStatus.Remembered]
        }
    }
}