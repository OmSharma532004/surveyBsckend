const express = require("express");
const app = express();
const database = require("./config/database");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT;
database.connect();
const userRoutes = require("./routes/User");
const formRoutes = require("./routes/Form");

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/form", formRoutes);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})