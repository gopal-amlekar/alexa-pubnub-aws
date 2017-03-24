'use strict';

// Export functions
module.exports =
{
	
	// Validate the intent and publish messge to Pubnub
	// No validation of device is done here. Device validation can be done at receiving end
	// Device names are all converted to lower case for consistency
	
	processIntent: function (intent, callback)
	{
		var intent_name = intent.name;
		var gadget = "No Gadget";
			
		var message = 
		{
			'command': "Waiting for command",
			'message' : "No message",
			'gadget' : gadget
		};
		
		if (intent_name === 'TurnOnIntent')
		{
			console.log ('Recd Turn On Intent');
			gadget = intent.slots.Item.value.toLowerCase();
			message = 
			{
				'command': 'TURN_ON',
				'message': "My home is Turning on the gadget",
				'gadget':  gadget
			};
			this.sendPNCommand (message, callback);
		}
		else if (intent_name === 'TurnOffIntent')
		{
			console.log ('Recd Turn Off Intent');
			gadget = intent.slots.Item.value.toLowerCase();
			message = 
			{
				'command': 'TURN_OFF',
				'message': "My home is Turning off the gadget",
				'gadget':  gadget
			};
			this.sendPNCommand (message, callback);						
		}
		else if (intent_name === 'SetValueIntent')
		{
			console.log ('Recd set value Intent');
			gadget = intent.slots.Item.value.toLowerCase();
			var value = intent.slots.amount.value;
			message = 
			{
				'command': 'SET_VALUE',
				'message': 'Setting value ',
				'gadget':  gadget,
				'value' : value
			};
			this.sendPNCommand (message, callback);				
		}
		else if (intent_name === 'AMAZON.HelpIntent')
		{
			console.log ('User Asking for Help');
			var sessionAttributes ={};
			callback
			(
				sessionAttributes, 
				this.buildSpeechletResponse
				(
					"My Home Title",
					"Welcome to my home. You can ask me to turn on a gadget or turn off a gadget." ,
					"Do you want me to do something?", false)
			);
		}
		else if (intent_name === 'AMAZON.StopIntent' || intent_name === 'AMAZON.CancelIntent') 
		{
			console.log ('User asking to stop');
			var sessionAttributes ={};
			callback
			(
				sessionAttributes, 
				this.buildSpeechletResponse
				(
					"My Home Title",
					"Hello user, Thank you for using my home" ,
					"", true)
			);			
		}
		else
		{
			console.log ("Recd invalid intent");
		}
				
	},
	
	// Publish message to Pubnub network
	// channel name, and publish key are read from environment variables
	
	sendPNCommand: function  (message, callback)
	{
		var PN = require("pubnub");
		var pn = new PN
		({
			ssl           : true,  // <- enable TLS Tunneling over TCP
			publish_key   : process.env.PUB_NUB_PUBLISH_KEY,
			subscribe_key : process.env.PUB_NUB_SUBSCRIBE_KEY
		});
		
		var output = message['message'] + " " + message['gadget'];
		console.log ("Trying to send message");
		
		pn.publish(
			{
				channel   : process.env.PUB_NUB_CHANNEL_KEY,	
				message   : message
			},
			
			function (status, response)
			{
				console.log ("Callback fired");
				if (status.error)
				{
					console.log("Failed publish", status, response);
				}
				else
				{
					console.log("Succeedded publish", status, response);
				}
			}
		);
		console.log ("Sent messge, exepcted callback");
		var sessionAttributes = {};		
		callback
		(
			sessionAttributes,
			this.buildSpeechletResponse("My Home Title", output, "What else you want to do?", true)
		);
	},
	
	// Build the response for sending back to user
	// This includes the voice feedback to be played back to user
	// Card is not used in this as the app is not mobile or web version so no cards are displayed
	
	buildSpeechletResponse: function(title, output, repromptText, shouldEndSession)
	{
		console.log ("Building speechlet response");
		return(
		{
			'outputSpeech':
			{
				'type': 'PlainText',
				'text': output,
			},
			/*
			card:
			{
                'type': 'Simple',
                'title': title,
                content: output
            },
            */ 
			'reprompt':
			{
				'outputSpeech':
				{
					'type': 'PlainText',
					'text': repromptText
				}
			},
			'shouldEndSession': shouldEndSession
		});
	},

	buildResponse: function(sessionAttributes, speechletResponse)
	{
		console.log ("Building final response");
		console.log (speechletResponse);
		return {
			'version': '1.0',
			'sessionAttributes': sessionAttributes,
			'response': speechletResponse
		};
	},		

	
} // end main 
