[![Build Status](https://travis-ci.org/nbuhay/flashCards.svg?branch=master)](https://travis-ci.org/nbuhay/flashCards)
Create flash cards to study any subject.  Great for learning!

**Coding Reference**

[Mocha Gist](https://gist.github.com/samwize/8877226)

[Basic Mocha http.request](http://taylor.fausak.me/2013/02/17/testing-a-node-js-http-server-with-mocha/)

[Gracefully Shutdown MongoDb](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/#StartingandStoppingMongo-SendingshutdownServer%28%29messagefromthemongoshell)
mongod --dbpath data/db
(separate terminal)
mongo
use admin
db.shutdownServer()
exit

[Arrow Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
Two factors influenced the introduction of arrow functions: shorter functions and non-binding of this.

[Nodejs Docs HTTP.request](https://nodejs.org/dist/latest-v4.x/docs/api/http.html#http_http_request_options_callback)

[Node.js error-first callbacks](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/)

[Node.js error API docs](https://nodejs.org/api/errors.html)

[API Restful Error Design](https://apigee.com/about/blog/technology/restful-api-design-what-about-errors)
outsiders calling api, the api should be a black box
black box, system can be viewed as input/output function
errors are supposed to be given back to outsiders to help them understand 

APIs are supposed to make the developer successful
good to send correct error code, granular message, and possibly link to find out more

folks only use small set of http error codes
		200
		201
		304
		400
		401
		403
		404
		409
		410
		412
		500
[Joyent Node.js Error Practices](https://www.joyent.com/node-js/production/design/errors)

[MDN Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
	Async computation
	promise represent value which may be available now, or in the future, or never

	new Promise (/* executor */ function(resolve, reject) { ... } );
		immediately executor is invoked and passed resolve and reject functions
			executes some kind of work
			calls either resolve ore reject to resolve or reject the Promise
				if error, promise is rejected, return value of resolve ignored

A Promise is a proxy for a value not necessarily known when the promise is created. It allows you to associate handlers to an asynchronous action's eventual success value or failure reason. This lets asynchronous methods return values like synchronous methods: instead of the final value, the asynchronous method returns a promise for the value at some point in the future.

Pending: Initial state, not fulfilled or rejected
Fulfilled: completed successfully
Rejected:  operation failed


Promise

promise (resolve, reject)
	do your task
		if ok, resolve
		else reject


p.then
	okay what happened?
		do something with the result
	else error

[NODE_ENV for dev/prod](http://himanshu.gilani.info/blog/2012/09/26/bootstraping-a-node-dot-js-app-for-dev-slash-prod-environment/)

[Node Debugger](https://github.com/node-inspector/node-inspector)
[Actually Useful Instructions](http://kurtle.io/2015/11/01/how-to-set-up-node-inspector.html)
	THIS ONLY WORKS WITH node -v 6.3.1!!

	node-inspector & nodemond --debug

[Request Headers - when/not to JSON.parse](http://stackoverflow.com/questions/8081701/i-keep-getting-uncaught-syntaxerror-unexpected-token-o)

[better mocha testing](http://stackoverflow.com/questions/35170626/running-multiple-mocha-test-files-for-mongoose-are-broken)

[mongoose exec example](http://www.summa.com/blog/avoiding-callback-hell-while-using-mongoose)

[Need to use mongoose id object only when sending req params](http://stackoverflow.com/questions/17223517/mongoose-casterror-cast-to-objectid-failed-for-value-object-object-at-path)

[Unit testing mongoose models](https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/)

[Dependency Injection](https://blog.risingstack.com/dependency-injection-in-node-js/)

REQUIRED ENVS TO RUN

NODE_PATH=./
NODE_ENV=test || dev || prod

[Very important chai-as-promised doc](https://github.com/domenic/chai-as-promised)
[Stub out function and subsuquent calls with Sinon](http://stackoverflow.com/questions/27847377/using-sinon-to-stub-chained-mongoose-calls)

[Require Subvert - possible solution to testing jsonRes module](https://www.npmjs.com/package/require-subvert)

[NodeJS Things to Know](https://edgecoders.com/how-well-do-you-know-node-js-36b1473c01c8#.92m4l5dy5)

[AWS MongoDB](http://docs.aws.amazon.com/quickstart/latest/mongodb/architecture.html)

[Raspberry Pi Jesse](https://www.raspberrypi.org/blog/raspbian-jessie-is-here/)
[Install MongoDB on Jesse](https://meteor-universal.tumblr.com/post/113098361629/install-meteor-universal-on-raspberry-pi-model-b)
[Open MongoDB port on raspi](https://www.mkyong.com/mongodb/mongodb-allow-remote-access/)

[Forward Mongo Port](http://randomgeekery.org/post/2014/mongo-vagrant-connect/)