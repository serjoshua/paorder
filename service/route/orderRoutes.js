"use strict";

module.exports = function(app) {
	var order = require("../controller/orderController");

	// order Routes
	app.route("/order").post(order.place_order);
	app.route("/order/:id").put(order.take_order);
	// app.route("/orders?page=:page&limit=:limit").get(order.list_orders);
	app.route("/orders").get(order.list_orders);
};
