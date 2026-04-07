# ESP32 Firmware — Overview

This folder contains the main firmware that runs on the ESP32 using the Arduino IDE. It holds the Arduino sketch(es), optional filesystem data, and any helper libraries or configuration files used to build and upload firmware to the device.

## Contents (typical)
- `main.ino` or `firmware.ino` — primary Arduino sketch (entry point).
- `src/` — additional .cpp/.h source files (if used).
- `lib/` — local libraries used by the project (optional).
- `data/` — files to be uploaded to SPIFFS/LittleFS (optional).
- `secrets.h` or `config.h` — non-committed configuration (Wi‑Fi credentials, keys).
- `README.md` / `firmware-docs.md` — this document.

Adapt names if your repo uses a different layout.

## Prerequisites
- Arduino IDE (recommended latest stable).
- ESP32 Arduino core installed (Boards Manager: "esp32 by Espressif Systems").
- Required libraries installed (via Library Manager or placed in `lib/`).

## Board & IDE Settings (common)
- Board: "ESP32 Dev Module" (or board matching your hardware)
- Flash Frequency: 80MHz
- Flash Mode: QIO (or as required by board)
- Partition Scheme: "Default" or "Minimal SPIFFS" if using filesystem
- Upload Speed: 115200 or 921600 (stable value depends on USB-serial chip)
- CPU Frequency: 240MHz (default)

## Build & Upload (Arduino IDE)
1. Open the sketch (`main.ino`) in Arduino IDE.
2. Select the ESP32 board and COM port: Tools → Board, Tools → Port.
3. Install any missing libraries via Sketch → Include Library → Manage Libraries.
4. If using SPIFFS/LittleFS, open Tools → ESP32 Sketch Data Upload (requires plugin).
5. Click Upload. Monitor status in IDE console.

## Serial Monitor
- Baud rate: typically 115200 (check sketch).
- Tools → Serial Monitor (select same baud rate).

## Filesystem (SPIFFS / LittleFS)
- Put files used by firmware (web assets, config) in `data/`.
- Use the "ESP32 Sketch Data Upload" plugin to upload to device.

## Secrets / Sensitive Data
- Do not commit Wi‑Fi passwords, API keys, or private keys to repo.
- Use `secrets.h` (ignored by .gitignore) or environment/config mechanism.

## Troubleshooting
- Compile errors: ensure correct ESP32 core and library versions.
- Upload failures: try lowering upload speed, pressing BOOT while reset, or using different USB cable/port.
- Missing filesystem files: confirm `data/` exists and use the Data Upload tool.

## Notes & Recommendations
- Keep dependencies pinned (library versions) in a short manifest or comments.
- Document wiring and sensor pinouts in this file if project uses external sensors.
- Consider adding an OTA update path if remote updates are needed.

## License
State the project license here (e.g., MIT) or link to LICENSE file.
