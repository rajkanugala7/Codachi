const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabSchema = new Schema({
    labName: {
        type: String,
        required: true
    },
    experiments: [{
        type: Schema.Types.ObjectId,
        ref: 'Experiment'  // List of Experiments in the lab
    }]
});

const Lab = mongoose.model('Lab', LabSchema);

module.exports = Lab;
