const mongooes = require("mongoose");
const val = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const taskModel = require("./task");
const schemaStructure = require("../Schema_Structure/userStructure")
//-------------- Create schema------------------------
const userSchema = new mongooes.Schema(schemaStructure,{timestamps:true})
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