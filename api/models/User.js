module.exports = {
    tableName: 'users',
    attributes: {
        username: {type: 'String', unique: true, maxLength: 25},
        password: {type: 'String'},
        class_id: {type: 'number', required: false, isInteger: true},
        email: {
            type: 'String',
            required: true,
            unique: true,
            isEmail: true,
            maxLength: 25
        },
        token: {type: 'String'}
    }
}