module.exports = {
    tableName: 'folders',
    attributes: {
        title: {type: 'String', required: true, maxLength: 255},
        description: {type: 'String', required: true, maxLength: 255},
        user_id: {type: 'number', required: true, isInteger: true}
    }
}
