const str = require('appStrings').dbAPI.controllers.deckCardCtrl;
const modulesStr = require('appStrings').modules;
const mongoose = require('mongoose');
const assert = require('chai').assert;
const sinon = require('sinon');
require('sinon-as-promised');
const resCode = require('config').resCode();
const invalidMongoId = require('config').invalidMongoId();
const validMongoId = require('config').validMongoId();
const jsonReq = require('modules/jsonRequest');
const jsonRes = require('modules/jsonResponse');
const DeckCard = require('dbAPI/models/deckCard');
const deckCardCtrl = require('dbAPI/controllers/deckCardCtrl');

var sandbox;
var errorHeader;

beforeEach(function() {
	errorHeader = { 
		message: require('modules/errorHeader')(require.resolve('dbAPI/controllers/deckCardCtrl')) 
	};
	sandbox = sinon.sandbox.create();
});

afterEach(function() {
	sandbox.restore();
});

describe.only('deckCardCtrl.js', () => {

	describe('#findAll', () => {

		beforeEach(function() {
			errorHeader.message += 'findAll: ';
		});

		it('function named findAll should exist', () => {
			assert.isFunction(deckCardCtrl.findAll);
		});

		it('should call Deck.find with the empty list as the only arg', () => {
			const reqDummy = { req: {} };
			const resDummy = { res: {} };
			const conditions = {};
			const jsonResStub = sandbox.stub(jsonRes);
			const execStub = sandbox.stub().resolves();
			const deckCardStub = sandbox.stub(DeckCard, 'find').returns({ exec: execStub });

			return deckCardCtrl.findAll(reqDummy, resDummy)
				.then(() => {
					assert.equal(deckCardStub.callCount, 1, 'should be called once');
					assert(deckCardStub.calledWithExactly(conditions), 'passed args not expected');
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 200 when DeckCard.find resolves', () => {
			const reqDummy = { req: {} };
			const resDummy = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const allDeckCardData = { users: {} };
			const execStub = sandbox.stub().resolves(allDeckCardData);
			
			sandbox.stub(DeckCard, 'find').returns({ exec: execStub });

			return deckCardCtrl.findAll(reqDummy, resDummy)
				.then(() => {
					assert.equal(jsonResStub.callCount, 1, 'should be called once');
					assert(jsonResStub.calledWithExactly(resDummy, resCode['OK'], allDeckCardData),
						'passed args not expected');
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 500 when DeckCard.find rejects', () => {
			const reqDummy = { req: {} };
			const resDummy = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const queryErrorSendsUndefinedReason = undefined;
			const execStub = sandbox.stub().rejects(queryErrorSendsUndefinedReason);
			
			errorHeader.message += str.errMsg.checkQuery;
			sandbox.stub(DeckCard, 'find').returns({ exec: execStub });

			return deckCardCtrl.findAll(reqDummy, resDummy)
				.then(() => {
					assert.equal(jsonResStub.callCount, 1, 'should be called once');
					assert(jsonResStub.calledWith(resDummy, resCode['SERVFAIL'], errorHeader), 
						'passed args not expected');
					assert.equal(jsonResStub.firstCall.args[2].message, errorHeader.message, 'errorHeader');
				})
				.catch((reason) => assert(false, reason.message));
		});

	});

	describe('#findById', () => {

		beforeEach(function() {
			errorHeader.message += 'findById: ';
		});

		it('function named findById should exist', () => {
			assert.isFunction(deckCardCtrl.findAll);
		});

		it('should send a 400 if _id is not a valid Mongo ObjectID', () => {
			const mockReq = { 
				params: {
					_id: invalidMongoId
				} 
			};
			const mockRes = { res: {} };
			const jsonReqSpy = sandbox.spy(jsonReq, 'validateMongoId');
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			errorHeader.message += modulesStr.jsonRequest.errMsg.invalidMongoId;

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonReqSpy.callCount, 1, 'should be called once');
						assert(jsonReqSpy.calledWithExactly(invalidMongoId), 'req spy passed args not expected');
						assert.equal(jsonResStub.callCount, 1, 'should be called once');
						assert(jsonResStub.calledWithExactly(mockRes, resCode['BADREQ'], 
							errorHeader), 'res stub passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 404 if _id does\'t exist in DeckCard collection', () => {
			const idNotInCollection = validMongoId;
			const mockReq = { 
				params: {
					_id: idNotInCollection
				} 
			};
			const mockRes = { res: {} };
			const jsonReqStub = sandbox.stub(jsonReq, 'validateMongoId').resolves();
			const stubCardData = null;
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().resolves(stubCardData);
			const deckCardStub = sandbox.stub(DeckCard, 'findById').returns({ exec: mockExec });
			errorHeader.message += str.errMsg.doesNotExist;

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.callCount, 1, 'should be called once');
						assert(jsonResStub.calledWithExactly(mockRes, resCode['NOTFOUND'], errorHeader),
							'passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 500 if DeckCard.findById rejects', () => {
			const idInCollection = validMongoId;
			const mockReq = { 
				params: {
					_id: idInCollection
				} 
			};
			const mockRes = { res: {} };
			const jsonReqStub = sandbox.stub(jsonReq, 'validateMongoId').resolves();
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().rejects();
			const deckCardStub = sandbox.stub(DeckCard, 'findById').returns({ exec: mockExec });
			errorHeader.message += str.errMsg.checkQuery;

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.callCount, 1, 'should be called once');
						assert(jsonResStub.calledWithExactly(mockRes, resCode['SERVFAIL'], errorHeader), 
							'passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

		it('should send a 200 if _id exists in DeckCard collection', () => {
			const idInCollection = validMongoId;
			const mockReq = { 
				params: {
					_id: idInCollection
				} 
			};
			const mockRes = { res: {} };
			const jsonReqStub = sandbox.stub(jsonReq, 'validateMongoId').resolves();
			const stubCardData = true;
			const jsonResStub = sandbox.stub(jsonRes, 'send');
			const mockExec = sandbox.stub().resolves(stubCardData);
			const deckCardStub = sandbox.stub(DeckCard, 'findById').returns({ exec: mockExec });

			return deckCardCtrl.findById(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.callCount, 1, 'should be called once');
						assert(jsonResStub.calledWithExactly(mockRes, resCode['OK'], stubCardData), 
							'passed args not expected');			
				})
				.catch((reason) => assert(false, reason.message));
		});

	});

	describe.only('#create', () => {

		it('function named create should exist', () => {
			assert.isFunction(deckCardCtrl.create);
		});

		it('should send a 400 if header content-type is undefined', () => {
			const reqStub = { headers: [] };
			const resStub = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(reqStub, resStub)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(resStub, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if header content-type doesn\'t equal application/json', () => {
			const reqStub = { 
				headers: {
					'content-type': 'text'
				}
			};
			const resStub = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(reqStub, resStub)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(resStub, resCode['BADREQ']), 
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
			const reqStub = {
				headers: {
					'content-type': 'application/json'
				},
				body: validDeckCard
			};
			const resStub = { res: {} };
			const createStub = sandbox.stub().rejects();
			const deckCardStub = sandbox.stub(DeckCard, 'create', createStub);
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.create(reqStub, resStub)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(resStub, resCode['SERVFAIL']), 
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

	describe('#findByIdAndRemove', () => {

		it('function named findByIdAndRemove should exist', () => {
			assert.isFunction(deckCardCtrl.findByIdAndRemove);
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

			return deckCardCtrl.findByIdAndRemove(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');		
				})
		});

		it('should send a 500 if DeckCard.findByIdAndRemove throws an exception', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = {
				params: {
					_id: validMongoId
				}
			};
			const mockRes = { res: {} };
			const mockExec = sandbox.stub().rejects();
			const deckCardStub = 
				sandbox.stub(DeckCard, 'findByIdAndRemove').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndRemove(mockReq, mockRes)
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

			const mockExec = sandbox.stub().resolves(null);
			const deckCardStub = 
				sandbox.stub(DeckCard, 'findByIdAndRemove').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndRemove(mockReq, mockRes)
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
				sandbox.stub(DeckCard, 'findByIdAndRemove').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndRemove(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['OK']), 
							'passed args not expected');		
				});
		});

	});

	describe('#findByIdAndUpdate', () => {

		it('function named findByIdAndUpdate should exist', () => {
			assert.isFunction(deckCardCtrl.findByIdAndUpdate);
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

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');		
				});
		});

		it('should send a 400 if header \'content-type\' is undefined', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = { 
				headers: {},
				params: {
					_id: validMongoId
				}
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if header \'content-type\' doesn\'t equal \'application/json\'', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = { 
				headers: {
					'content-type': 'text'
				},
				params: {
					_id: validMongoId
				}
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body is undefined', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = { 
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				}
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body is null', () => {
			const validMongoId = 'a'.repeat('24');
			const mockReq = { 
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: null
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 when req.body doesn\'t have either a question or answer field', () => {
			const validMongoId = 'a'.repeat('24');
			const invalidDeckCard = { noQuestion: true };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.question is not an array', () => {
			const validMongoId = 'a'.repeat('24');
			const invalidDeckCard = { question: true };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.answer is not an array', () => {
			const validMongoId = 'a'.repeat('24');
			const invalidDeckCard = { answer: true };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.question is not an array of only strings', () => {
			const validMongoId = 'a'.repeat('24');
			const invalidDeckCard = { question: [true] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 400 if req.body.answer is not an array of only strings', () => {
			const validMongoId = 'a'.repeat('24');
			const invalidDeckCard = { answer: [true] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: invalidDeckCard
			};
			const mockRes = { res: {} };
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['BADREQ']), 
							'passed args not expected');			
				});
		});

		it('should send a 500 if DeckCard.findByIdAndUpdate throws an exception', () =>{
			const validMongoId = 'a'.repeat('24');
			const validDeckCard = { answer: ['true'], question: ['string'] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: validDeckCard
			};
			const mockRes = { res: {} };
			const mockExec = sandbox.stub().rejects();
			const deckCardStub = sandbox.stub(DeckCard, 'findByIdAndUpdate').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['SERVFAIL']), 
							'passed args not expected');		
				});
		});

		it('should send a 404 if DeckCard :_id does not exist in the db', () =>{
			const validMongoId = 'a'.repeat('24');
			const validDeckCard = { answer: ['true'], question: ['string'] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: validDeckCard
			};
			const mockRes = { res: {} };
			const mockExec = sandbox.stub().resolves(null);
			const deckCardStub = sandbox.stub(DeckCard, 'findByIdAndUpdate').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['NOTFOUND']), 
							'passed args not expected');		
				});
		});

		it('should send a 200 if DeckCard.findByIdAndUpdate resolves', () =>{
			const validMongoId = 'a'.repeat('24');
			const validDeckCard = { answer: ['true'], question: ['string'] };
			const mockReq = {
				headers: {
					'content-type': 'application/json'
				},
				params: {
					_id: validMongoId
				},
				body: validDeckCard
			};
			const mockRes = { res: {} };
			const mockExec = sandbox.stub().resolves();
			const deckCardStub = sandbox.stub(DeckCard, 'findByIdAndUpdate').returns({ exec: mockExec });
			const jsonResStub = sandbox.stub(jsonRes, 'send');

			return deckCardCtrl.findByIdAndUpdate(mockReq, mockRes)
				.then(() => {
						assert.equal(jsonResStub.called, true, 'should be called once');
						assert.equal(jsonResStub.calledTwice, false, 'shouldn\'t be called twice');
						assert(jsonResStub.calledWith(mockRes, resCode['OK']), 
							'passed args not expected');		
				});
		});

	});

});
