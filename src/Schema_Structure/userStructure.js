const val = require('validator');
const schemaStructure = {
    user_name: {
        type: 'string',
        required: true,
        trim: true,
        uppercase: true,
        minLength: 2,
        maxLength: 50
    },
    age: {
        type: 'number',
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positiove number");

            }
            if (typeof (value) === 'string') {
                throw new Error('Age must be a number');
            }


        }


    },
    email: {
        type: 'string',
        //validate email
        unique: true,
        required: true,
        validate(value) {
            if (!val.isEmail(value)) {
                throw new Error('Provided a valid Email ID')
            }

        }


    },
    password: {
        type: 'string',

        required: true,
        trim: true,
        minLength: 5,
        //validate password. make sure that password can't be the password itself
        validate(value) {
            let check_user_password = value.toLowerCase();
            if (check_user_password === 'password' || check_user_password.includes('password')) {
                throw new Error("Password cannot contain password.")
            }
        }
    },
    tokens:[{
        token:{
            type:"string",
            required:true
        }
    }]
}

module.exports = schemaStructure;