/**
 * OpenRemotePebble : defintion of the PORStartWindow
 * 
 *                    Pebble OpenRemote Start Window 
 *
 * (c) Gert Wijsman mrt 2015
 */

var UI = require('ui');
var PORAjax = require('por/PORAjax'); 

var PORStartWindow = function() {
    this.window = new UI.Card({
	title: 'OpenRemote',
	body: 'Initialise with select'
    });
    this.window.on('click', 'select', this.clickSelect);
};

PORStartWindow.prototype.show = function() {
    this.window.show();
};

PORStartWindow.prototype.clickSelect = function() {
    var porAjax = new PORAjax();
    // Show splash
    var splashCard = new UI.Card({
	title: "Please Wait",
	body: "Downloading..."
    });
    splashCard.show();
    // Download data
    porAjax.getPanel();
};

module.exports = PORStartWindow;
