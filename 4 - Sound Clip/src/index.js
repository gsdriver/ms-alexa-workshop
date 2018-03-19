/*
 * See https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference
 * for documentation about the response object
 */
function buildResponse(speech, shouldEndSession, reprompt, nameToSave, ssml) {
  const alexaResponse = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: speech,
      },
      shouldEndSession: shouldEndSession,
    },
  };

  // If there is a name to save, persist it in the sessionAttributes
  if (nameToSave) {
    alexaResponse.sessionAttributes = {name: nameToSave};
  }

  // If present, use SSML instead of plain-text speech
  if (ssml) {
    alexaResponse.response.outputSpeech.type = 'SSML';
    alexaResponse.response.outputSpeech.ssml = ssml;
  }

  // Reprompt is the text Alexa will speak if the user doesn't respond to
  // the prompt in a certain amount of time
  if (reprompt) {
    alexaResponse.response.reprompt = {
      outputSpeech: {
        type: 'PlainText',
        text: reprompt,
      },
    };
  }

  return alexaResponse;
}

/*
 * onLaunch is called when the user says "open" to start a skill
 */
function onLaunch(launchRequest, context) {
  const speech = 'Welcome to the Alexa Skills Kit, you can say hello';
  const reprompt = 'You can say hello';

  // We are going to send a welcome and a reprompt telling the user what they can do
  // We want to keep the session open so they can continue to interact
  const response = buildResponse(speech, false, reprompt);
  context.succeed(response);
}

/*
 * onSessionEnded is called when the user has ended their interaction with this skill
 * (e.g. says "bye" or "quit"); cleanup code can go here but no voice response is
 * expected from this function
 */
function onSessionEnded(endRequest, context) {
  // No clean-up for this skill
  context.succeed();
}

/*
 * onIntent is called when the user has specified an intent - something they want to do
 * This skill only supports the custom "Hello World" intent and the built-in Help intent
 */
function onIntent(intentRequest, context, session) {
  var response;

  switch (intentRequest.intent.name)
  {
    case 'HelloWorldIntent':
      // Say Hello world - that's it, we can end the session after we've talked
      var speech;
      var nameToSave;
      var ssml;

      if (intentRequest.intent.slots.Name && intentRequest.intent.slots.Name.value) {
        nameToSave = intentRequest.intent.slots.Name.value;
        if (nameToSave.toLowerCase() == 'newman') {
          ssml = '<speak><audio src="https://s3-us-west-2.amazonaws.com/alexasoundclips/HelloNewman2.mp3" /></speak>';
        }
        speech = 'Hello ' + nameToSave + ', it\'s nice to meet you. Are you having a good day?';
      } else {
        // Just say Hello World
        speech = 'Hello World!';
      }

      response = buildResponse(speech, true, null, nameToSave, ssml);
      context.succeed(response);
      break;
    case 'AMAZON.HelpIntent':
      // Tell them to say hello; keep the session alive
      response = buildResponse('You can say hello to me!', false, 'You can say hello to me!');
      context.succeed(response);
      break;
    case 'AMAZON.CancelIntent':
    case 'AMAZON.StopIntent':
      response = buildResponse('Goodbye World!', true);
      context.succeed(response);
      break;
    case 'AMAZON.YesIntent':
      // If there is a name in the session attributes, use it
      var speech;

      speech = 'I\'m glad to hear that'
      if (session.attributes && session.attributes.name) {
        speech += (' ' + session.attributes.name);
      }
      response = buildResponse(speech, true, null);
      context.succeed(response);
      break;
    case 'AMAZON.NoIntent':
      // If there is a name in the session attributes, use it
      var speech;

      speech = 'I\'m sorry to hear that'
      if (session.attributes && session.attributes.name) {
        speech += (' ' + session.attributes.name);
      }
      response = buildResponse(speech, true, null);
      context.succeed(response);
      break;
    default:
      throw ('Unknown intent ' + intentRequest.intent.name);
  }
}

/*
 * Handler that responds to Alexa request
 * You are passed an event object that contains the request and session information
 * and a context object with a success and fail function to callback
 */
/*
 * Handler that responds to Alexa request
 * You are passed an event object that contains the request and session information
 * and a context object with a success and fail function to callback
 */
exports.handler = function (event, context) {
  try
  {
    // Check the request type and route accordingly
    switch (event.request.type)
    {
      case 'LaunchRequest':
        onLaunch(event.request, context);
        break;

      case 'SessionEndedRequest':
        onSessionEnded(event.request, context);
        break;

      case 'IntentRequest':
        onIntent(event.request, context, event.session);
        break;
    }
  }
  catch (e)
  {
    console.log('Unexpected exception ' + e);
    context.fail(e);
  }
};
