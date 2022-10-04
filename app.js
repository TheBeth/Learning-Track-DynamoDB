require("dotenv").config();
const express = require("express");
const usersRoute = require("./routes/userRoute");
const petsRoute = require("./routes/petRoute");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", usersRoute);
app.use("/pets", petsRoute);

app.use("*", (req, res) => res.status(400).send("Resouces not found"));

const port = process.env.PORT || 8050;
app.listen(port, () => console.log(`Server running port ${port}`));
