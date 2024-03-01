const mongoose = require("mongoose");

const formSchema=new mongoose.Schema(

    {

        title:{
            type:String,
            required:true,
            unique:true
          
        },
        input: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Input",
            },
        ],

        response: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Response",
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    }
)

const Form = mongoose.model('Form', formSchema);

module.exports = Form;