const mongoose = require("mongoose");

const ResponseSchema=new mongoose.Schema(

    {
        Form: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Form",
        },
        answer:{
            type: mongoose.Schema.Types.Mixed, 
            required: true,
        },
   
        Usera: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

    }
)

const Response = mongoose.model('Response', ResponseSchema);

module.exports = Response;