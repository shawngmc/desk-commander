# desk-commander
A build for a RPi-based desktop control touchscreen.

Rough idea for a build to control various desktop devices, ideally without a network connection.

## Parts
- Raspberry Pi 4
- Raspberry Pi 4 Touchscreen
- [SmartiPi Touch Pro Case](https://www.adafruit.com/product/4951)
- [USB-TTL Adapters](https://www.adafruit.com/product/954)

## External Devices to Control
- Monitors via DDI/IC on HDMI
  - Input Control: For example, on a S3220DGF, VCP value 60 is the current input. 15 is DP, 17 is HDMI1, and 18 is HDMI2.
- USB Switch via RS232 on a USB-TTL adapter
  - For example, a OREI UKM-404 switch can be controlled via RS-232. Do NOT use the network connection.
