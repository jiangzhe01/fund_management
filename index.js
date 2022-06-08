const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const passwort = require("passport");

const app = express();
const db = require("./config/index");
const user = require("./routes/api/user");
const profile = require("./routes/api/profile");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db.mongoURI)
  .then(() => {
    console.log("mongoose connect");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(passwort.initialize());

require("./config/passport")(passwort);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/user", user);
app.use("/api/profile", profile);
const port = process.env.PORT || 5051;

app.listen(port, () => {
  console.log(`server is running at http://127.0.0.1:${port}`);
});
