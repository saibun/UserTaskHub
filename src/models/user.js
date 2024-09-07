const mongooes = require("mongoose");
const val = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const taskModel = require("./task");
//-------------- Create schema------------------------
const userSchema = new mongooes.Schema({
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
})
//---------Virtual property------------
userSchema.virtual('tasks',{
    ref:"Task",
    localField:"_id",
    foreignField:"author",
})
//-------- Hide Private data-----------------
userSchema.methods.toJSON= function(){
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
}
//--------Token generate------------------
userSchema.methods.getAuthToken = async function(){
    const user=this;
    try {
        const token = await jwt.sign({ _id:user._id.toString() }, 'userToken');
        user.tokens = user.tokens.concat({token});
        await user.save()
        return token;

    }catch(err){
        throw new Error(err);
    }
    
}

//---------- User Login Check----------------------------------------
userSchema.statics.findCredentials = async function (email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Error("Email problem!");
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        throw new Error("Credential mismatch !");
    }
    return user;

}

//---------------Password Encryption---------------------------------
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        try {
            user.password = await bcrypt.hash(user.password, 8);
        } catch (error) {
            return next(error); // Pass error to next if hashing fails
        }
    }
    next();
})
//middleware remove all user's task after delete that user.
userSchema.pre("remove",async function(){
    const user = this;
    await taskModel.deleteAll({author:user._id});
})

//creating model
const userModel = new mongooes.model('User', userSchema);

//export the model
module.exports = userModel