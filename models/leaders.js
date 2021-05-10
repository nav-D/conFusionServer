var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var leaderSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        required: true,
        type: String
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        default: ''    
    },
    description: {
        type: String,
        required: true   
    },
    featured: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

var Leaders = mongoose.model('Leader',leaderSchema);

module.exports = Leaders;


