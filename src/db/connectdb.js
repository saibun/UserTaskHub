const mongooes = require('mongoose');
const conncetionUrl = 'mongodb://127.0.0.1/user-task-app';

async function connect() {
    try {
        await mongooes.connect(conncetionUrl);
        console.log("DB connected");

    }catch(err){
        console.log("Not Connected !");
    }
    

}
connect();