const errMsg = require('appStrings').dbAPI.modules.mongoId.errMsg;
const mongoIdRe = require('config').mongoIdRe();

module.exports = (mongoId) => {
	return new Promise((resolve, reject) => {
		if (mongoId === undefined) {
			reject({ message: errMsg.undefinedMongoId });
		} else if (!(mongoIdRe.test(mongoId))) {
			reject({ message: errMsg.invalidMongoId });
		} else {
			resolve();
		}
	})
	.catch((reason) => { throw Error(reason.message); });
};