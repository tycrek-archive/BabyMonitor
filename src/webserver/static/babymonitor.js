var offline = '&#x274C;';
var online = '&#x2705;';

window.onload = function() {
	loadTemplates();
}

function loadTemplates() {
	loadNetTemplate();
	loadDevTemplate();
}

function loadNetTemplate() {

	fetch('/static/templates/view-network.html', {
		cache: 'no-cache'
	})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		document.getElementById('network-view').innerHTML = text;
		refreshNetwork();
	});
}

function loadDevTemplate() {
	return Promise.all([fetch('/static/templates/view-device.html', {
		cache: 'no-cache'
	})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		document.getElementById('device-view').innerHTML = text;
	})]);
}


function refreshNetwork() {
	fetch('/networkinfo', {
		cache: 'no-cache'
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
		document.getElementById('network-name').value = json["network-name"];
		document.getElementById('network-address').value = json["network-address"];
		document.getElementById('network-subnet').value = json["network-subnet"];
		
		var length = Object.keys(json.devices).length;
		document.getElementById('device-count').innerHTML = length;

		for (device in json.devices) {
			var devname = json.devices[device]['device-name'];
			var devid = json.devices[device]['device-id'];
			var devaddress = json.devices[device]['device-address'];
			if (document.getElementById(devid) == null) {
				addDevice(0, devname, devid, devaddress);
			}
		}
	});
}

function refreshDevice(devid) {
	loadDevTemplate().then(function() {
	
		fetch('/networkinfo', {
			cache: 'no-cache'
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			document.getElementById('device-name').value = json['devices'][devid]["device-name"];
			document.getElementById('device-id').value = json['devices'][devid]["device-id"];
			document.getElementById('device-address').value = json['devices'][devid]["device-address"];
		});
	});
}

function addDevice(mode, devname='My Device', devid='mydevice481928', devaddress='192.168.0.128', devmac='') {
	var ul = document.getElementById('device-list');
	var li = document.createElement('li');
	li.setAttribute('class', 'device-li');
	li.setAttribute('id', devid);

	var devName = document.createElement('text');
	devName.innerHTML = devname;
	devName.setAttribute('id', devid + '-name');

	var devIndicator = document.createElement('text');
	devIndicator.innerHTML = offline;
	devIndicator.setAttribute('id', devid + '-indicator');

	var devView = document.createElement('button');
	devView.innerHTML = "View info";
	devView.setAttribute('class', 'right-align');
	devView.setAttribute('onclick', 'refreshDevice("' + devid + '")');

	li.appendChild(devName);
	li.appendChild(document.createTextNode(" "));
	li.appendChild(devIndicator);
	li.appendChild(document.createTextNode(" "));
	li.appendChild(devView);

	ul.appendChild(li);

	if (mode == 0) {

	} else {
		fetch('/static/templates/new-device.html', {
			cache: 'no-cache'
		})
		.then(function(response) {
			return response.text();
		})
		.then(function(text) {
			document.getElementById('device-view').innerHTML = text;

			document.getElementById('device-name').value = devname;
			document.getElementById('device-id').value = devid;
			document.getElementById('device-address').value = devaddress;
		});
	}
}

function pingDevice(devaddress, devid) {
	fetch('/pingdevice?address=' + devaddress, {
		cache: 'no-cache'
	})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		if (text == 'online') {
			document.getElementById('device-ping-status').innerHTML = 'Online';
			document.getElementById('device-ping-status').setAttribute('style', 'color:lime');
			document.getElementById(devid + '-indicator').innerHTML = online;
		} else {
			document.getElementById('device-ping-status').innerHTML = 'Offline';
			document.getElementById('device-ping-status').setAttribute('style', 'color:red');
			document.getElementById(devid + '-indicator').innerHTML = offline;
		}
	});
}

function updateDevice() {
	var devName = document.getElementById('device-name').value;
	var devId = document.getElementById('device-id').value;
	var devAddress = document.getElementById('device-address').value;
	var deviceInfo = [devName, devId, devAddress];
	saveNetwork(1, deviceInfo);
	loadTemplates(2);
}

function saveNetwork(method, info) {
	if (method == 0) {
		// network
	} else if (method == 1) {
		fetch('/updatedevice?name=' + info[0] + '&devid=' + info[1] + '&address=' + info[2]);
	} else if (method == 2) {
		fetch('/deletedevice?devid=' + info);
	}
}

function editMode(netdev) {
	var ndid = netdev + '-elm';
	var elms = document.getElementsByName(ndid);
	for (i = 0; i < elms.length; i++) {
		console.log(elms[i].disabled);
		elms[i].disabled = !elms[i].disabled;
	}
}