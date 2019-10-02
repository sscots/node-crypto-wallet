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
const Wallet = require('../helpers/wallet');
let Error = require('../helpers/error');


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
  wallet_add: wallet_add,
  wallet_update: wallet_update,
  wallets_get: wallets_get
};

/**
 * Get a wallet
 * @param req
 * @param res
 */
function wallets_get(req, res) {
	let msg = "Failed to get Wallets";
	let userId = null;
	if(req.swagger.params.userid) userId = req.swagger.params.userid.value;

	Wallet.list(userId).then(wallets => {
		res.json(wallets);
	}).catch(err => {
		Error.response(res, msg, err);
	})
}

/**
 * Add a wallet
 * @param req
 * @param res
 */
function wallet_add(req, res) {
	let msg = 'Failed to Add Wallet';
	let wallet = req.swagger.params.wallet.value;

	Wallet.create(wallet.address, wallet.name, null, true).then(wallet => {
		res.json(wallet);
	}).catch((err) => {
		if(!err) err = msg;
		Error.response(res, err);
	});
}

/**
 * Update a wallet
 * @param req
 * @param res
 */
function wallet_update(req, res) {
	let msg = 'Failed to Update Wallet';
	let walletData = req.swagger.params.wallet.value;
	let walletId = req.swagger.params.id.value;

	let wallet = new Wallet(walletId);
	wallet.update(walletData, true).then(() => {
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
}
