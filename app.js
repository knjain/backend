const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const errorHandler = require("./middlewares/error.middleware");
const routes = require("./routes");
const bodyParser = require("body-parser");

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.use("/public", express.static("public"));

// Routes
app.use(routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error: ".concat(err) });
});

const server = http.createServer(app);
app.use(cors());

module.exports = { server };
