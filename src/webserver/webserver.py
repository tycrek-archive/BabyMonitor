## webserver.py
## Webserver script for BabyMonitor
## Joshua Moore / 2018

HOST = "0.0.0.0"	# Change if you wish to run from a different address
PORT = 8081			# Change if you wish to run from a different port

from flask import Flask
import os

app = Flask("testing")

@app.route('/')
def index():
	with open('index.html') as f:
		return f.read()


app.run(debug=True, host=HOST, port=PORT)