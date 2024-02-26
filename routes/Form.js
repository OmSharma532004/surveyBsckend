const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")

const {
    createForm,
    addInputToForm,
    addResponseToForm,
    getFormsByUserId,
    getResponsesByFormId,
    searchFormByName,
    getFormDetailsByName,
    getInputsByIds,
 
    getResponseById

  } = require("../controller/Form")

  // Route for user login
router.post("/createForm", createForm)

// Route for user signup
router.post("/addInput", addInputToForm)


router.post("/addResponse", addResponseToForm)
router.get("/searchForm", getFormDetailsByName)


router.get("/userForms", getFormsByUserId)

router.get("/FormDetail", getResponsesByFormId)
router.get("/getInputDetails", getInputsByIds)
router.get("/getResponseDetails", getResponseById)



  module.exports = router