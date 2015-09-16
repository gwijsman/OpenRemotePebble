/**
 * OpenRemotePebble : defintion of the PORSwitch 
 * 
 *                    Pebble OpenRemote Switch
 *
 * Gert Wijsman mrt 2015
 */

//var UI = require('ui');
//var Vector2 = require('vector2');

var PORSwitch = function() {
    this.id = 0;
    this.text = 'text';
    this.sensor = 0;
    this.state = true;
    this.screenId = 0;

};

PORSwitch.prototype.debugLog = function() {
    console.log('SENSOR: ' + this.sensor);
    console.log('    ID: ' + this.id);
    console.log('  NAME: ' + this.text);
    console.log('STATUS: ' + this.status);
};

PORSwitch.prototype.statusText = function() {
    var statusText = '';
    if (this.status) {
	var statusText = 'Status is ON';
    } else {
	var statusText = 'Status is OFF';
    };
    return statusText;
};

module.exports = PORSwitch;
