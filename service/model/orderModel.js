"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AutoIncrement = require("mongoose-sequence")(mongoose);

var OrderSchema = new Schema({
	distance: String,
	status: {
		type: String,
		enum: ["UNASSIGN", "TAKEN"],
		default: "UNASSIGN"
	}
});

OrderSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Orders", OrderSchema);
