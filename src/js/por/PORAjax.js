/**
 * OpenRemotePebble : defintion of the PORAjax
 * 
 *                    Pebble OpenRemote Ajax communication
 *
 * (c) Gert Wijsman mrt 2015
 */

var ajax = require('ajax');
var PORMenu = require('por/PORMenu'); 

var PORAjax = function PORAjax() {
    this.protocol = 'http';
    this.server = 'openremote.wijsmanlocal';
    this.port = 8080;
    this.baseurl = '/controller/rest';
    this.url = '';
    this.window = null;
    this.setURL();
};

PORAjax.prototype.setURL = function() {
    this.url = this.protocol + '://' + this.server + ':' + this.port + this.baseurl;
};

PORAjax.prototype.getPanel = function() {
    var URL = this.url + '/panel/Pebble%20Smartwatch?callback=callbackGetPanel';
    console.log(URL);
    var callbackGetPanel = function (ORPanels) {
	var men = new PORMenu(ORPanels);
    };
    ajax({url: URL},
	 function(jsonp) {
	     // Data is supplied here
	     // console.log('Ajax success: ' + jsonp);
	     eval(jsonp);
	 },
	 function(error) {
	     console.log('Ajax failed: ' + error);
	 }
	);
};

PORAjax.prototype.doSensorSwitch = function(sw) {
    var URL = 'http://openremote.wijsmanlocal:8080/controller/rest/status/' + sw.sensor + '?callback=sensor';
    console.log(URL);
    console.log(sw);
    var sensor =function(data) {
	console.log('sensor callback data: ' + data);
	cosonle.log('for switch: ' + sw);
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

PORAjax.prototype.sensor = function(data) {
    console.log('callback van sensor');
    console.log(data);
    console.log('sensor: ' + data.status[0].id);
    console.log('status: ' + data.status[0].content);
    for (var i in switches) {
	var sw = switches[i];
	if (sw.sensor == data.status[0].id) {
	    console.log('update status...')
	    sw.status = (data.status[0].content == 'on');
	}
    };
    updateSwitchCardBodyText();
};

module.exports = PORAjax;
