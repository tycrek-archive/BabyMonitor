var offline = '&#x274C;';
var online = '&#xFE0F;';

window.onload = function() {
	loadTemplates();
}

function loadTemplates() {
	// NETWORK
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

	// DEVICE
	fetch('/static/templates/view-device.html', {
		cache: 'no-cache'
	})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		document.getElementById('device-view').innerHTML = text;
	});
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
	});
}

function addDevice() {
	var ul = document.getElementById('device-list');
	var li = document.createElement('li');
	li.setAttribute('class', 'device-li');
	li.setAttribute('id', 'mydevice481928');

	var tempId = 'newDevice';

	var devName = document.createElement('text');
	devName.innerHTML = 'unnamed device';
	devName.setAttribute('id', tempId + '-name');

	var devIndicator = document.createElement('text');
	devIndicator.innerHTML = offline;
	devIndicator.setAttribute('id', tempId + '-indicator');

	var devView = document.createElement('button');
	devView.innerHTML = "View info";
	devView.setAttribute('class', 'right-align');
	devView.setAttribute('onclick', 'viewDevice("' + tempId + '")');

	li.appendChild(devName);
	li.appendChild(document.createTextNode(" "));
	li.appendChild(devIndicator);
	li.appendChild(document.createTextNode(" "));
	li.appendChild(devView);

	ul.appendChild(li);

	// DEVICE
	fetch('/static/templates/new-device.html', {
		cache: 'no-cache'
	})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		document.getElementById('device-view').innerHTML = text;

		document.getElementById('device-name').value = 'My Device';
		document.getElementById('device-id').value = 'mydevice481928';
		document.getElementById('device-address').value = '192.168.0.128';
	});
}

function saveNetwork() {

}

function editMode(netdev) {
	var ndid = netdev + '-elm';
	var elms = document.getElementsByName(ndid);
	for (i = 0; i < elms.length; i++) {
		console.log(elms[i].disabled);
		elms[i].disabled = !elms[i].disabled;
	}
}