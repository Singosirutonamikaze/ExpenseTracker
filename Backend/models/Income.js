const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon: {
        type: String,
        required: false // Optional field for income icon
    },
    source: {
        type: String,
        required: true
    }, // exemple: Salarié ou Freelance etc.
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Income', IncomeSchema);