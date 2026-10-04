package com.virtualkeyboard.bluetooth

import android.bluetooth.BluetoothHidDevice
import android.bluetooth.BluetoothHidDeviceAppQosSettings
import android.bluetooth.BluetoothHidDeviceAppSdpSettings

/**
 * Constants for the Bluetooth Human Interface Device (HID) Profile.
 *
 * Defines the composite HID Report Descriptor for:
 * 1. Keyboard (Report ID 1): 8-byte report (modifiers, reserved, 6 key codes)
 * 2. Mouse (Report ID 2): 4-byte report (button bitmask, relative X, relative Y, scroll wheel)
 */
object HidConstants {
    const val ID_KEYBOARD: Byte = 1
    const val ID_MOUSE: Byte = 2

    /**
     * Standard HID Report Descriptor for a combined Keyboard and Mouse peripheral.
     */
    val REPORT_DESCRIPTOR = byteArrayOf(
        // ---------------- Keyboard (Report ID 1) ----------------
        0x05.toByte(), 0x01.toByte(), // Usage Page (Generic Desktop)
        0x09.toByte(), 0x06.toByte(), // Usage (Keyboard)
        0xA1.toByte(), 0x01.toByte(), // Collection (Application)
        0x85.toByte(), ID_KEYBOARD,   //   Report ID (1)
        0x05.toByte(), 0x07.toByte(), //   Usage Page (Key Codes)
        0x19.toByte(), 0xE0.toByte(), //   Usage Minimum (224 - Left Control)
        0x29.toByte(), 0xE7.toByte(), //   Usage Maximum (231 - Right GUI)
        0x15.toByte(), 0x00.toByte(), //   Logical Minimum (0)
        0x25.toByte(), 0x01.toByte(), //   Logical Maximum (1)
        0x75.toByte(), 0x01.toByte(), //   Report Size (1 bit)
        0x95.toByte(), 0x08.toByte(), //   Report Count (8 bits)
        0x81.toByte(), 0x02.toByte(), //   Input (Data, Variable, Absolute) -> Modifier byte
        0x75.toByte(), 0x08.toByte(), //   Report Size (8 bits)
        0x95.toByte(), 0x01.toByte(), //   Report Count (1 byte)
        0x81.toByte(), 0x01.toByte(), //   Input (Constant)                 -> Reserved byte
        0x75.toByte(), 0x08.toByte(), //   Report Size (8 bits)
        0x95.toByte(), 0x06.toByte(), //   Report Count (6 bytes)
        0x15.toByte(), 0x00.toByte(), //   Logical Minimum (0)
        0x25.toByte(), 0x65.toByte(), //   Logical Maximum (101)
        0x05.toByte(), 0x07.toByte(), //   Usage Page (Key Codes)
        0x19.toByte(), 0x00.toByte(), //   Usage Minimum (0)
        0x29.toByte(), 0x65.toByte(), //   Usage Maximum (101)
        0x81.toByte(), 0x00.toByte(), //   Input (Data, Array)              -> 6 Key Codes Array
        0xC0.toByte(),                // End Collection

        // ---------------- Mouse (Report ID 2) ----------------
        0x05.toByte(), 0x01.toByte(), // Usage Page (Generic Desktop)
        0x09.toByte(), 0x02.toByte(), // Usage (Mouse)
        0xA1.toByte(), 0x01.toByte(), // Collection (Application)
        0x85.toByte(), ID_MOUSE,      //   Report ID (2)
        0x09.toByte(), 0x01.toByte(), //   Usage (Pointer)
        0xA1.toByte(), 0x00.toByte(), //   Collection (Physical)
        0x05.toByte(), 0x09.toByte(), //     Usage Page (Buttons)
        0x19.toByte(), 0x01.toByte(), //     Usage Minimum (1)
        0x29.toByte(), 0x03.toByte(), //     Usage Maximum (3)
        0x15.toByte(), 0x00.toByte(), //     Logical Minimum (0)
        0x25.toByte(), 0x01.toByte(), //     Logical Maximum (1)
        0x75.toByte(), 0x01.toByte(), //     Report Size (1 bit)
        0x95.toByte(), 0x03.toByte(), //     Report Count (3 buttons: Left, Right, Middle)
        0x81.toByte(), 0x02.toByte(), //     Input (Data, Variable, Absolute)
        0x75.toByte(), 0x05.toByte(), //     Report Size (5 bits)
        0x95.toByte(), 0x01.toByte(), //     Report Count (1 byte)
        0x81.toByte(), 0x01.toByte(), //     Input (Constant)               -> 5-bit padding
        0x05.toByte(), 0x01.toByte(), //     Usage Page (Generic Desktop)
        0x09.toByte(), 0x30.toByte(), //     Usage (X)
        0x09.toByte(), 0x31.toByte(), //     Usage (Y)
        0x09.toByte(), 0x38.toByte(), //     Usage (Wheel)
        0x15.toByte(), 0x81.toByte(), //     Logical Minimum (-127)
        0x25.toByte(), 0x7F.toByte(), //     Logical Maximum (127)
        0x75.toByte(), 0x08.toByte(), //     Report Size (8 bits)
        0x95.toByte(), 0x03.toByte(), //     Report Count (3 bytes: X, Y, Wheel)
        0x81.toByte(), 0x06.toByte(), //     Input (Data, Variable, Relative)
        0xC0.toByte(),                //   End Collection (Physical)
        0xC0.toByte()                 // End Collection (Application)
    )

    private const val SDP_NAME = "Virtual Keyboard/Mouse"
    private const val SDP_DESCRIPTION = "Virtual Keyboard and Mouse HID Peripheral"
    private const val SDP_PROVIDER = "VirtualKeyboard"

    val SDP_SETTINGS = BluetoothHidDeviceAppSdpSettings(
        SDP_NAME,
        SDP_DESCRIPTION,
        SDP_PROVIDER,
        BluetoothHidDevice.SUBCLASS1_COMBO,
        REPORT_DESCRIPTOR
    )

    val QOS_SETTINGS = BluetoothHidDeviceAppQosSettings(
        BluetoothHidDeviceAppQosSettings.SERVICE_BEST_EFFORT,
        800,
        9,
        0,
        11250,
        BluetoothHidDeviceAppQosSettings.MAX
    )
}
