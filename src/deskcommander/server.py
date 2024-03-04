import asyncio
import json
import os
import logging
import signal

from flask import Flask, request

from deskcommander.connectors.hubspace import ToggleDevice 

logger = logging.getLogger('deskcommander')
logger.setLevel(logging.INFO)

print("Reading config...")
config = None
with open(os.environ['DESKCOMMANDER_CONFIG'], "r", encoding = "utf-8") as config_file:
    config = json.loads(config_file.read())

if not config:
    raise ValueError("No config provided; exiting.")

app = Flask(__name__)

@app.route("/shutdown")
async def shutdown():
    print('Shutting down gracefully...')
    os.kill(os.getpid(), signal.SIGINT)
    return "OK, Shutting down...", 200


light_toggle = ToggleDevice(config['hubspace']['light'], config['hubspace']['username'], config['hubspace']['password'])
@app.route("/light/toggle")
async def toggle_light():
    await light_toggle.toggle()
    return "OK", 200
@app.route("/light/state")
async def check_light():
    state = await light_toggle.is_on()
    return json.dumps({'state':state}), 200, {'ContentType':'application/json'}


fan_toggle = ToggleDevice(config['hubspace']['fan'], config['hubspace']['username'], config['hubspace']['password'])
@app.route("/fan/toggle")
async def toggle_fan():
    await fan_toggle.toggle()
    return "OK", 200
@app.route("/fan/state")
async def check_fan():
    state = await fan_toggle.is_on()
    return json.dumps({'state':state}), 200, {'ContentType':'application/json'}

