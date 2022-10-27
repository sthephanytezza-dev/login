const knexfile = require("../../knexfile");
const connection = require("knex")(knexfile["development"]);

module.exports = connection;