/**
 * OpenRemotePebble : defintion of the PORMenu
 * 
 *                    Pebble OpenRemote 
 *
 * (c) Gert Wijsman april 2015
 */

var UI = require('ui');
//var PORAjax = require('por/PORAjax'); 
var PORSwitch =require('por/PORSwitch');
var PORSwitchWindow =require('por/PORSwitchWindow');

var PORMenu = function(ORPanels) {
    this.parseORPanels(ORPanels);
    this.showMainMenu();
};

PORMenu.prototype.configurationError = function(message) {
    var errorCard = new UI.Card({
	title: "OR Conf Error",
	body: message
    });
    console.log('------------------------------------->>');
    console.log('OpenRemote Design Configuration Error: ' + message);
    console.log('------------------------------------->>');
    errorCard.show();
    parsingError = true; 
};

PORMenu.prototype.parseORPanels  = function(ORPanels) {
    var parsingError = false;
    this._parseORPanels(ORPanels);
//    if (parsingError) return false; 
};

PORMenu.prototype._parseORPanels  = function(ORPanels) {
    // ORPanels is the recieved json from OpenRemote
    // parse it to a usable format 
    console.log('-->>receivePanels A <<--');
    for (var index in ORPanels.screens.screen) {
	var scr = ORPanels.screens.screen[index];
	if (scr.name != 'Screen1') {
	    console.log('Skip this screen: ' + scr.name); 
	    break; 
	}
	if (scr.name != 'Screen1') this.configurationError('Expected a screen with name Screen1');

	console.log('Id of Screen1 is: ' + scr.id);
	
	var grids = scr.grid;
	if (grids.length != 1) this.configurationError('One and only one Grid expected'); 
	
	var grid = grids[0];
	
	if (grid.cols != 2) this.configurationError('Expected 2 and only 2 columns in the grid'); 
	var numberOfSwitches = grid.rows; 
	console.log('We have to process ' + numberOfSwitches + ' switches');
	Switches = [];
	// generate the array of switches
	for (var i=0; i<numberOfSwitches; i++){
	    Switches.push(new PORSwitch())
	};
	
	console.log('mijn switches array is ' + Switches.length + ' lang');
	
	var countSwitches = 0;
	var countLabels = 0;
	
	for (var item in grid.cell) {
	    var cell = grid.cell[item];
	    var sw = cell.switch;
	    var la = cell.label;
	    
	    if (sw != null) {
		//		    console.log('process switch...'); 
		//		    for (var item in sw) {
		//			console.log(item);
		//		    }
		
		//		    console.log('y:  ' + cell.y);
		//		    console.log('id: ' + sw.id);
		//		    console.log('sn: ' + sw.link.ref);
		
		Switches[cell.y].id = sw.id;
		Switches[cell.y].sensor = sw.link.ref;
		Switches[cell.y].screenId = scr.id;
		Switches[cell.y].state = true;
		
		countSwitches += 1; 
	    }

	    if (la != null) {
		//		    console.log('process label...'); 
		//		    for (var item in la) {
		//			console.log(item);
		//		    }

		//		    console.log('y:  ' + cell.y);
		//		    console.log('id: ' + la.text);
		
		Switches[cell.y].text = la.text;
		
		countLabels += 1;
	    }
	    
	};
	console.log('We have processed ' + countSwitches + ' switches');
	console.log('We have processed ' + countLabels + ' labels');
	if (countSwitches != numberOfSwitches) this.configurationError(
	    numberOfSwitches + 'switches expected instead of ' + countSwitches); 
	if (countLabels != numberOfSwitches) this.configurationError(
	    numberOfSwitchs + ' labels expected instead of ' + countLabels); 
	
	//	    for (item in switches) {
	//		var s = switches[item];
	//		console.log(s);
	//		console.log(s.id);
	//		console.log(s.sensor);
	//		console.log(s.text);
	//	    };

    }

    console.log('-->>receivePanels B <<--');

    // console.log('-->>receivePanels D <<--');
    
    // console.log(switches[0]);
    // console.log(switches[0]['id']);
    // console.log(switches[0]['sensor']);
    
    // console.log('-->>receivePanels E <<--');

};

PORMenu.prototype.showMainMenu = function () {
    
    var menuItems = [];
    for (var i in Switches) {
	var sw = Switches[i];
	menuItems.push(
	    {
		title: sw.text
	    });
    };
    
    var menu = new UI.Menu({
	sections: [{
	    items: menuItems
	}]
    });
    
    menu.on('select', function(e) {
	console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
	console.log('The item is titled "' + e.item.title + '"');
	console.log('SENSOR: ' + Switches[e.itemIndex].sensor);
	console.log('    ID: ' + Switches[e.itemIndex].id);
	console.log('  NAME: ' + Switches[e.itemIndex].text);
	new PORSwitchWindow(Switches[e.itemIndex]);
    });
    menu.on('back', function(e) {
	consloe.log('BACK!! STOP THE PROGRAM!');
    });
    menu.show();
}

module.exports = PORMenu;
