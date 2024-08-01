const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
},
},{timestamps: true});

const activitySchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
},
  date: { 
    type: Date, 
    default: Date.now 
}
});

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    notes: [noteSchema],
    activities: [activitySchema]
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
