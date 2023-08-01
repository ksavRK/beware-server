const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.cause = require("./cause.model");

db.ROLES = ["user", "business_owner"];

module.exports = db;
