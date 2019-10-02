class ErrorResponse {
	constructor() {
		this.title = 'Uh Oh';
		this.message = 'Invalid Request';
	}
	
	response(res, error, debug) {
		console.log('Error:', error, debug);
		res.status(400).json({error: error});
	}
}

module.exports = new ErrorResponse();
