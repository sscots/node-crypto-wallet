'use strict';

let SwaggerExpress = require('swagger-express-mw');
let app = require('express')();
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let conf = require('config');
let models = require('./sequelize/models');

module.exports = app; // for testing

let config = {
	appRoot: __dirname, // required config
	swaggerSecurityHandlers: {
		Bearer: function (req, authOrSecDef, token, cb) {
			jwt.verify(token, conf.get('jwt.secret'), function(err, decoded) {
				if (err) {
					cb(new Error('Access Denied!'));
				} else {
					req.jwt = decoded;
					cb();
				}
			});
		}
	}
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	let port = process.env.PORT || 10010;

	app.listen(port);
});
