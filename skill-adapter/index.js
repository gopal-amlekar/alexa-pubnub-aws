'use strict';

// Intent processor module in the local directory
var intentProc = require('./intentProcessor');

//handler function is invoked by Alexa as index.handler.
// Change in the name of this function or the file needs change in AWS lambda configuration as well
exports.handler = function(event, context, callback)
{
	try
	{
		
		// Authenticate that we receive the request from our app only
		if (event.session.application.applicationId !== process.env.AMAZON_APP_KEY)
		{
			callback('Authentication failure');
		}
		
		// Session start
		if (event.session.new)
		{
			console.log('SESSION ',  event.session, ' started with request ID: ',  event.request.requestId);
		}
		
		// Invoked by voice command with the skill invocation name but without any specific command 
		// for e.g. 'Alexa, launch my home'
		// This just gives a voice feedback about capabilities of the skill 
		if (event.request.type === 'LaunchRequest')
		{
			var sessionAttributes = {};
			console.log ('Launch request');
			var speechletResponse = intentProc.buildSpeechletResponse
			("My Home Title", 
			"Welcome to my home, please tell me turn on or off some gadget ", 
			"What would you like to do?", 
			false);
			callback (null, intentProc.buildResponse (sessionAttributes, speechletResponse));
		}

		// When user speaks a valid command which turns into an intent, the intentrequest is invoked
		// Processing of intents takes place in intentprocessor.js
		else if (event.request.type === 'IntentRequest') 
		{
			intentProc.processIntent
			(
				event.request.intent,
				function(sessionAttributes, speechletResponse)
				{
                  console.log ('Final callback');
                  callback(null, intentProc.buildResponse (sessionAttributes, speechletResponse));
				}
			);
                  
			console.log ('Done with the intents');
			
		} // end all intent requests

		// End session
		else if (event.request.type === 'SessionEndedRequest')
		{
			console.log ('Session end');
		}
	} // End Try block
	catch (err)
	{
		callback(err);
	}

}	// end handler



