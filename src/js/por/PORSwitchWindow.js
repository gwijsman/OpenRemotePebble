/**
 * OpenRemotePebble : defintion of the PORSwitchwindow
 * 
 *                    Pebble OpenRemote Switch
 *
 * Gert Wijsman mrt 2015
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var orUrl = 'http://openremote.wijsmanlocal:8080/controller/rest';

var PORSwitchWindow = function(sw) {
    this.orSwitch = sw;
    this.window = new UI.Window();
    this.background = new UI.Rect({
	position: new Vector2(10, 20),
	size: new Vector2(124, 120),
	backgroundColor: 'white'
    });
    this.title = new UI.Text(
	{
	    text: 'Titel',
	    position: new Vector2(0, 25),
	    size: new Vector2(144, 30),
	    font: 'gothic-24-bold',
	    color: 'black',
	    textAlign: 'center'
	});
    this.body = new UI.Text(
	{
	    text: 'body',
	    position: new Vector2(0, 65),
	    size: new Vector2(144, 30),
	    font: 'gothic-24-bold',
	    color: 'black',
	    textAlign: 'center'
	});
    this.window.add(this.background);
    this.window.add(this.title);
    this.window.add(this.body);
    this.initializeClickEvents();
    this.show();
};

PORSwitchWindow.prototype.show = function() {
    this.updateTitleText();
    this.updateBodyText();
    this.window.show();
    this.callSensorForStatus();
};

PORSwitchWindow.prototype.initializeClickEvents = function() {
    var that = this;
    var clickup = function () {
	that.myClickUp();
    };
    this.window.on('click', 'up', clickup);
    var clickselect = function () {
	that.myClickSelect();
    };
    this.window.on('click', 'select', clickselect);
    var clickdown = function () {
	that.myClickDown();
    };
    this.window.on('click', 'down', clickdown);
};

PORSwitchWindow.prototype.callSensorForStatus = function() {
    var URL = orUrl + '/status/' + this.orSwitch.sensor + '?callback=sensor';
    console.log(URL);
    var that = this;
    var sensor =function(data) {
	that.updateSwitchForSensorData(data);
    };
    ajax({url: URL},
	 function(jsonp) {
	     // Data is supplied here
	     console.log('Sensor Success: ' + jsonp);
	     eval(jsonp);
	 },
	 function(error) {
	     console.log('Sensor Failed: ' + error);
	 }
	);
};

PORSwitchWindow.prototype.myClickUp = function() {
    console.log('klikkerdeklik up'); 
};

PORSwitchWindow.prototype.myClickSelect = function() {
    console.log('klikkerdeklik select'); 
    this.doSwitchAction();
};

PORSwitchWindow.prototype.myClickDown = function() {
    console.log('klikkerdeklik down'); 
};

PORSwitchWindow.prototype.updateTitleText = function() {
    console.log(this.orSwitch.text);
    this.title.text(this.orSwitch.text);
};

PORSwitchWindow.prototype.updateBodyText = function() {
    console.log('updateSwitchCardBodyText');
    var bodyText = this.orSwitch.statusText();
    console.log('new body text: '+ bodyText);
    this.body.text(bodyText);
};

PORSwitchWindow.prototype.doSwitchAction = function(sw) {
    var sw = this.orSwitch;
    var URL = orUrl + '/control/' + sw.id;
    if (sw.status) {
	URL += '/OFF';
    } else {
	URL += '/ON';
    }
    URL += '?callback=switched';
    console.log(URL);
    var that = this;
    var switched = function(data) {
	console.log('switched: ' + data);
	that.updateSwitchAfterAction(data);
    }
    ajax({url: URL},
	 function(jsonp) {
	     // Data is supplied here
	     console.log('Switch Success: ' + jsonp);
	     eval(jsonp);
	 },
	 function(error) {
	     console.log('Sensor Failed: ' + error);
	 }
	);
};

PORSwitchWindow.prototype.doDelayedSensorOfSwitch = function() {
    var that = this; 
    setTimeout(function() {
	console.log('Succesfull controlled the switch: ');
	that.orSwitch.debugLog();
	that.callSensorForStatus();
    }, 3000); 
};

PORSwitchWindow.prototype.updateSwitchForSensorData = function(data) {
    console.log('sensor callback data: ' + data);
    console.log('for switch: ' + this.orSwitch);
    if (this.orSwitch.sensor != data.status[0].id) {
	console.log('ERROR: SENSOR mismatch SKIP (not nessararily a problem...' + 
		    this.orSwitch.sensor + ' : '+ 
		    data.status[0].id);
	return
    };
    this.orSwitch.status = (data.status[0].content == 'on')
    this.updateTitleText();
    this.updateBodyText();
};

PORSwitchWindow.prototype.updateSwitchAfterAction = function(data) {
    console.log('switch action callback data: ' + data);
    console.log('for switch: ' + this.orSwitch.text);
    this.callSensorForStatus();
    this.doDelayedSensorOfSwitch()
};

module.exports = PORSwitchWindow;
