/**
 * OpenRemotePebble
 *
 * (c) Gert Wijsman mrt 2015
 */

var orUrl = 'http://openremote.wijsmanlocal:8080/controller/rest';

// global array of Switch definitions
var Switches = [];

var PORStartWindow = require('por/PORStartWindow');

var win = new PORStartWindow();

win.show();


var Settings = require('settings');

// Set a configurable with just the close callback
Settings.config(
  { url: 'http://www.wijsman.net/OpenRemotePebble/Settings/' },
  function(e) {
    console.log('closed configurable');

    // Show the parsed response
    console.log(JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);
