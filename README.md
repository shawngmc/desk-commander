# desk-commander
A build for a RPi-based desktop control touchscreen.

Rough idea for a build to control various desktop devices, ideally without a network connection.

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
- DDC/CI control
  - [DDCUtil]([url](https://www.ddcutil.com/)) - CLI tool, great for at least testing
  - [ddc-node](https://github.com/ThalusA/ddc-node) - Node.js binding for a Rust library
  - [monitor-commander](https://pypi.org/project/monitor-commander/) - Python wrapper for DDCUtil
- Serial control
  - [PySerial](https://pypi.org/project/pyserial/) - Python serial library
  - [serialport](https://www.npmjs.com/package/serialport) - Node.js serial library
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

## External Devices to Control
- Monitors via DDC/CI on HDMI
  - Input Control: For example, on a Dell S3220DGF, VCP value 60 is the current input. 15 is DP, 17 is HDMI1, and 18 is HDMI2.
- USB Switch via RS232 on a USB-TTL adapter
  - For example, a OREI UKM-404 switch can be controlled via RS-232. Do NOT use the network connection.


## Design Decisions

## Why separate the video and USB switches?
Especially with multiple monitors, flexibility is useful. I eventually want to find a good Matrix switch.

## Why not use a DisplayPort switch?
They are ery rare outside of KVMs, and they tend to be feature limited.

## Why not just use an external HDMI switch alone?
My monitors (and many others) only have [HDMI 2.0](https://en.wikipedia.org/wiki/HDMI#Version_comparison), which can only do 2K@144Hz in SDR. For 4K, higher refresh rates, and HDR, you need HDMI 2.1 (with up to 48Gbps bandwidth) or DP 1.4+.

## Why not use a GPIO serial HAT?
I think USB is slightly simpler here. I'd rather not tie up GPIO pins with something that is easily handled via USB, and I may need a number of RS232 serial connections.
