const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestCaseSchema = new Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    }
});

const TestCase = mongoose.model('TestCase', TestCaseSchema);

module.exports = TestCase;
