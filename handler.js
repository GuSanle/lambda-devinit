const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.use(express.json());
const devinitRouter = require("./routes/devinit");
app.use("/devinit", devinitRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
