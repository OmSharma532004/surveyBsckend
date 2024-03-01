const Form = require("../models/form")
const Input = require("../models/Input");
const Response = require("../models/Response");

exports.addResponseToForm = async (req, res) => {
    try {
        

        const { formId, answer,userAnswerId } = req.body;

        // Check if all required fields are provided
        if (!formId || !answer  || !userAnswerId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required for adding response to a form.",
            });
        }

        const newResponse = await Response.create({
            Form: formId,
            answer,
            Usera: userAnswerId,
        });

        // Find the form and push the new response
        const updatedForm = await Form.findByIdAndUpdate(
            formId,
            { $push: { response: newResponse._id } },
            { new: true }
        );

        if(!updatedForm){
            return res.status(500).json({
                success: false,
                message: "no form id matching",
                error: error,
            });
        }

        return res.status(200).json({
            success: true,
            response: newResponse,
            form: updatedForm,
            message: "Response added to the form successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Adding response to form failed. Please try again.",
            error: error,
        });
    }
};

exports.addInputToForm = async (req, res) => {
    try {
        
        const { formId, field, type,userId} = req.body;

        // Check if all required fields are provided
        if (!formId || !field  || !userId|| !type) {
            return res.status(400).json({
                success: false,
                message: "All fields are required for adding input to a form.",
            });
        }

        const newInput = await Input.create({
            field,
            type,
            User: userId,
            Form: formId,
        });

        // Find the form and push the new input
        const updatedForm = await Form.findByIdAndUpdate(
            formId,
            { $push: { input: newInput._id } },
            { new: true }
        );

        if(!updatedForm){
            return res.status(500).json({
                success: false,
                message: "no formid matching",
                error: error,
            });
        }

        return res.status(200).json({
            success: true,
            input: newInput,
            form: updatedForm,
            message: "Input added to the form successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Adding input to form failed. Please try again.",
            error: error,
        });
    }
};

exports.createForm = async (req, res) => {
    try {
        
        
        const { title,user } = req.body;

        // Check if all required fields are provided
        if ( !user || !title) {
            return res.status(400).json({
                success: false,
                message: "All fields are required for creating a form.",
            });
        }
        const FormExists = await Form.findOne({ title, user});
        if(FormExists){
            return res.status(400).json({
                success: false,
                message: "Form already exists",
            });
        }

        const newForm = await Form.create({
            user,
            title
        });

        return res.status(201).json({
            success: true,
            form: newForm,
            message: "Form created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Form creation failed. Please try again.",
            error: error,
        });
    }
};


exports.getFormsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    const forms = await Form.find({ user: userId });

    if (forms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No forms found for the given user ID",
        forms: [],
      });
    } else {
      return res.status(200).json({
        success: true,
        forms: forms,
        message: "Forms retrieved successfully for the user",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve forms. Please try again.",
      error: error.message,
    });
  }
};


exports.getResponsesByFormId = async (req, res) => {
  try {
    const formId = req.query.formId;

    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found for the specified formId",
      });
    }

    return res.status(200).json({
      success: true,
      form: form,
      message: "Form details retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve form details. Please try again.",
      error: error,
    });
  }
};

exports.getFormDetailsByName = async (req, res) => {
  try {
      const { formName } = req.query; // Destructure to get formName

      const form = await Form.findOne({ title: formName })
          .populate("input")
          .populate("response")
          .exec();

      if (!form) {
          return res.status(404).json({
              success: false,
              message: "Form not found with the specified name",
          });
      }

      return res.status(200).json({
          success: true,
          form: form,
          message: "Form details retrieved successfully",
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "Failed to retrieve form details. Please try again.",
          error: error,
      });
  }
};

exports.handleDeleteForm = async (req, res) => {
  const { formId } = req.query;
  const form = await Form.findByIdAndDelete(formId);
  if (!form) {
    return res.status(404).json({
      success: false,
      message: "Form not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Form deleted successfully",
  });

}



  

  exports.addResponsesBasedOnInputs = async (formId, userAnswerId, userResponses) => {
    try {
      // Fetch the form to get its inputs
      const form = await Form.findById(formId).populate("input");
  
      if (!form) {
        throw new Error("Form not found");
      }
  
      // Extract input fields from the form
      const inputFields = form.input.map((input) => input.field);
  
      // Validate user responses
      const validResponses = Object.keys(userResponses).filter((field) =>
        inputFields.includes(field)
      );
  
      // Create responses for each valid input field
      const responsePromises = validResponses.map(async (field) => {
        const input = form.input.find((input) => input.field === field);
  
        if (!input) {
          throw new Error(`Input with field ${field} not found`);
        }
  
        const answer = userResponses[field];
  
        const newResponse = await Response.create({
          Form: formId,
          answer,
          Usera: userAnswerId,
          Input: input._id,
        });
  
        // Add the response to the form
        await Form.findByIdAndUpdate(
          formId,
          { $push: { response: newResponse._id } },
          { new: true }
        );
  
        return newResponse;
      });
  
      const responses = await Promise.all(responsePromises);
  
      return responses;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add responses based on form inputs");
    }
  };

  exports.listInputsByFormId = async (formId) => {
    try {
      // Fetch the form to get its inputs
      const form = await Form.findById(formId).populate("input");
  
      if (!form) {
        throw new Error("Form not found");
      }
  
      // Extract and return the input fields with their types
      const inputList = form.input.map((input) => ({
        field: input.field,
        type: input.type,
      }));
  
      return inputList;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to list inputs for the given form ID");
    }
  };


  exports.getInputsByIds = async (req, res) => {
    try {
      const inputId = req.query.inputId; // Access inputId directly from req.query
  
      const inputs = await Input.find({ _id: inputId });
  
      return res.status(200).json({
        success: true,
        inputs: inputs,
        message: "Inputs retrieved successfully by their IDs",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve inputs. Please try again.",
        error: error.message,
      });
    }
  };
  

  exports.getResponseById = async (req, res) => {
    try {
      const { responseId } = req.query;
  
      // Assuming responseId is a valid ObjectId
      const response = await Response.findById(responseId);
  
      if (!response) {
        return res.status(404).json({
          success: false,
          message: "Response not found for the specified responseId",
        });
      }
  
      return res.status(200).json({
        success: true,
        response: response,
        message: "Response details retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve response details. Please try again.",
        error: error.message,
      });
    }
  };
  
  exports.getFormById=async(req,res)=>{
    const formId = req.query.formId;
    try {
      const form = await Form.findById(formId) .populate("input")
      .populate("response")
      .exec();

  
      if (!form) {
        throw new Error("Form not found");
      }
  
      return  res.status(200).json({
        success: true,
        form: form,
        message: "Form details retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve form details");
    }
  }
