const mongoose = require('mongoose');

exports.connectDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGO_DB)
        console.log('db connection established');
    }catch(err){
        console.log(err.message);
    }
}