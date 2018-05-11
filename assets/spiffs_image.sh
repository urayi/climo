#!/bin/sh
VESAT_mkspiffs_ESP32/mkspiffs -c Climo-ESPWeb -d 5 -b 4096 -p 256 -s 0x10000 spiffs.img
python ~/esp/esp-idf/components/esptool_py/esptool/esptool.py --chip esp32 --port /dev/ttyUSB0  --baud 115200 write_flash -u --flash_mode dio --flash_freq 40m --flash_size 1MB 0xE0000 spiffs.img
