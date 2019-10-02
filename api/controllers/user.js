'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
let config = require('config');
const User = require('../helpers/user');
const Wallet = require('../helpers/wallet');
let Error = require('../helpers/error');
let jwt = require('jsonwebtoken');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
	user_authenticate: user_authenticate,
	user_get: user_get,
	user_add: user_add,
	user_delete: user_delete,
	user_update: user_update,
	user_assign_wallet: user_assign_wallet,
	user_update_wallet: user_update_wallet
};

function user_get(req, res) {
	let msg = 'Error Getting User';

	let user = new User(req.jwt.id);
	user.get().then(user => {
		res.json(user);
	}).catch((err) => {
		if(!err) err = msg;
		Error.response(res, msg, err)
	});
}

/**
 * Add a user
 * @param req
 * @param res
 */
function user_add(req, res) {
	let user = req.swagger.params.user.value;

	User.create(user).then((userId) => {
		let user = new User(userId);
		user.get().then(user => {
			let userResponse = {
				user: user,
				token: jwt.sign(Object.assign({}, user), config.get('jwt.secret')) // Assign JWT
			};
			res.json(userResponse);
		}).catch((err) => {
			if(!err) err = 'Error Getting User';
			Error.response(res, err)
		});
	}).catch((err) => {
		if(!err) err = 'Error Adding User';
		Error.response(res, err)
	});
}

/**
 * Assign a wallet to a user
 * @param req
 * @param res
 */
function user_assign_wallet(req, res) {
	let params = req.swagger.params.wallet.value;
	let msg = "Failed to Add Wallet";

	let user = new User(req.jwt.id);
	user.assignWallet(params).then(() => {
		user.get().then(user => {
			res.json(user);
		}).catch((err) => {
			if(!err) err = msg;
			Error.response(res, msg, err)
		});
	}).catch((err) => {
		if(!err) err = msg;
		Error.response(res, msg, err)
	});
}

/**
 * Authenticate a user
 * @param req
 * @param res
 */
function user_authenticate(req, res) {
	let user = req.swagger.params.auth.value;

	User.auth(user).then(userId => {
		let user = new User(userId);
		user.get().then(user => {
			let userResponse = {
				user: user,
				token: jwt.sign(Object.assign({}, user), config.get('jwt.secret')) // Assign JWT
			};
			res.json(userResponse);
		}).catch((err) => {
			if(!err) err = 'Error Getting User';
			Error.response(res, err)
		});
	}).catch((err) => {
		if(!err) err = 'Failed to Authenticate User';
		Error.response(res, err)
	});
}

/**
 * Delete a user
 * @param req
 * @param res
 */
function user_delete(req, res) {
	let msg = 'Error Deleting User';

	let user = new User(req.jwt.id);
	user.delete().then(() => {
		res.json({status: true});
	}).catch((err) => {
		if(!err) err = msg;
		Error.response(res, err)
	});
}

/**
 * Update a user
 * @param req
 * @param res
 */
function user_update(req, res) {
	let params = req.swagger.params.user.value;
	let msg = 'Error Updating User';

	let user = new User(req.jwt.id);
	user.update(params).then(() => {
		user.get().then(user => {
			res.json(user);
		}).catch((err) => {
			if(!err) err = msg;
			Error.response(res, err)
		});
	}).catch((err) => {
		if(!err) err = msg;
		Error.response(res, err)
	});
}

/**
 * Update a user's wallet
 * @param req
 * @param res
 */
function user_update_wallet(req, res) {
	let msg = 'Failed to Update Wallet';
	let walletData = req.swagger.params.wallet.value;
	let walletId = req.swagger.params.id.value;

	let user = new User(req.jwt.id);
	user.validateWallet(walletId).then(() => {
		let wallet = new Wallet(walletId);
		wallet.update(walletData).then(() => {
			wallet.get().then(wallet => {
				res.json(wallet);
			}).catch((err) => {
				if(!err) err = msg;
				Error.response(res, err);
			});
		}).catch((err) => {
			if(!err) err = msg;
			Error.response(res, err);
		});
	}).catch((err) => {
		if(!err) err = msg;
		Error.response(res, 'Wallet Not Assigned to User', err);
	});
}
