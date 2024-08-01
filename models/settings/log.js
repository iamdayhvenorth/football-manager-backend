const mongoose = require('mongoose');

const logSchema =  new mongoose.Schema({
    level: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
},{timestamps: true});
  

const Log = mongoose.model('Log', logSchema);
module.exports = Log;