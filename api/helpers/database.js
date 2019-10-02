const db = require('../../sequelize/models');

db.wallet.belongsToMany(db.user, {
	through: {
		model: db.usertowallet
	}
});
db.user.belongsToMany(db.wallet, {
	through: {
		model: db.usertowallet
	}
});

db.filter = ((obj) => {
	if(obj.password) delete obj.password;
	if(obj.datastateid) delete obj.datastateid;
	return obj;
});

module.exports = db;
