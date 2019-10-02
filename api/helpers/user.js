let db = require('./database');

let Wallet = require('./wallet');
let globals = require('./globals');
let bcrypt = require('bcrypt-nodejs');

/**
 * Class to handle a User instance
 * @class User
 */
class User {
	/**
	 * User Contructor
	 * @param userId
	 */
	constructor(userId) {
		this.userId = userId;
	}

	/**
	 * Get the user info
	 * @param allWallets
	 * @returns {Promise<unknown>}
	 */
	get(allWallets = false) {
		return new Promise((resolve, reject) => {
			let filter = {
				active: true,
				datastateid: 1
			};
			if(allWallets) delete filter.active;

			db.user.findById(this.userId, {
				include: [{
					model: db.wallet,
					through: {
						attributes: ['id', 'address', 'public', 'createdAt'],
						where: filter
					}
				}]
			}).then(user => {
				// Lets sync the object up with the Swagger Docs
				let u = user.get();
				if(!allWallets) {
					if(user.wallets.length) {
						u.wallet = user.wallets[0].get();
					} else {
						u.wallet = {};
					}
					delete u.wallets;
				}
				u = db.filter(u);
				resolve(u);
			}).catch(err => reject(err));
		});
	}

	/**
	 * Create a new user
	 * @param params
	 * @returns {Promise<unknown>}
	 */
	static create(params) {
		return new Promise((resolve, reject) => {
			if (params.email && params.password) {
				params.email = params.email.replace(/\s/g, "");
				if (!globals.validateEmail(params.email)) {
					reject("Invalid Email Address");
				} else {
					db.user.findOne({where: {email: params.email}}).then(user => { // Not checking datastateid here on purpose for security reasons
						if (user) {
							reject("Email Exists! Please Log In or Request a New Password");
						} else {
							params.password = bcrypt.hashSync(params.password);
							db.user.create({email: params.email, password: params.password}).then(res => {
								resolve(res.id);
							}).catch(err => reject("Failed to Save User"))
						}
					}).catch(err => reject("Failed Checking Existing Users"));
				}
			} else {
				reject("Missing Email or Password");
			}
		});
	}

	/**
	 * Authenticate a user
	 * @param params
	 * @returns {Promise<unknown>}
	 */
	static auth(params) {
		return new Promise((resolve, reject) => {
			let msg = "Invalid Username or Password";
			if (params.email && params.password) {
				db.user.findOne({where: {email: params.email, datastateid: 1}}).then(user => {
					if(user) {
						bcrypt.compare(params.password, user.password, (err, valid) => {
							if(valid) resolve(user.id);
							else reject(msg);
						});
					} else {
						reject(msg);
					}
				});
			} else {
				reject(msg);
			}
		});
	}

	/**
	 * Update a user
	 * @param params
	 * @returns {Promise<unknown>}
	 */
	update(params) {
		return new Promise((resolve, reject) => {
			let msg = "Failed to Update User";
			let update = {};
			if (params.email) update.email = params.email;
			if (params.password) update.password = bcrypt.hashSync(params.password);
			if (update.email || update.password) {
				db.user.update(update, {where: {id: this.userId}}).then(user => {
					if(user) {
						resolve(true);
					} else {
						reject(msg);
					}
				});
			} else {
				reject(msg);
			}
		});
	}

	/**
	 * Assign a wallet to a user
	 * @param params
	 * @returns {Promise<unknown>}
	 */
	assignWallet(params) {
		return new Promise((resolve, reject) => {
			let msg = "Failed to Add Wallet";

			db.usertowallet.update({ active: null }, {where: {userId: this.userId}}).then(() => {
				if(!params.id) {
					if(!params.address) {
						Wallet.generateAddress(params.name, this.userId).then(wallet => {
							resolve(wallet);
						}).catch(err => reject(err));
					} else {
						Wallet.create(params.address, params.name, this.userId).then(wallet => {
							resolve(wallet);
						}).catch(err => reject(err));
					}
				} else {
					let wallet = new Wallet(params.id);
					wallet.get().then(wallet => {
						console.log(params.id, wallet);
						if(wallet) {
							db.usertowallet.upsert({active: true, userId: this.userId, walletId: params.id}).then(created => {
								resolve(created);
							}).catch(err => reject(err));
						} else {
							reject("Invalid Wallet ID");
						}
					}).catch(err => reject(err));
				}
			});
		});
	}

	/**
	 * Delete a user
	 * @returns {*}
	 */
	delete() {
		return db.user.update({datastateid: 2}, {where: {id: this.userId}});
	}

	/**
	 * Validate wallet is exists under the user
	 * @param walletId
	 * @returns {Promise<unknown>}
	 */
	validateWallet(walletId) {
		return new Promise((resolve, reject) => {
			this.get(true).then(user => {
				user.wallets.forEach(wallet => {
					if(wallet.id == walletId) resolve();
				});
				reject();
			}).catch(err => reject(err));
		});
	}
}

module.exports = User;
