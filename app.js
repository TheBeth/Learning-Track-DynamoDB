require("dotenv").config();
const express = require("express");
const usersRoute = require("./routes/userRoute");
const petsRoute = require("./routes/petRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRoute);
app.use("/pets", petsRoute);

const port = process.env.PORT || 8050;
app.listen(port, () => console.log(`Server running port ${port}`));
