let db = require('./database');

/**
 * Class to handle a wallet instance
 * @class Wallet
 */
class Wallet {
	/**
	 * Wallet Contructor
	 * @param walletId
	 */
	constructor(walletId) {
		this.walletId = walletId;
	}

	/**
	 * Get a wallet
	 * @returns {Promise<unknown>}
	 */
	get() {
		return new Promise((resolve, reject) => {
			db.wallet.findById(this.walletId).then(wallet => {
				if(wallet) {
					let w = wallet.get();
					w = db.filter(w);
					resolve(w);
				} else {
					reject('No Wallet Found');
				}
			}).catch(err => reject(err));
		})
	}

	/**
	 * Create a new wallet
	 * @param address
	 * @param name
	 * @param userId
	 * @param isPublic
	 * @returns {Promise<unknown>}
	 */
	static create(address, name, userId = null, isPublic = false) {
		return new Promise((resolve, reject) => {
			db.wallet.create({
				address: address,
				name: name,
				public: isPublic
			}).then(wallet => {
				let w = wallet.get();
				w = db.filter(w);

				if(userId) {
					db.usertowallet.create({
						userId: userId,
						walletId: wallet.id
					}).then(userToWallet => {
						resolve(w);
					}).catch(err => reject(err));
				} else {
					resolve(w);
				}
			}).catch(err => reject(err));
		});
	}

	/**
	 * Generate a new Monero wallet address
	 * @param name
	 * @param userId
	 * @returns {Promise<unknown>}
	 */
	static generateAddress(name, userId) {
		let address = 'TestAddress'; // TODO: Get code to actually generate the address
		return Wallet.create(address, name, userId);
	}

	/**
	 * List all wallets
	 * @param userId
	 * @returns {Promise<unknown>}
	 */
	static list(userId = null) {
		return new Promise((resolve, reject) => {
			db.wallet.findAll({where: {public: true, datastateid: 1}}).then(wallets => {
				if(!userId) resolve(wallets);
				else {
					db.wallet.findAll({include: [{
						model: db.user,
						through: {
							where : {userId: userId, datastateid: 1}
						},
						required: true
					}]}).then(userWallets => {
						userWallets.forEach(wallet => {
							let uw = wallet.get();
							delete uw.users;
							uw = db.filter(uw);
							wallets.push(uw);
						});
						resolve(wallets);
					}).catch(err => reject(err));
				}
			})
		});
	}

	/**
	 * Update a wallet
	 * @param params
	 * @param isPublic
	 * @returns {Promise<unknown>}
	 */
	update(params, isPublic = false) {
		return new Promise((resolve, reject) => {
			db.wallet.update({
				name: params.name,
				address: params.address,
				public: isPublic
			}, {
				where: {id: this.walletId}
			}).then(wallet => {
				resolve();
			}).catch(err => reject(err));
		})
	}
}

module.exports = Wallet;
