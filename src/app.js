require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const path = require("path");
const app = express();

const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("app started listening on port: " + port);
});
