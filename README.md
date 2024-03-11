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
- Document this and make it flexible enough for other people to build
- Add some cyberdeck styling :)

## Parts
Total BOM is looking to be < $250, currently around $212.
- Raspberry Pi 4 - $35 for 1GB, which may be enough
  - Pi 4 has better DDC/CI support than older models - see [here](https://www.ddcutil.com/raspberry/)
  - The case I'm using only supports Pi 4 or older.
- Raspberry Pi 4 Touchscreen - $60+
- MicroSD Card (32GB seems fine) - $7
- 2x [cable-style MicroHDMI Male to HDMI Female Adapters](https://www.amazon.com/dp/B0CQPFRNCX?psc=1&ref=ppx_yo2ov_dt_b_product_details) - $7
- 2x [Short HDMI extensions](https://www.amazon.com/dp/B079ZPK4V2?psc=1&ref=ppx_yo2ov_dt_b_product_details) - $7
- Short ethernet cable and coupler - $8
- [USB Hub/speaker/mic](https://www.amazon.com/USB-Hub-Portable-Computer-Headphone-Speakers/dp/B09FZFBPBC/) - $20
- USB-C Power Adapter/Cable - $20
- [SmartiPi Touch Pro Case w/ large build area](https://www.adafruit.com/product/4951) - $30
- [USB-TTL Adapters](https://www.adafruit.com/product/954) - $10
  - Others should be fine, but a quality one might save some trouble. :)
- [Tiny USB Hub](https://www.amazon.com/dp/B0BJZ753D9) - $8 (Optional)

## Software
- Raspbian OS
- Electron
  - Uses Python backend launch model from [Python Electron](https://github.com/fyears/electron-python-example) proof of concept, but using an HTTP backend instead
- Flask
- Device-specific libraries and debug tools listed with External Device types

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

#### Tooling
- Linux Debug tool: [DDCUtil]([url](https://www.ddcutil.com/)) - CLI tool, great for at least testing
- Python library: None - just use [subprocess](https://docs.python.org/3/library/subprocess.html) to call ddcutil.
  - [monitor-commander](https://pypi.org/project/monitor-commander/) is a CLI tool itself

### USB Switch/etc. via RS232 on a USB-TTL adapter
As an example, the following matrix switches support RS-232:
 - OREI UKM-404 USB Matrix switch(not recommending for other reasons - Do NOT use the network connection.)
 - [GoFanco 4x4 HDMI Matrix Switch](https://www.amazon.com/dp/B0B6Z1C3N6)

Notes:
- These simple RS-232 devices cannot handle typing-speed commands - commands must be sent all at once.
- By default, the OREI is 9600 baud, while the GoFanco is 115200 baud. Both are 8N1.
- The OREI includes a premade 3-pin to serial adapter, and the GoFanco includes 3-pin connectors (since it uses them for audio too). [Additional connectors are available on Amazon](https://www.amazon.com/dp/B09LQV4DW7).

#### Tooling
- Linux Debug tool: ```cu``` or ```minicom``` 
- Python library: [PySerial](https://pypi.org/project/pyserial/) - Python serial library

### Hubspace
Hubspace is Home Depot's Afero-based smart home product line, and I have a ceiling fan with it. I could do this through HomeAssistant, but that integration is a little messy. I know a guy who wrote a clean Python backend, and may eventually make a better HA integration, but in the mean time, why not use the Python backend directly? Nosce te ipsum.

#### Tooling
- Python library and debug tool: [Hubspace-ng](https://github.com/shawngmc/hubspace-ng)

### Home Assistant
It'd be nice to be able to provide some Home Assistant controls. I don't want to use HA to control the monitors/etc., but I'd love to be able to control other home-automation devices.

#### Tooling
- Linux Debug tool: [HASS-CLI](https://github.com/home-assistant-ecosystem/home-assistant-cli)
- Python library: [HomeAssistant-API](https://pypi.org/project/HomeAssistant-API/)

## Design Decisions

### Why separate the video and USB switches?
Especially with multiple monitors, flexibility is useful. I eventually want to find a good Matrix switch.

### Why not use a DisplayPort switch?
They are very rare outside of KVMs, and they tend to be feature limited.

### Why not just use an external HDMI switch alone?
My monitors (and many others) only have [HDMI 2.0](https://en.wikipedia.org/wiki/HDMI#Version_comparison), which can only do 2K@144Hz in SDR. For 4K, higher refresh rates, and HDR, you need HDMI 2.1 (with up to 48Gbps bandwidth) or DP 1.4+.

### Why not use a GPIO serial HAT?
I think USB is slightly simpler here. I'd rather not tie up GPIO pins with something that is easily handled via USB, and I may need a number of RS232 serial connections.

### Why use that case and that touchscreen?
I want a DSI touchscreen because I want both HDMI ports to control 2 monitors. There are very few DSI touchscreens, and the Pi one - while not the biggest or best - is a de-facto standard, so I can get a pre-made case for it. I also want to minimize fidgetiness - some other touchscreens require non-standard kernel params, etc.

### Why avoid IP/network control?
It's unnecessary, may add complexity, and brings a host of security issues. Devices with it baked in often have bad implementations; custom implementations might mean a bunch of small edge devices.

### Why not use X for the UI renderer?
- [Oak](https://github.com/OakLabsInc/oak)? - Kiosk-focused variant of Electron **Not updated in 3 years**
- [Tkinter](https://docs.python.org/3/library/tkinter.html#module-tkinter) - TK library built into python - **Generally ugly, slow, not great with async**
  - Can be made prettier with [CustomTKinter](https://github.com/TomSchimansky/CustomTkinter)?) or [Tkss](https://pypi.org/project/tkstylesheet/) for CSS-like stylesheets
  - [Seems like it can do Fullscreen](https://stackoverflow.com/questions/7966119/display-fullscreen-mode-on-tkinter)
  - Add videos via [TKVideoPlayer](https://pypi.org/project/tkvideoplayer/) (which also [can be used with customtkinter](https://github.com/PaulleDemon/tkVideoPlayer/discussions/23#discussioncomment-4475005))
  - More widgets via [AwesomeTKinter](https://pypi.org/project/AwesomeTkinter/)
  - [TKfontawesome](https://pypi.org/project/tkfontawesome/) - Fontawesome Icons
- [Kivy](https://kivy.org/) - **was having trouble setting up in a conda env**
- [LibAvg](https://www.libavg.de/site/) - **Generally requires a source build**
- [Pyglet](https://pyglet.org/) - Python native GUI library, has video and fullscreen support **Few native widgets, poor documentation, big API changes in 2.0, none of the 3P widgets are updated ([Glooey](https://github.com/kxgames/glooey/issues/56) isn't a priority for the author, [Kytten](https://github.com/clockworklynx/kytten) is dead and I can't find the mentioned fork, [Pyglet-GUI](https://github.com/jorgecarleitao/pyglet-gui/tree/master) is 9 years old)**
- [PySimpleGUI](https://www.pysimplegui.com/) - Python wrapper for multiple UI toolkits - free for personal use only?
- [NiceGUI](https://nicegui.io/) - **discovered late, not very themable, and native mode needs [https://github.com/r0x0r/pywebview](PyWebView), which needs... Qt or GTK!**
- QT on Python - **not natively available for Pi and too much work to implement!**
    - Multiple Distros
      - [PyQT](https://riverbankcomputing.com/software/pyqt/intro) - Python 3rd-party Qt wrapper, GPL v3, no wheel for QT on Pi
      - [QT for Python](https://wiki.qt.io/Qt_for_Python) - Official QT Python wrapper, LGPL, no wheel for QT on Pi
      - [APIs are nearly identical](https://www.pythonguis.com/faq/pyqt5-vs-pyside2/)
    - Building QT
      - [This is some serious work.](https://wiki.qt.io/Cross-Compile_Qt_6_for_Raspberry_Pi)
      - Even the [docker solution looks painful](https://github.com/PhysicsX/QTonRaspberryPi)
      - This [doc](https://www.tal.org/tutorials/building-qt-62-raspberry-pi-raspberry-pi-os) points out it needs the headers for the video card driver to do hardware acceleration?
    - Can use [QT Creator](https://doc.qt.io/qtcreator/qtcreator-transitions-example.html) to make UIs in QML, which I could largely load at runtime
    - Can be fullscreen via the [fullscreen prop](https://doc.qt.io/qt-5/qwidget.html#fullScreen-prop)
    - Can do video via [QAbstractVideoSurface](https://doc.qt.io/qt-5/qtmultimedia-multimediawidgets-videowidget-example.html)
  - [Dear PyGUI](https://github.com/hoffstadt/DearPyGui) - Python native GUI library - **Not up-to-date on Pi**
    - [This](https://github.com/hoffstadt/DearPyGui/issues/2048) shows it's likely DOA until 2.0.... someday?
    - Might be able to build per [this](https://github.com/hoffstadt/DearPyGui/issues/2240), but not worth it.
   
### Why not use X for the Web UI widgets?
- [Arwes](https://arwes.dev) - **Awesome looking, but not wholly ready for prime time - might use for background and frame still?**
  - Lack of documentation
  - Many elements that should be part of the framework (like Button) are instead part of the demo site app and would need re-implemented
- [Augmented UI](https://augmented-ui.com/) - **Only covers frame-like elements, not really the aesthetic I want**
- Codepens
  - [Pure CSS Cyberpunk Buttons](https://codepen.io/jh3y/details/PoGbxLp) - **would need major animation tweaks and stuff, but might be a starting point**
  - [Cyberpunk 2077 Theme CSS](https://codepen.io/gwannon/pen/LYjvOLK) - **button is less refined, but I could use some of the other things**
  - [Slack / Discord Cyberpunk 2077 redesign w/ Preact](https://codepen.io/hussard/pen/ExgbXMP) - **Possibly a bit too Cyberpunk the game, but I may steal a few things**
 
### Why not just use node.js the whole way through?
- I already had my Hubspace-ng library and some prototype code.
- I wasn't originally doing an Electron GUI.
- JS is just a bit messier than I want for the backend.

## Other Refs
- [Someone else has done something similar?](https://news.ycombinator.com/item?id=31828755)
- [CyberDeck using this case](https://www.reddit.com/r/cyberDeck/comments/vjpldx/here_is_my_first_cyberdeck_raspberry_pi_4_using/) - I found the case before I found this, but I might snag another :)

## Install
### Development
1. Clone repo
1. Run pip install -e . from the root project folder
