# ESP32 Firmware (Arduino IDE)

Overview
- This folder is the home for the ESP32 firmware used with the Arduino IDE.
- It contains the sketches, configuration headers, and any project-specific libraries needed to build and upload the firmware to ESP32 development boards.

Contents (expected)
- /src or root .ino sketch (main project sketch)
- config.h or secrets.h — Wi‑Fi credentials and device-specific settings (not committed in repo)
- lib/ or libraries/ — project-local libraries (if any)
- data/ — SPIFFS / LittleFS files (optional)
- tools/ or scripts/ — helper scripts (optional)
- README or firmware-docs.md — this file

Prerequisites
- Arduino IDE 1.8.x or newer (Arduino IDE 2.x recommended)
- ESP32 board support installed:
    1. Preferences → Additional Boards Manager URLs: add `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
    2. Tools → Board → Boards Manager → search "esp32" and install "esp32 by Espressif Systems"
- Required libraries (install via Library Manager or place in libraries/):
    - List project-specific libraries here (e.g. ArduinoJson, PubSubClient, HTTPClient)
    - If not sure, open the sketch and note the includes

How to open and build (Arduino IDE)
1. Open Arduino IDE.
2. File → Open → select the main .ino file in this folder.
3. Tools → Board → select your board (e.g. “ESP32 Dev Module”).
4. Tools → Port → select the USB/serial port for the device.
5. Tools → Flash Frequency / Upload Speed / Partition Scheme: use defaults unless otherwise specified in the project.
6. Click Sketch → Verify (compile).
7. Click Sketch → Upload (hold BOOT on some dev boards while pressing EN if required).

Arduino CLI (optional)
- Compile: arduino-cli compile --fqbn esp32:esp32:esp32 <path-to-sketch>
- Upload: arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 <path-to-sketch>

Serial Monitor
- Baud rate: 115200 (unless sketch uses a different rate)
- Tools → Serial Monitor or use `screen /dev/ttyUSB0 115200`

Configuration
- Do not commit secrets (Wi‑Fi passwords, API keys). Use a template file like secrets.example.h and add secrets.h to .gitignore.
- Common config items:
    - WIFI_SSID, WIFI_PASSWORD
    - DEVICE_NAME, MQTT_TOPIC, SERVER_HOST, SERVER_PORT
    - OTA_PASSWORD (if OTA is implemented)

Filesystem (SPIFFS / LittleFS)
- If data/ holds filesystem content, use the Arduino ESP32 upload tool or `arduino-cli` tools to upload the contents to SPIFFS/LittleFS.
- Confirm the partition scheme supports SPIFFS/LittleFS (Tools → Partition Scheme).

Troubleshooting
- Board not detected: check USB cable (use data cable), try another port, verify drivers (macOS: usually none; Windows: install CP210x/CH340 drivers if needed).
- Permission errors on macOS/Linux: ensure access to /dev/tty.* or /dev/ttyUSB* (add to dialout group or use sudo for CLI).
- Compile errors: install missing libraries listed in the sketch includes.
- Upload fails: hold BOOT while uploading for older dev boards or press EN after upload starts.

Contributing
- Edit or add sketches in this folder.
- Keep secrets out of the repo; use template files.
- Follow existing naming and layout conventions.

License
- Add project license here (e.g. MIT). If none specified, contact repository owner.

Notes
- Feel free to make your modification to this project.

Contact
- For questions about building or uploading this firmware, contact the repository owner or maintainer.
