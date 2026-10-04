# VirtualKeyboard: Serverless React Native Bluetooth HID Mouse & Keyboard

[![React Native](https://img.shields.io/badge/React_Native-0.87.1-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Android](https://img.shields.io/badge/Target_OS-Android_9.0+_(API_28+)-3DDC84?logo=android&logoColor=white)](https://developer.android.com/reference/android/bluetooth/BluetoothHidDevice)
[![Build Status](https://img.shields.io/badge/Build-GitHub_Actions_Automated_APK-2088FF?logo=github-actions&logoColor=white)](https://github.com/DigiBusTech/virtualkeyboard/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A standalone mobile application built with **React Native**, **TypeScript**, and **Kotlin** that transforms your Android device into a standard **Bluetooth Human Interface Device (HID)**. Your phone pairs natively with any PC or Mac as a physical Bluetooth mouse and keyboard, requiring **zero software, companion apps, or drivers on the host computer**.

---

## 🎯 Architecture & Design Rationale

### Why Android API 28+ is Mandatory
Apple strictly prohibits iOS applications from broadcasting standard Bluetooth HID services (`UUID 0x1812`) via public CoreBluetooth APIs. Therefore, creating a truly serverless Bluetooth peripheral requires Android's low-level `android.bluetooth.BluetoothHidDevice` API, introduced in Android 9.0 (API level 28).

```
+------------------------------------+
|  Android Phone (API 28+)           |
|  - React Native UI (Trackpad/Keys) |
|  - BluetoothHidModule (Kotlin)     |
|  - BluetoothHidDevice API          |
+-----------------+------------------+
                  |  Standard Bluetooth HID (UUID 0x1812)
                  |  Zero host software needed!
+-----------------v------------------+
|  Host Computer (PC / Mac / Linux)  |
|  - Recognized as Hardware Mouse    |
|  - Recognized as Hardware Keyboard |
+------------------------------------+
```

---

## ✨ Key Features Explained

### 1. Multi-Touch Gesture Trackpad
- **60Hz Throttled Motion**: Captures delta movements ($dX$, $dY$) with high responsiveness while buffering packets to prevent Bluetooth link saturation.
- **1-Finger Tap**: Transmits standard Left Mouse Click (`buttons = 1`, then `0`).
- **2-Finger Tap**: Transmits standard Right Mouse Click (`buttons = 2`, then `0`).
- **2-Finger Drag**: Transmits vertical scroll wheel data (`-127` to `+127`).
- **Tactile Click Buttons**: Dedicated hardware-style Left Click and Right Click touch pads at the bottom of the screen.
- **Custom Sensitivity**: 1.0x, 1.5x, 2.0x, and 2.5x cursor speed presets.

### 2. Full Hardware-Free Virtual Keyboard
- **Independent Scan Codes**: Bypasses the software IME to transmit raw USB HID Usage Table (Page `0x07`) hardware scan codes (`A-Z`, numbers, function keys, arrows).
- **Press & Release Simulation**: Sends `sendKeyboardReport(modifier, keyCode)` on press down, and `sendKeyboardReport(modifier, 0x00)` on press release.
- **Latching Modifiers**: Supports simultaneous modifier combinations: Shift (`0x02`), Control (`0x01`), Alt (`0x04`), and Windows / Command (`0x08`).
- **Dynamic Shift State**: Keys automatically switch between lowercase, uppercase, and alternative symbols (`!`, `@`, `#`, `$`, etc.) when Shift is latched.

### 3. Native Bluetooth Pairing & Discovery UI
- **Host Discovery**: Scans for nearby discoverable PCs and Macs via `BluetoothAdapter.startDiscovery()`.
- **Make Discoverable**: Puts the phone's Bluetooth radio into discoverable mode (180s) so PCs and Macs can initiate pairing directly.
- **Paired Host Management**: Displays paired computers with 1-tap Connect and Disconnect controls.

---

## 📡 HID Protocol Specifications

### Composite Report Descriptor
- **Report ID 1: Keyboard (8 Bytes)**: `[Modifier byte] [Reserved 0x00] [6-Key rollover array]`
- **Report ID 2: Mouse (4 Bytes)**: `[3 buttons + 5 padding bits] [dX: -127..127] [dY: -127..127] [Scroll: -127..127]`
- **SDP Settings**: Service Name `"Virtual Keyboard/Mouse"`, Provider `"VirtualKeyboard"`, Subclass `SUBCLASS1_COMBO` (`0xC0`).


---

## 📱 How to Download & Test the App (No Play Store Needed)

### Method A: Automated Cloud Build via GitHub Actions (Zero Local Setup)
Every push to this repository automatically compiles and packages a standalone Release APK in the cloud:
1. Open this repository in your web browser: [https://github.com/DigiBusTech/virtualkeyboard](https://github.com/DigiBusTech/virtualkeyboard).
2. Click the **Actions** tab at the top.
3. Click the latest run of **"Build Android APK"**.
4. Under **Artifacts** at the bottom of the page, click **`VirtualKeyboard-APK`** to download the zip file.
5. Extract `app-release.apk` and transfer/download it to your Android phone to install!

### Method B: Build Locally on Your PC
```bash
# Clone the repository
git clone https://github.com/DigiBusTech/virtualkeyboard.git
cd virtualkeyboard

# Install dependencies
npm install

# Compile the standalone release APK
npm run build:apk
```
The compiled APK will be output to:
`android/app/build/outputs/apk/release/app-release.apk`

---

## 💻 How to Pair with Your PC or Mac

1. **Launch App**: Open **VirtualKeyboard** on your Android phone and grant requested Bluetooth permissions.
2. **Make Discoverable**: Go to the **Pairing** tab and tap **"📡 Make Discoverable"**.
3. **On Your Host Computer**:
   - **Windows**: Settings > Bluetooth & devices > Add device > Bluetooth.
   - **macOS**: System Settings > Bluetooth.
   - **Linux**: Settings > Bluetooth.
4. **Pair**: Select your phone from the list and confirm the pairing PIN prompt on both devices.
5. **Start Controlling**:
   - Switch to the **Trackpad** tab to control the mouse pointer and scroll.
   - Switch to the **Keyboard** tab to type directly into any text field or application!

---

## 🧪 Testing & Quality Assurance

```bash
# Run TypeScript strict type check
npm run typecheck

# Run ESLint linter
npm run lint

# Run Jest unit test suite (36 tests across 9 test suites)
npm test
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


