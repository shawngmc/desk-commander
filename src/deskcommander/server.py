import asyncio
import json
import os
import logging
import signal

from flask import Flask, request

from deskcommander.connectors.hubspace import HubspaceToggleDevice 
from deskcommander.connectors.serial import HdmiMatrix, UsbMatrix 

logger = logging.getLogger('deskcommander')
logger.setLevel(logging.INFO)

COMMON_HEADERS = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'ContentType':'application/json'
}

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


light_toggle = HubspaceToggleDevice(config['hubspace']['light'], config['hubspace']['username'], config['hubspace']['password'])
@app.route("/light/toggle")
async def toggle_light():
    await light_toggle.toggle()
    return "{'status': 'OK'}", 200, COMMON_HEADERS
@app.route("/light/state")
async def check_light():
    state = await light_toggle.is_on()
    return json.dumps({'state':state}), 200, COMMON_HEADERS


fan_toggle = HubspaceToggleDevice(config['hubspace']['fan'], config['hubspace']['username'], config['hubspace']['password'])
@app.route("/fan/toggle")
async def toggle_fan():
    await fan_toggle.toggle()
    return "{'status': 'OK'}", 200, COMMON_HEADERS
@app.route("/fan/state")
async def check_fan():
    state = await fan_toggle.is_on()
    return json.dumps({'state':state}), 200, COMMON_HEADERS


hdmi_matrix = HdmiMatrix(config['hdmi_matrix'])
@app.route("/monitor/<monitor>/connect/<device>")
async def set_monitor_input():
    state = {}

    # TODO: Add error handling

    # TODO: Swap monitor via DDC, if necessary

    # TODO: Swap matrix via serial, if necessary

    print("NYI")

    return json.dumps({'state':state}), 200, COMMON_HEADERS
@app.route("/monitor/<monitor>")
async def get_monitor_input():
    state = {}
    # TODO: Add error handling

    # TODO: If monitor is on displayport, map to that machine

    # TODO: If monitor is on HDMI1, check matrix

    print("NYI")

    return json.dumps({'state':state}), 200, COMMON_HEADERS


usb_matrix = UsbMatrix(config['usb_matrix'])
@app.route("/usb/<device>/connect/<host>")
async def set_usb_mapping(device, host):
    state = {}

    usb_matrix.set_mapping(device, host)

    # TODO: Add error handling

    return json.dumps({'state':state}), 200, COMMON_HEADERS
@app.route("/usb/<device>")
async def get_usb_mapping(device):
    state = {}

    # TODO: Finish implementing get_mapping
    host = usb_matrix.get_mapping(device)
    state['host'] = host

    return json.dumps(state), 200, COMMON_HEADERS


@app.route("/status")
async def status():
    status = {
        'fan': await fan_toggle.is_on(),
        'light': await light_toggle.is_on(),
    }
    return json.dumps({'status':status}), 200, COMMON_HEADERS