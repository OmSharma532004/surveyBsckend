const mongoose = require("mongoose");

const inputSchema=new mongoose.Schema(

    {
        field:{
            type:String,
            required: true,
            
        },
        type:{
            type:String,
            required: true,
            
        },
        User: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        Form: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Form",
        },
        options: {
            type: Array,
            required: false,
        },
    }
)

const Input = mongoose.model('Input', inputSchema);

module.exports = Input;