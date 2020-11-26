/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const WebSocket = require('ws');
const moment = require('moment');
const url = require('url');


// modify the url below to that of your JMRI instance
// do not remove surrounding single quotes and retain ending slash ie:
const jmriUrl = url.parse('http://your.trainset.com:12080/json/');

// setup global variables based on the url provided for later use
const jmriProtocol = jmriUrl.protocol.slice(0,-1);
const jmriHostname = jmriUrl.hostname;
const jmriPort = jmriUrl.port;
const jmriPathname = jmriUrl.pathname;

// setting some global variables for train and throttle info
var jmriLocoID;
var jmriLocoAddress;
var lookupErrorReturned;

const GetRosterDataHandler = {
// Retrieve Roster information from JMRI

  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetRosterDataIntent';
  },
  async handle(handlerInput) {
    // set some default speach and card information specifically in case nothing is in the Roster
    let outputSpeech = "There aren't any trains in your JMRI Roster";
    let cardTitle = 'Your train roster';
    let cardText = "There are no trains in your JMRI Roster";

    // request the Roster Information from the JMRI JSON server
    await getRemoteData(jmriProtocol + "://" + jmriHostname + ":" + jmriPort + jmriPathname + "roster")
    .then((response) => {
        //process the response
        const data = JSON.parse(response);

        // when more than one item in the roster build the output for each item
        if (data.length >= 1) {
          outputSpeech = `JMRI manages ${data.length} train`;
          cardText = "Train Addresses: \n";

          // setup a loop to process the Roster
          for (let i = 0; i < data.length; i++) {

            if (i === 0) {
              // process the first record returned
		if (data.length === 1) {
		    // if we only have one item lets address it specifically
		    outputSpeech = outputSpeech + ". It's address is: " + data[i].data.address;
		    cardText = cardText + data[i].data.address;
		} else {
		    // if we have more than one item lets address them together
		    outputSpeech = outputSpeech + "'s. Their addresses are: " + data[i].data.address + ', ';
		    cardText = cardText + data[i].data.address + ', ';
		}	
	    } else if (i === data.length - 1) {
              //if this is the last record lets throw 'and' before it
                outputSpeech = outputSpeech + 'and ' + data[i].data.address + '.';
                cardText = cardText + 'and ' + data[i].data.address + '.';
            } else {
                //comma separate middle records
                outputSpeech = outputSpeech + data[i].data.address + ', ';
                cardText = cardText + data[i].data.address + ', ';
            }
         }
       }
    })

      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .withSimpleCard(cardTitle, cardText)
      .getResponse();

  },
};

const GetTurnoutDataHandler = {
// Retrieve Turnout information from JMRI

  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetTurnoutDataIntent';
  },
  async handle(handlerInput) {
    // set some default speach and card information specifically in case nothing is in the Turnout
    let outputSpeech = "There are no turnouts setup in JMRI";
    let cardTitle = 'Your Turnouts';
    let cardText = "There are no turnouts";

    // request the Turnout Information from the JMRI JSON server
    await getRemoteData(jmriProtocol + "://" + jmriHostname + ":" + jmriPort + jmriPathname + "turnout")
    .then((response) => {
        //process the response
        const data = JSON.parse(response);

        // when more than one turnout build the output for each item
        if (data.length >= 1) {
          outputSpeech = `JMRI manages ${data.length} turnout`;
          cardText = "Turnout Names: \n";

          // setup a loop to process the Turnout
          for (let i = 0; i < data.length; i++) {

            if (i === 0) {
              // process the first record returned
		if (data.length === 1) {
		    // if we only have one item lets address it specifically
		    outputSpeech = outputSpeech + ". It's name is: " + data[i].data.userName;
		    cardText = cardText + data[i].data.userName;
		} else {
		    // if we have more than one item lets address them together
		    outputSpeech = outputSpeech + "'s. Their names are: " + data[i].data.userName + ', ';
		    cardText = cardText + data[i].data.userName + ', ';
		}	
	    } else if (i === data.length - 1) {
              //if this is the last record lets throw 'and' before it
                outputSpeech = outputSpeech + 'and ' + data[i].data.userName + '.';
                cardText = cardText + 'and ' + data[i].data.userName + '.';
            } else {
                //comma separate middle records
                outputSpeech = outputSpeech + data[i].data.userName + ', ';
                cardText = cardText + data[i].data.userName + ', ';
            }
         }
       }
    })

      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .withSimpleCard(cardTitle, cardText)
      .getResponse();

  },
};

const GetPowerDataHandler = {
// Return the state of the power
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetPowerDataIntent';
  },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';

    //Retrieve the current state of the power from JMRI's JSON server
    await getRemoteData(jmriProtocol + "://" + jmriHostname + ":" + jmriPort + jmriPathname + "power")
      .then((response) => {
        // process the response and define outputSpeech prefix
        const data = JSON.parse(response);
        outputSpeech = `The track is `;

        // setup a loop for processing the power of each returned controller
        for (let i = 0; i < data.length; i++) {
          // determine the current state
          if (data[i].data.state == 2) {
            //Track power is on
            outputSpeech = outputSpeech + 'powered on'
          } else if (data[i].data.state == 4) {
            //Track power is off
            outputSpeech = outputSpeech + 'powered off'
          } else {
            //Unknown
            outputSpeech = outputSpeech + ' in an unknown state'
          }
        }
      })

      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

const RestPowerIntentHandler = {
  // Send a REST call to modify the current power state
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RestPowerIntent';
  },

  async handle(handlerInput) {
    // capture the pwower state requested by the user
    let powerSlotTypeRequested = handlerInput.requestEnvelope.request.intent.slots.powerSlot.value;

    if (powerSlotTypeRequested == "off" || powerSlotTypeRequested == "stop") {
      //Send JSON request to turn off the track power
      putRemoteData(jmriHostname, jmriPathname + "power", jmriPort, { state: 4 })
      outputSpeech = "I've turned the track power off"
    } else if (powerSlotTypeRequested == "on" || powerSlotTypeRequested == "start") {
      //Send JSON reqeust to turn on the track power
      putRemoteData(jmriHostname, jmriPathname + "power", jmriPort, { state: 2 })
      outputSpeech = "I've turned the track power on"
    } else {
      //Unknown
      outputSpeech = "I can't do that right now, something went wrong."
    }

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
};

const RestTurnoutIntentHandler = {
  // Send a REST call to modify the current turnout state

  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RestTurnoutIntent';
  },

  async handle(handlerInput) {
    // capture the turnout state requested by the user
    let turnoutStateRequested = handlerInput.requestEnvelope.request.intent.slots.turnoutSlot.value;
    let turnoutRequested = handlerInput.requestEnvelope.request.intent.slots.turnoutQueryQualifier.value;

    await lookupTurnout(turnoutRequested)

    if (lookupErrorReturned !== true) { 

       if (turnoutStateRequested == "off" || turnoutStateRequested == "close") {
         //Send JSON request to close the turnout
         putRemoteData(jmriHostname, jmriPathname + "turnout" + "/" + jmriTurnoutUserName, jmriPort, { state: 2 })
         outputSpeech = "I've closed the " + turnoutRequested + " turnout"

       } else if (turnoutStateRequested == "on" || turnoutStateRequested == "throw") {
         //Send JSON reqeust to throw the turnout
         putRemoteData(jmriHostname, jmriPathname + "turnout" + "/" + jmriTurnoutUserName, jmriPort, { state: 4 })
         outputSpeech = "I've thrown the " + turnoutRequested + " turnout"
       }

    } else {
	outputSpeech = "The requested turnout, " + turnoutRequested + ", cannot be found in JMRI"
        cardTitle = "Error"
	cardText = "The requested turnout, " + turnoutRequested + ", cannot be found in JMRI"
	lookupErrorReturned = false 
    }

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
};

const WebsocketThrottleHandler = {
  // Manage the throttle speed using JMRIs Websockets //  
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'WebsocketThrottleIntent';
  },

  async handle(handlerInput) {
    // set some default card information
    let cardTitle = "Throttle Speed"
    let cardText = " throttle speed was set to: "

    // capture the requested speed provided by the user and set some default variables
    let ThrottleSpeedNumberRequested = handlerInput.requestEnvelope.request.intent.slots.ThrottleSpeedNumber.value;
    let AdjustedThrottleSpeed = 0
    let FinalThrottleSpeed = 0

    // force values greater than 100 to be reduced to 100
    if (ThrottleSpeedNumberRequested > 100) {
      AdjustedThrottleSpeed = 100
      console.log("Bigger than 100")
    } else {
      AdjustedThrottleSpeed = ThrottleSpeedNumberRequested
      console.log("Using sane number " + AdjustedThrottleSpeed)
    }

    // calculate the proper value for sending to JMRI
    FinalThrottleSpeed = AdjustedThrottleSpeed * .010
    console.log("Number was modified from : " + AdjustedThrottleSpeed + " to " + FinalThrottleSpeed)

    // detect if the user asked to move a specific address
    if ('value' in handlerInput.requestEnvelope.request.intent.slots['addressNumberSlot'] && handlerInput.requestEnvelope.request.intent.slots.addressNumberSlot.value !== "?") {
      jmriLocoAddress = handlerInput.requestEnvelope.request.intent.slots.addressNumberSlot.value
          console.log("Loco Address Requested: " + jmriLocoAddress)
      console.log("We were given an address specifically for lookup")
      // we have have an address number to lookup
      await lookupLocoInfo(jmriLocoAddress)
    } else {
	console.log("We were NOT given an address specifically for lookup, we attempt to assume the first roster entry")
      // perform the lookup and store the return in an array 
      await lookupLocoInfo()
    }

    if (lookupErrorReturned !== true) { 

	    // build JSON request that will be provided to JMRI
	    let ThrottleWebsocketJSONRequest = '{"type":"throttle","data":{"speed":' + FinalThrottleSpeed + ',"throttle":"' + jmriLocoID + '","address":' + jmriLocoAddress + '}}'
	    console.log("ThrottleWebsocketJSONRequest: " + ThrottleWebsocketJSONRequest)
	
	    // send the JSON request to JMRI
	    sendWebsocketData(jmriHostname, jmriPathname, jmriPort, ThrottleWebsocketJSONRequest)
	
	    outputSpeech = jmriLocoID + " throttle speed was set to " + FinalThrottleSpeed * 100 + " percent."
	    cardText = jmriLocoID + cardText + FinalThrottleSpeed * 100 + "%"

    } else {
	outputSpeech = "The requested train cannot be found in your JMRI roster"
        cardTitle = "Error"
	cardText = "The requested train cannot be found in your JMRI roster."
	lookupErrorReturned = false 
    }

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      // display a card alongside the voice output
      .withSimpleCard(cardTitle, cardText)
      .getResponse();
  },
};

const WebsocketDirectionHandler = {
  // Manage the direction of the train using JMRIs websockets
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'WebsocketDirectionIntent';
  },

  async handle(handlerInput) {
    // caputre the direction request and setup default values
    let DirectionRequested = handlerInput.requestEnvelope.request.intent.slots.directionSlot.value;
    let DirectionBool = "true"

    // detect if the user requested a specifcic address and capture it
    if ('value' in handlerInput.requestEnvelope.request.intent.slots['addressNumberSlot'] && handlerInput.requestEnvelope.request.intent.slots.directionSlot.value !== "?") {
      jmriLocoAddress = handlerInput.requestEnvelope.request.intent.slots.addressNumberSlot.value
      console.log("Loco Address Requested: " + jmriLocoAddress)
      console.log("We were given an address specifically for lookup")
      // we have have an address number to lookup
      await lookupLocoInfo(jmriLocoAddress)
    } else {
	console.log("We were NOT given an address specifically for lookup, we attempt to assume the first roster entry")
      // perform the lookup and store the return in an array 
      await lookupLocoInfo()
    }

    if (lookupErrorReturned !== true) { 

	    // detect if the user requested a duration in their request (for rewind) and capture it
	    if ('value' in handlerInput.requestEnvelope.request.intent.slots['directionTimerSlot'] && handlerInput.requestEnvelope.request.intent.slots.directionTimerSlot.value !== "?") {
	      var RewindTimerRequested = handlerInput.requestEnvelope.request.intent.slots.directionTimerSlot.value
	      console.log("Rewind Timer Request: " + RewindTimerRequested)
	
	      // convert the requested duration value from ISO_8601 into numerical milliseconds
	      var RewindTimerMilliseconds = moment.duration(RewindTimerRequested, moment.ISO_8601).asMilliseconds();
	      console.log("Rewind Timer In Milliseconds: " + RewindTimerMilliseconds)
	
	    }
	
	    // determine the direction wanted to move the train and set the proper JSON value for JMRI (backwards->false forward->true
	    if (DirectionRequested.match(/^(backward|backwards|reverse|rewind)$/)) {
	      DirectionBool = "false"
	      console.log("Reverse filter matched, DirectionBool set to: " + DirectionBool)
	    } else {
	      DirectionBool = "true"
	      console.log("Reverse filter WAS NOT matched, DirectionBool set to: " + DirectionBool)
	    }
	
	    // build the JSON request that will be sent to JMRI
	    let ThrottleWebsocketJSONRequest = '{"type":"throttle","data":{"forward":' + DirectionBool + ',"throttle":"' + jmriLocoID + '","address":' + jmriLocoAddress + '}}'
	    console.log("ThrottleWebsocketJSONRequest: " + ThrottleWebsocketJSONRequest)
	
	    // Process the request accounting for modifications for rewind requests
	    if (typeof RewindTimerRequested !== 'undefined') {
	      console.log("Rewind was matched; Setting InverseDirectionBool")
	
	      // set a variable for the opposite direction requested
	      if (DirectionBool === "true") {
	        var InverseDirectionBool = "false"
	      } else {
	        var InverseDirectionBool = "true"
	      }
	      console.log("InverseDirectionBool is now: " + InverseDirectionBool)
	
	      // bulid the inverted JSON request that will be used for restoring the trains original direction
	      var InverseThrottleWebsocketJSONRequest = '{"type":"throttle","data":{"forward":' + InverseDirectionBool + ',"throttle":"' + jmriLocoID + '","address":' + jmriLocoAddress + '}}'
	      console.log("InverseThrottleWebsocketJSONRequest: " + InverseThrottleWebsocketJSONRequest)
	
	      // setup a JSON reqeust to set the speed of the train to 0 so the train "stops"
	      var ZeroThrottleWebsocketJSONRequest = '{"type":"throttle","data":{"speed":0,"throttle":"' + jmriLocoID + '","address":' + jmriLocoAddress + '}}'
	
	      outputSpeech = jmriLocoID + " has been rewound."
	
	    } else {
	
	      // state the direction of the train
	      if (DirectionRequested.match(/^(backward|backwards)$/)) {
	        // make a phonetical adjustment to the word "backwards" in the speech so it doesn't
	        // sound like "backwoods", way to go Alexa.
	        outputSpeech = jmriLocoID + "'s direction was set to backwords."
	      } else {
	        outputSpeech = jmriLocoID + "'s direction was set to " + DirectionRequested
	      }
	    }
	
	    console.log("OutputSpeech set to: " + outputSpeech)
	
	    // send the JSON requests pertinent to the users request
	    if (typeof RewindTimerRequested !== 'undefined') {
	    // the user has asked to rewind for a duration of time
	      console.log("Rewind the train for :" + RewindTimerRequested)
	      // send the JSON request to make the train go in the reverse direction
	      sendWebsocketData(jmriHostname, jmriPathname, jmriPort, ThrottleWebsocketJSONRequest)
	      console.log("Begin sleep for: " + RewindTimerMilliseconds)
	      // wait out the duration of time the user specified
	      // note lambda defaults to 8sec timeouts; extend this in your lambda function to support longer times
	      await sleep(RewindTimerMilliseconds)
	      console.log("End sleep")
	      console.log("Setting the throttle to 0 to halt it")
	      // send a JSON reqeust to set the throttle speed to 0 to stop the car without shutting down the power
	      sendWebsocketData(jmriHostname, jmriPathname, jmriPort, ZeroThrottleWebsocketJSONRequest)
	      // wait 2 seconds before sending the next request to prevent a race
	      await sleep(2000)
	      console.log("Resetting the train to its previous direction" + InverseThrottleWebsocketJSONRequest)
	      // return the train back to its initial direction value so when its moved it continues in the same direction
	      sendWebsocketData(jmriHostname, jmriPathname, jmriPort, InverseThrottleWebsocketJSONRequest)
	    } else {
	    // this is not a duration based action just change the direction
	      console.log("Setting new train direction to:" + DirectionRequested)
	      sendWebsocketData(jmriHostname, jmriPathname, jmriPort, ThrottleWebsocketJSONRequest)
	      handlerInput.responseBuilder.getResponse();
	    }

    } else {
	outputSpeech = "The requested train cannot be found in your JMRI roster"
	lookupErrorReturned = false 
    }

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

const HelpIntentHandler = {
  // Help interaction, also the LaunchRequest
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
      (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent');
  },
  handle(handlerInput) {
    const speechText = 'I can help you manage your trains, turnouts and more.  Ask me something like, is the track power on? or, what trains do I have?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  // Cancel interaction
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  // generic errors such as unknown intents
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const RoarAudioHandler = {
  // make a train sound
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RoarAudioIntent';
  },
  async handle(handlerInput) {

    let RoarAudio = '<audio src="https://s3.amazonaws.com/alexa-mytrainset/alexa-mytrainset-train-honk.mp3" />';

    return handlerInput.responseBuilder
      .speak(RoarAudio)
      .getResponse();

  },
};

const getRemoteData = async function(remoteDataUrl) {
  // Retrieve values from the JRMI JSON server via REST
  // requires providing a url to the JSON server
  console.log("inside getRemoteData: " + remoteDataUrl)
  return new Promise((resolve, reject) => {
  console.log("inside promise: " + remoteDataUrl)
    var clientProtoLib = remoteDataUrl.startsWith('https') ? require('https') : require('http');
    var clientProtoRequest = clientProtoLib.get(remoteDataUrl, (response) => {
      console.log("clientProtoLib: " + clientProtoLib)
      console.log("clientProtoRequest: " + clientProtoRequest)
      console.log("response: " + response)
      // check for basic failures codes
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      // define an array and store JSON clientProtoRequest inside of it
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
      console.log("body: " + body)
    });
    clientProtoRequest.on('error', (err) => reject(err))
    console.log("completing promise.")
  })
};

const putRemoteData = function(host, path, port, json, method, ssl) {
  // Modify values from the JMRI JSON server via Rest
  // requires; host, path, port, json, method, and ssl

  // store the json value provided in a variable as proper JSON
  let bodyString = JSON.stringify(json)
  console.log("json parameter: " + json)
  console.log("json stringify: " + bodyString)

  // set required REST headers
  let headers = {
    'Content-Type': 'application/json',
    'Content-Length': bodyString.length
  };

  console.log("bodyString length: " + bodyString.length)

  // set the default value for method to POST when not provided
  if (typeof method === 'undefined') {
    method = 'POST'
  }

  // store the provided values in appropriate variables for REST requirements
  let options = {
    host: host,
    path: path,
    port: port,
    method: method,
    headers: headers
  };

  console.log("host: " + host)
  console.log("path: " + path)
  console.log("port: " + port)

  let callback = function(response) {
    let str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function(chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
      console.log("complete response: " + str);
    });
  };

  // determine which method to use based on value of ssl
  if (typeof ssl === 'undefined') {
    let http = require('http');
    // send request via http
    http.request(options, callback).write(bodyString);
  } else {
    let https = require('https');
    // send request via https
    https.request(options, callback).write(bodyString);
  }

  console.log("ssl state: " + ssl)

}

const sendWebsocketData = function(host, path, port, json, ssl) {
// buid a function for sending data to JMRI via Websockets
// requries host, path, port, json and optional ssl

  // set the communication method based on ssl value
  if (typeof ssl === 'undefined') {
    var socketUrl = "ws://" + host + ":" + port + path
  } else {
    var socketUrl = "wss://" + host + ":" + port + path
  }

  // open a websocket connection
  const connection = new WebSocket(socketUrl)
  connection.onopen = () => {

    // send the json request to the socket
    connection.send(json)
    console.log("URL: " + socketUrl)
    console.log("Sent message: " + json)

    // close the websocket connection
    connection.close()
  }

  connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
  }
}

const sleep = function(ms) {
// pause for x ms
  return new Promise(resolve => setTimeout(resolve, ms));
  console.log("Entered sleep() function")
}

const lookupLocoInfo = async function (locoLookupAddress) {
// perform a roster lookup for the train ID and Address given

    await getRemoteData(jmriProtocol + "://" + jmriHostname + ":" + jmriPort + jmriPathname + "roster")
    .then((response) => {
	var rosterEntries = JSON.parse(response);
	console.log("Here is what was returned: " + rosterEntries)
	// make sure there are trains in the roster
	if (rosterEntries.length === 0) {
	    // there are no cars in the Roster so set an error boolean
	    lookupErrorReturned = true
	    console.log("There are no cars in the roster, quit.")
	} else {
	    if (typeof locoLookupAddress === 'undefined') {
		// we weren't told an address so we will assume the first roster entry information
		jmriLocoID = rosterEntries[0].data.name
		jmriLocoAddress = rosterEntries[0].data.address
		console.log("rosterEntries length: " + rosterEntries.length)
		console.log("locoLookupAddress not given: using first roster entry;  jmriLocoID: " + jmriLocoID + "  jmriLocoAddress: " + jmriLocoAddress)
	    } else {
		// setup a loop to perform a lookup 
		rosterMatchLoop:
		for (let i = 0; i < rosterEntries.length; i++) {
		    // check if the current loop value matches the address
		    if (rosterEntries[i].data.address != locoLookupAddress) {
			lookupErrorReturned = true
			console.log("No Match, lookupErrorReturned: " + lookupErrorReturned)
		    } else { 
			// there is no error matching (match was found), set a special bool for later use to inform the user
			jmriLocoID = rosterEntries[i].data.name
			jmriLocoAddress = rosterEntries[i].data.address
			lookupErrorReturned = false
			console.log("Roster Matched;  jmriLocoID: " + jmriLocoID + " jmriLocoAddress: " + jmriLocoAddress + " lookupErrorReturned: " + lookupErrorReturned)
			break rosterMatchLoop;
		    }
		}
	    }
	}
    })   

    .catch((err) => {
	//set an optional error message here
	//outputSpeech = err.message;
    });
}

const lookupTurnout = async function (turnoutLookupUserName) {
// perform a lookup in the turnout table to determine if there is a valid turnout based on userName

    await getRemoteData(jmriProtocol + "://" + jmriHostname + ":" + jmriPort + jmriPathname + "turnout")
    .then((response) => {
	var turnoutEntries = JSON.parse(response);
	console.log("Here is what was returned: " + turnoutEntries)
	// make sure there are turnouts in the table
	if (turnoutEntries.length === 0) {
	    // there are no turnouts so set an error boolean
	    lookupErrorReturned = true
	    console.log("There are no turnouts in the table, quit.")
	} else {
	    if (typeof turnoutLookupUserName === 'undefined') {
                // BETA: This is not fully implemented yet - it may become overcome by events and removed in a future version
                //       If a turnout name is not given capture the first turnout in the table
                //       Currently *.data.name is not used but left for a potential future use case
		jmriTurnoutAddress = turnoutEntries[0].data.name
		jmriTurnoutUserName = turnoutEntries[0].data.userName.replace(/\s+/g, '%20')
		console.log("turnoutEntries length: " + turnoutEntries.length)
		console.log("turnoutLookupUserName not given: using first table entry;  jmriTurnoutAddress: " + jmriTurnoutAddress + "  jmriTurnoutUserName: " + jmriTurnoutUserName)
	    } else {
                // force current loop entry lowercase and remove whitespace for more accurate matching
                let lowercaseTurnoutLookupUserName = turnoutLookupUserName.toLowerCase() 
	        console.log("Converted turnoutLookupUserName from: " + turnoutLookupUserName + " to: " + lowercaseTurnoutLookupUserName)
                let compactedTurnoutLookupUserName = lowercaseTurnoutLookupUserName.replace(/\s+/g, '')
	        console.log("Converted lowercaseTurnoutLookupUserName from: " + lowercaseTurnoutLookupUserName + " to: " + compactedTurnoutLookupUserName)

		// setup a loop to perform a lookup 
		turnoutMatchLoop:
		for (let i = 0; i < turnoutEntries.length; i++) {
                    // force current loop entry lowercase and remove whitespace for more accurate matching
                    let lowercaseCurrentTurnoutEntry = turnoutEntries[i].data.userName.toLowerCase() 
	            console.log("Set lowercaseCurrentTurnoutEntry from: " + turnoutEntries[i].data.userName + " to: " + lowercaseCurrentTurnoutEntry)
                    let compactedCurrentTurnoutEntry = lowercaseCurrentTurnoutEntry.replace(/\s+/g, '')
	            console.log("Set compactedCurrentTurnoutEntry from: " + lowercaseCurrentTurnoutEntry + " to: " + compactedCurrentTurnoutEntry)
                    
		    // check if the current loop value matches the userName
		    if (compactedTurnoutLookupUserName != compactedCurrentTurnoutEntry) {
			lookupErrorReturned = true
			console.log("No Match, lookupErrorReturned: " + lookupErrorReturned)
		    } else { 
			// there is no error matching (match was found), set a special bool for later use to inform the user
                        // replace any whitespace in userName with %20 so it doesn't break the request URL
			jmriTurnoutAddress = turnoutEntries[i].data.name
			jmriTurnoutUserName = turnoutEntries[i].data.userName.replace(/\s+/g, '%20')
			lookupErrorReturned = false
			console.log("Turnout Matched;  jmriTurnoutAddress: " + jmriTurnoutAddress + " jmriTurnoutUserName: " + jmriTurnoutUserName + " lookupErrorReturned: " + lookupErrorReturned)
			break turnoutMatchLoop;
		    }
		}
	    }
	}
    })   

    .catch((err) => {
	//set an optional error message here
	//outputSpeech = err.message;
    });
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetRosterDataHandler,
    GetTurnoutDataHandler,
    GetPowerDataHandler,
    RestPowerIntentHandler,
    RestTurnoutIntentHandler,
    WebsocketDirectionHandler,
    WebsocketThrottleHandler,
    RoarAudioHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
