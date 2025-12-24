const mongoose = require("mongoose");

// Define a schema for your email records
const emailRecordSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Company: {
        type: String,
        required: true
    },
    sent: { type: Boolean, default: false }
});

const EmailRecord = mongoose.model('HR1847REC', emailRecordSchema);

module.exports = EmailRecord;