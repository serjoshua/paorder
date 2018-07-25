"use strict";

var mongoose = require("mongoose");
var Order = mongoose.model("Orders");
var https = require("https");

exports.list_orders = function(req, res) {
	Order.find({}, function(err, order) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		res.json(order);
	});
};

exports.place_order = function(req, res) {
	https.get(
		"https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +
			req.body.origin[0] +
			"," +
			req.body.origin[1] +
			"&destinations=" +
			req.body.destination[0] +
			"," +
			req.body.destination[1] +
			"&key=AIzaSyBhh-TvfXKmwO0bA9DLTy6YILNbxVKnETo",
		function(resp) {
			var body = "";
			resp.on("data", function(chunk) {
				body += chunk;
			});

			console.log(body);

			resp.on("end", function() {
				var response = JSON.parse(body);
				try {
					var distance = response.rows[0].elements[0].distance.text;
				} catch (err) {
					console.error(err);

					res.status(500).send({
						error: "INTERNAL_ERROR"
					});
					return;
				}

				console.log("Got a response: ", distance);

				var new_order = new Order({ distance: distance });
				new_order.save(function(err, order) {
					if (err) {
						console.log(err);
						res.send(err);
					}
					res.json(order);
				});
			});
		}
	);
};

exports.take_order = function(req, res) {
	Order.findOne({ id: req.params.id }, function(err, order) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		if (order.status.toUpperCase() === "TAKEN") {
			res.status(409).send({
				error: "ORDER_ALREADY_BEEN_TAKEN"
			});
			return;
		} else {
			Order.findOneAndUpdate(
				{ id: req.params.id },
				req.body,
				{ new: true },
				function(err) {
					if (err) res.send(err);
					res.json({
						status: "SUCCESS"
					});
				}
			);
		}
	});
};
