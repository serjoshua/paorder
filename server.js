var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require("mongoose");
var Order = require("./service/model/orderModel"); // created model loading here
var bodyParser = require("body-parser");

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/OrderDb");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./service/route/orderRoutes"); // importing route
routes(app); // register the route

app.listen(port);

console.log("Pa-order RESTful API server started on: " + port);
