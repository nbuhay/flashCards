const mongoose = require('mongoose');
const assert = require('chai').assert;
const sinon = require('sinon');
require('sinon-as-promised');
const resCode = require('config').resCode();
const jsonRes = require('dbAPI/modules/jsonResponse');
const DeckCard = require('dbAPI/models/deckCard');
const deckCardCtrl = require('dbAPI/controllers/deckCardCtrl');

var sandbox;

describe('deckCardCtrl.js', () => {

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
		sandbox.restore();
	});

	describe('#findAll', () => {

		it('function named findAll should exist', () => {
			assert.isFunction(deckCardCtrl.findAll);
		});

		it('should call Deck.find with the empty list as the only arg', () => {
			const mockReq = { req: {} };
			const mockRes = { res: {} };
			const conditions = {};
			const jsonResStub = sandbox.stub(jsonRes);
			const mockExec = sandbox.stub().resolves();
			const deckCardStub = sandbox.stub(DeckCard, 'find').returns({ exec: mockExec });

			return deckCardCtrl.findAll(mockReq, mockRes)
				.then(() => {
					assert.equal(deckCardStub.called, true, 'should be called once');
					assert.equal(deckCardStub.calledTwice, false, 'shouldn\t be called twice');
					assert(deckCardStub.calledWith(conditions), 
						'passed args not expected');
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should call jsonRes.send with a 200 when DeckCard.find resolves', () => {
			const mockReq = { req: {} };
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().resolves();
			
			sandbox.stub(DeckCard, 'find').returns({ exec: mockExec });

			return deckCardCtrl.findAll(mockReq, mockRes)
				.then(() => {
					assert.equal(jsonResStub.called, true, 'should be called once');
					assert.equal(jsonResStub.calledTwice, false, 'shouldn\t be called twice');
					assert(jsonResStub.calledWith(mockRes, resCode['OK']), 
						'passed args not expected');
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should call jsonRes.send with a 500 when DeckCard.find rejects', () => {
			const mockReq = { req: {} };
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().rejects('throwing mock exception...');
			
			sandbox.stub(DeckCard, 'find').returns({ exec: mockExec });

			return deckCardCtrl.findAll(mockReq, mockRes)
				.then(() => {
					assert.equal(jsonResStub.called, true, 'should be called once');
					assert.equal(jsonResStub.calledTwice, false, 'shouldn\t be called twice');
					assert(jsonResStub.calledWith(mockRes, resCode['SERVFAIL']), 
						'passed args not expected');
				})
				.catch((reason) => assert(false, reason.message));
		});

	});

	describe('#findById', () => {

		it('function named findById should exist', () => {
			assert.isFunction(deckCardCtrl.findAll);
		});

		it('should send a 400 if req.params._id is not a valid Mongo ObjectID', () => {
			const invalidMongoId = 'a';
			const mockReq = { 
				params: {
					_id: invalidMongoId
				} 
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 404 if req.params._id does\'t exist in DeckCard collection', () => {
			const idNotInCollection = 'a'.repeat(24);
			const mockReq = { 
				params: {
					_id: idNotInCollection
				} 
			};
			const mockRes = { res: {} };
			const stubCardData = null;
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().resolves(stubCardData);
			const deckCardStub = sandbox.stub(DeckCard, 'findById').returns({ exec: mockExec });

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['NOTFOUND']), 
							'passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 200 return if req.params._id exists in DeckCard collection', () => {
			const idInCollection = 'a'.repeat(24);
			const mockReq = { 
				params: {
					_id: idInCollection
				} 
			};
			const mockRes = { res: {} };
			const stubCardData = true;
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().resolves(stubCardData);
			const deckCardStub = sandbox.stub(DeckCard, 'findById').returns({ exec: mockExec });

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['OK']), 
							'passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 500 if query.exec rejects', () => {
			const idInCollection = 'a'.repeat(24);
			const mockReq = { 
				params: {
					_id: idInCollection
				} 
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().rejects();
			const deckCardStub = sandbox.stub(DeckCard, 'findById').returns({ exec: mockExec });

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['SERVFAIL']), 
							'passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

	});

	describe('#create', () => {

		it('function named create should exist', () => {
			assert.isFunction(deckCardCtrl.create);
		});

		it('should send a 400 if header \'content-type\' is undefined', () => {
			const mockReq = { headers: [] };
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if header \'content-type\' doesn\'t equal \'application/json\'', () => {
			const mockReq = { 
				headers: {
					'content-type': 'text'
				}
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body is undefined', () => {
			const mockReq = { 
				headers: {
					'content-type': 'application/json'
				}
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body is null', () => {
			const mockReq = { 
				headers: {
					'content-type': 'application/json'
				},
				body: null
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body is not valid JSON', () => {
			const invalidJson = 'notJsonFormat';
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: invalidJson
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body does not have the property question', () => {
			const invalidDeckCard = { noQuestion: true };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body does not have the property answer', () => {
			const invalidDeckCard = { 
				question: true,
				noAnswer: true
			};
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.question is not an array', () => {
			const invalidDeckCard = { question: true, answer: true };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.answer is not an array', () => {
			const invalidDeckCard = { question: [], answer: true };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.question is not an array of only strings', () => {
			const invalidDeckCard = { question: [true], answer: [] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.answer is not an array of only strings', () => {
			const invalidDeckCard = { question: ['true'], answer: [true] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 500 if DeckCard.create throws an exception', () => {
			const validDeckCard = { question: ['true'], answer: ['true'] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: validDeckCard
			};
			const mockRes = { res: {} };
			const createStub = sandbox.stub().rejects();
			const deckCardStub = sandbox.stub(DeckCard, 'create', createStub);
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['SERVFAIL']), 
							'passed args not expected');			
				});
		});

		it('should send a 200 when DeckCard.create resolves', () => {
			const validDeckCard = { question: ['true'], answer: ['true'] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				body: validDeckCard
			};
			const mockRes = { res: {} };
			const createStub = sandbox.stub().resolves();
			const deckCardStub = sandbox.stub(DeckCard, 'create', createStub);
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['OK']), 
							'passed args not expected');			
				});
		});

	});

	describe('#findOneAndRemove', () => {

		it('function named delete should exist', () => {
			assert.isFunction(deckCardCtrl.findOneAndRemove);
		});

		it('should send a 400 if req.params._id is not a valid Mongo ObjectID', () => {
			const invalidMongoId = 'a'.repeat('23');
			const mockReq = {
				params: {
					_id: invalidMongoId
				}
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findOneAndRemove(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');		
				})
		});

		it('should send a 500 if DeckCard.findOneAndRemove throws an exception', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = {
				params: {
					_id: validMongoId
				}
			};
			const mockRes = { res: {} };
			const mockExec = sandbox.stub().rejects();
			const deckCardStub = 
				sandbox.stub(DeckCard, 'findOneAndRemove').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findOneAndRemove(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['SERVFAIL']), 
							'passed args not expected');		
				});
		});

		it('should send a 404 if DeckCard :_id is not found in the DeckCard collection', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = {
				params: {
					_id: validMongoId
				}
			};
			const mockRes = { res: {} };

			const mockExec = sandbox.stub().resolves(undefined);
			const deckCardStub = 
				sandbox.stub(DeckCard, 'findOneAndRemove').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findOneAndRemove(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['NOTFOUND']), 
							'passed args not expected');		
				});
		});
	
		it('should send a 200 if DeckCard :_id is deleted from the DeckCard collection', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = {
				params: {
					_id: validMongoId
				}
			};
			const mockRes = { res: {} };
			const mockReturnedDeckCard = { question: ['true'], answer: ['true'] };
			const mockExec = sandbox.stub().resolves(mockReturnedDeckCard);
			const deckCardStub = 
				sandbox.stub(DeckCard, 'findOneAndRemove').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findOneAndRemove(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['OK']), 
							'passed args not expected');		
				});
		});

	});

});