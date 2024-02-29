# desk-commander
A build for a RPi-based desktop control touchscreen.

## Idea
I want a unified system to control various desktop devices. My criteria are:
- Touchscreen with status feedback (which device is selected, etc.)
- Avoid IP control as much as feasible
- Be faster than controls on various devices
  - Monitor input switching is a far reach
  - My Orei UKM-404 USB matrix switch is 1 button per device, so each device I want to move from output 2 to output 1 is 3 presses, and there is a delay between them.
- Be able to interact with my Home Assistant for room control
- Allow for expansion in the future
- Add some cyberdeck styling :)

## Parts
- Raspberry Pi 4 - $50
  - Pi 4 has better DDC/CI support - see [here](https://www.ddcutil.com/raspberry/)
- Raspberry Pi 4 Touchscreen - $60+
- USB-C Power Adapter/Cable - $20
- [SmartiPi Touch Pro Case w/ large build area](https://www.adafruit.com/product/4951) - $30
- [USB-TTL Adapters](https://www.adafruit.com/product/954) - $10
  - Others should be fine, but a quality one might save some trouble. :)
- [Tiny USB Hub](https://www.amazon.com/dp/B0BJZ753D9) - $8 (Optional)

## Software
- Raspbian OS
- Device-specific libraries and debug tools listed with External Device types
- Kiosk UI
  - [Oak](https://github.com/OakLabsInc/oak)? - Kiosk-focused variant of Electron
  - [Python Electron](https://github.com/fyears/electron-python-example) - Electron with Python backend
  - ~~[PySimpleGUI](https://www.pysimplegui.com/) - Python wrapper for multiple UI toolkits,~~ free for personal use only?
  - ~~[QT for Python](https://wiki.qt.io/Qt_for_Python) - Official QT Python wrapper,~~ requires cross-compilation
  - [Dear PyGUI](https://github.com/hoffstadt/DearPyGui) - Python native GUI library
  - [Pyglet](https://pyglet.org/) - Python native GUI library, has video and fullscreen support
  - [PyQT](https://riverbankcomputing.com/software/pyqt/intro) - Python 3rd-party Qt wrapper
  - [Tkinter](https://docs.python.org/3/library/tkinter.html#module-tkinter) - TK library built into python
    - Can be made prettier with [CustomTKinter](https://github.com/TomSchimansky/CustomTkinter)?) or [Tkss](https://pypi.org/project/tkstylesheet/) for CSS-like stylesheets
    - [Seems like it can do Fullscreen](https://stackoverflow.com/questions/7966119/display-fullscreen-mode-on-tkinter)
    - Add videos via [TKVideoPlayer](https://pypi.org/project/tkvideoplayer/)
    - More widgets via [AwesomeTKinter](https://pypi.org/project/AwesomeTkinter/)
    - [TKfontawesome](https://pypi.org/project/tkfontawesome/) - Fontawesome Icons
  - Other options: [Kivy](https://kivy.org/), [LibAvg](https://www.libavg.de/site/)

## External Devices to Control
### Monitors 
This is a complex chain, but actually easy to use:
- Both [HDMI](https://en.wikipedia.org/wiki/High-Definition_Multimedia_Interface) and [Displayport](https://en.wikipedia.org/wiki/DisplayPort) generally support the the VESA [Display Data Channel Command Interface standard (DDC/CI)](https://en.wikipedia.org/wiki/Display_Data_Channel#OS_support_for_DDC/CI) (a copy of the spec can be found [here](https://glenwing.github.io/docs/VESA-DDCCI-1.1.pdf)). Many monitors support this functionality, but some do not or may have odd issues (flashes, etc).
- On this, you can issue commands in the [Monitor Control Command Set (MCCS)](https://en.wikipedia.org/wiki/Monitor_Control_Command_Set) (a copy of the spec can be found [here](https://milek7.pl/ddcbacklight/mccs.pdf)), which standarizes sending Virtual Control Panel (VCP) commands that equate to typical monitor physical control functions.
- VCP 60h is input selection, and the values are generally standardized:
  - 01h - 02h: Analog video (R/G/B) (typically VGA) inputs (2x)
  - 03h - 04h:  Digital video (TMDS) over DVI inputs (2x)
  - 05h - 06h: Composite video inputs (2x)
  - 07h - 08h: S-video inputs (2x)
  - 09h - 0Bh: Tuners inputs (3x)
  - 0Ch - 0Eh Component video (YPbPr / YCbCr) inputs (3x)
  - 0Fh - 10h DisplayPort inputs (2x)
  - 11h - 12h Digital Video (TMDS) over HDMI inputs (2x)
  - It's unclear how monitors with more inputs than covered (such as the [Acer X32 FP](https://www.acer.com/us-en/predator/monitors/x32-fp) with 4 HDMI inputs) or non-covered inputs (USB-C comes to mind, but it's likely treated as a DisplayPort)
- Linux and Windows both have solid DDC/CI support. [DDCutil](https://www.ddcutil.com/) on Linux is the easiest way to test this, and there are bindings for a bunch of languages.

Linux Debug tool: [DDCUtil]([url](https://www.ddcutil.com/)) - CLI tool, great for at least testing
Python library: [monitor-commander](https://pypi.org/project/monitor-commander/) - Python wrapper for DDCUtil 
Node.js library (backup plan): [ddc-node](https://github.com/ThalusA/ddc-node) - Node.js binding for a Rust library

### USB Switch/etc. via RS232 on a USB-TTL adapter
As an example, an OREI UKM-404 switch can be controlled via RS-232. Do NOT use the network connection.

Linux Debug tool: ```cu``` or ```minicom``` 
Python library: [PySerial](https://pypi.org/project/pyserial/) - Python serial library
Node.js library (backup plan): [serialport](https://www.npmjs.com/package/serialport) - Node.js serial library

### Home Assistant
It'd be nice to be able to provide some Home Assistant controls. I don't want to use HA to control the monitors/etc., but I'd love to be able to toggle lights/fans via the screen.

Linux Debug tool: [HASS-CLI](https://github.com/home-assistant-ecosystem/home-assistant-cli)
Python library: [HomeAssistant-API](https://pypi.org/project/HomeAssistant-API/)
Node.js library (backup plan): ???

## Design Decisions

### Why separate the video and USB switches?
Especially with multiple monitors, flexibility is useful. I eventually want to find a good Matrix switch.

### Why not use a DisplayPort switch?
They are ery rare outside of KVMs, and they tend to be feature limited.

### Why not just use an external HDMI switch alone?
My monitors (and many others) only have [HDMI 2.0](https://en.wikipedia.org/wiki/HDMI#Version_comparison), which can only do 2K@144Hz in SDR. For 4K, higher refresh rates, and HDR, you need HDMI 2.1 (with up to 48Gbps bandwidth) or DP 1.4+.

### Why not use a GPIO serial HAT?
I think USB is slightly simpler here. I'd rather not tie up GPIO pins with something that is easily handled via USB, and I may need a number of RS232 serial connections.

### Why use that case and that touchscreen?
I want a DSI touchscreen because I want both HDMI ports to control 2 monitors. There are very few DSI touchscreens, and the Pi one - while not the biggest or best - is a de-facto standard, so I can get a pre-made case for it. I also want to minimize fidgetiness - some other touchscreens require non-standard kernel params, etc.

## Other Refs
- [Someone else has done something similar?](https://news.ycombinator.com/item?id=31828755) 
