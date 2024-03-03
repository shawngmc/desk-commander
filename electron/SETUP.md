
# WSL

1. Install NVM
2. Install Node LTS
3. Install Electron
4. Install Electron Deps
```sudo apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2```
5. Start DBus
```
export DISPLAY=172.19.48.1:0
sudo service dbus start
export XDG_RUNTIME_DIR=/run/user/$(id -u)
sudo mkdir $XDG_RUNTIME_DIR
sudo chmod 700 $XDG_RUNTIME_DIR
sudo chown $(id -un):$(id -gn) $XDG_RUNTIME_DIR
export DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus
dbus-daemon --session --address=$DBUS_SESSION_BUS_ADDRESS --nofork --nopidfile --syslog-only &
```