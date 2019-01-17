## webserver.py
## Webserver script for BabyMonitor
## Joshua Moore / 2018

HOST = "0.0.0.0"	# Change if you wish to run from a different address
PORT = 8081			# Change if you wish to run from a different port

from flask import Flask, request
import json
import os
from platform import system as system_name
from subprocess import call as system_call
import subprocess

app = Flask("BabyMonitor")

@app.route('/')
def index():
	with open('index.html') as f:
		return f.read()

@app.route('/networkinfo')
def networkinfo():
	with open('network.json') as f:
		return f.read()

@app.route('/updatedevice')
def updatedevice():
	devname = request.args.get('name')
	devid = request.args.get('devid')
	devaddress = request.args.get('address')

	data = None
	with open('network.json', 'r') as f:
		data = json.load(f)

	if devid not in data['devices']:
		# new device
		data['devices'][devid] = {}
	
	data['devices'][devid]['device-name'] = devname
	data['devices'][devid]['device-id'] = devid
	data['devices'][devid]['device-address'] = devaddress

	with open('network.json', 'w') as f:
		f.write(json.dumps(data, indent=4))

	return 'None'

@app.route('/pingdevice')
def pingdevice():
	address = request.args.get('address')
	param = '-n' if system_name().lower()=='windows' else '-c'

	# Building the command. Ex: "ping -c 1 google.com"
	command = ['ping', param, '1', address]

	# Pinging
	result = subprocess.check_output(command)
	if 'host unreachable' in str(result) or 'timed out' in str(result):
		return 'offline'
	return 'online' if system_call(command) == 0 else 'offline'

app.run(debug=True, host=HOST, port=PORT)