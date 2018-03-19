const Alexa = require('alexa-sdk');

const handlers = {
  'NewSession': function() {
    this.emit('LaunchRequest');
  },
  'LaunchRequest': function() {
    const speech = 'Welcome to the Alexa Skills Kit, you can say hello';
    const reprompt = 'You can say hello';
    this.emit(':ask', speech, reprompt);
  },
  'HelloWorldIntent': function() {
    var speech;

    if (this.event.request.intent.slots.Name && this.event.request.intent.slots.Name.value) {
      this.attributes.name = this.event.request.intent.slots.Name.value;
      if (this.attributes.name.toLowerCase() == 'newman') {
        speech = '<audio src="https://s3-us-west-2.amazonaws.com/alexasoundclips/HelloNewman2.mp3" />';
      } else {
        speech = 'Hello ' + this.attributes.name + ', it\'s nice to meet you. Are you having a good day?';
      }
    } else {
      // Just say Hello World
      speech = 'Hello World!';
    }

    this.emit(':ask', speech, 'You can say hello');
  },
  'AMAZON.HelpIntent': function() {
    // Tell them to say hello; keep the session alive
    this.emit(':ask', 'You can say hello to me!', 'You can say hello to me!');
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', 'Goodbye World!');
  },
  'AMAZON.StopIntent': function() {
    this.emit(':tell', 'Goodbye World!');
  },
  'AMAZON.YesIntent': function() {
    // If there is a name in the session attributes, use it
    var speech;

    speech = 'I\'m glad to hear that'
    if (this.attributes.name) {
      speech += (' ' + this.attributes.name);
    }
    this.emit(':tell', speech);
  },
  'AMAZON.NoIntent': function() {
    // If there is a name in the session attributes, use it
    var speech;

    speech = 'I\'m sorry to hear that'
    if (this.attributes.name) {
      speech += (' ' + this.attributes.name);
    }
    this.emit(':tell', speech);
  },
  'SessionEndedRequest': function() {
    this.emit(':tell', 'Goodbye!');
  },
  'Unhandled': function() {
    this.emit(':ask', 'I didn\'t get that. Try saying help', 'Try saying help');
  },
};

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
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
