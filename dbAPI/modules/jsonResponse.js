function send(res, status, content) {
	console.log('in jsonRes.send...');
	res.status(status).json(content);
}

module.exports = {
	send
}; 