const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = new Schema({
   
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Experiment', // Reference to the Experiment model (questions for this set)
        required: true
    }]
});

const Set = mongoose.model('Set', SetSchema);

module.exports = Set;
