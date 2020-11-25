module.exports = {
    tableName: 'users',
    primaryKey: 'id',
    attributes: {
        email: {
            type: 'string',
            required: true,
            isEmail: true,
            unique: true
        },
        password: {
            type: 'String',
            required: true
        },
        class_id: {
            type: 'number', 
            required: false, 
            isInteger: true
        },
    },
    customToJSON() {
		// obviously never return password downstream to anyone, ever
		return _.omit(this, [
			'password',
		])
	},
}