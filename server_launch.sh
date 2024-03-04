#!/bin/bash

script_dir="$(dirname "$(readlink -f "$0")")"

DESKCOMMANDER_CONFIG="${script_dir}/config.json" python3 -m flask --app deskcommander.server run