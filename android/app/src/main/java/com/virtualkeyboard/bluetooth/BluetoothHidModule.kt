package com.virtualkeyboard.bluetooth

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothHidDevice
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class BluetoothHidModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "BluetoothHidModule"
        private const val TAG = "BluetoothHidModule"
    }

    override fun getName(): String = NAME

    private val bluetoothManager: BluetoothManager? =
        reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
    private val bluetoothAdapter: BluetoothAdapter? = bluetoothManager?.adapter
    private var hidDevice: BluetoothHidDevice? = null
    private var connectedDevice: BluetoothDevice? = null
    private var isAppRegistered: Boolean = false
    private val executor: ExecutorService = Executors.newSingleThreadExecutor()
    private var isReceiverRegistered: Boolean = false
    private var listenerCount: Int = 0

    private val hidCallback = object : BluetoothHidDevice.Callback() {
        override fun onAppStatusChanged(pluggedDevice: BluetoothDevice?, registered: Boolean) {
            Log.d(TAG, "onAppStatusChanged: registered=$registered")
            isAppRegistered = registered
            val params = Arguments.createMap().apply {
                putBoolean("registered", registered)
                if (pluggedDevice != null) {
                    putString("deviceAddress", pluggedDevice.address)
                    putString("deviceName", getDeviceNameSafe(pluggedDevice))
                }
            }
            sendEvent("onHidDeviceRegistered", params)
        }

        override fun onConnectionStateChanged(device: BluetoothDevice, state: Int) {
            Log.d(TAG, "onConnectionStateChanged: device=${device.address}, state=$state")
            val stateString = when (state) {
                BluetoothProfile.STATE_CONNECTED -> {
                    connectedDevice = device
                    "CONNECTED"
                }
                BluetoothProfile.STATE_CONNECTING -> "CONNECTING"
                BluetoothProfile.STATE_DISCONNECTING -> "DISCONNECTING"
                BluetoothProfile.STATE_DISCONNECTED -> {
                    if (connectedDevice?.address == device.address) {
                        connectedDevice = null
                    }
                    "DISCONNECTED"
                }
                else -> "UNKNOWN"
            }

            val params = Arguments.createMap().apply {
                putString("state", stateString)
                putInt("rawState", state)
                putString("deviceAddress", device.address)
                putString("deviceName", getDeviceNameSafe(device))
            }
            sendEvent("onConnectionStateChanged", params)
        }

        override fun onGetReport(device: BluetoothDevice, type: Byte, id: Byte, bufferSize: Int) {
            try {
                hidDevice?.reportError(device, BluetoothHidDevice.ERROR_RSP_SUCCESS)
            } catch (e: SecurityException) {
                Log.e(TAG, "SecurityException on onGetReport", e)
            }
        }

        override fun onSetReport(device: BluetoothDevice, type: Byte, id: Byte, data: ByteArray) {
            try {
                hidDevice?.reportError(device, BluetoothHidDevice.ERROR_RSP_SUCCESS)
            } catch (e: SecurityException) {
                Log.e(TAG, "SecurityException on onSetReport", e)
            }
        }

        override fun onSetProtocol(device: BluetoothDevice, protocol: Byte) {
            try {
                hidDevice?.reportError(device, BluetoothHidDevice.ERROR_RSP_SUCCESS)
            } catch (e: SecurityException) {
                Log.e(TAG, "SecurityException on onSetProtocol", e)
            }
        }

        override fun onInterruptData(device: BluetoothDevice, reportId: Byte, data: ByteArray) {
            Log.d(TAG, "onInterruptData: reportId=$reportId, size=${data.size}")
        }

        override fun onVirtualCableUnplug(device: BluetoothDevice) {
            if (connectedDevice?.address == device.address) {
                connectedDevice = null
            }
            val params = Arguments.createMap().apply {
                putString("state", "DISCONNECTED")
                putInt("rawState", BluetoothProfile.STATE_DISCONNECTED)
                putString("deviceAddress", device.address)
                putString("deviceName", getDeviceNameSafe(device))
            }
            sendEvent("onConnectionStateChanged", params)
        }
    }
    private val serviceListener = object : BluetoothProfile.ServiceListener {
        override fun onServiceConnected(profile: Int, proxy: BluetoothProfile) {
            if (profile == BluetoothProfile.HID_DEVICE) {
                Log.d(TAG, "HID_DEVICE proxy connected")
                hidDevice = proxy as? BluetoothHidDevice
                registerAppInternal()
            }
        }

        override fun onServiceDisconnected(profile: Int) {
            if (profile == BluetoothProfile.HID_DEVICE) {
                Log.d(TAG, "HID_DEVICE proxy disconnected")
                hidDevice = null
                isAppRegistered = false
                connectedDevice = null
                sendEvent("onHidDeviceRegistered", Arguments.createMap().apply {
                    putBoolean("registered", false)
                })
            }
        }
    }

    private val bluetoothReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            when (action) {
                BluetoothAdapter.ACTION_STATE_CHANGED -> {
                    val state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR)
                    val isEnabled = state == BluetoothAdapter.STATE_ON
                    sendEvent("onBluetoothStateChanged", Arguments.createMap().apply {
                        putBoolean("enabled", isEnabled)
                        putInt("state", state)
                    })
                }
                BluetoothDevice.ACTION_FOUND -> {
                    val device = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE, BluetoothDevice::class.java)
                    } else {
                        @Suppress("DEPRECATION")
                        intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                    }
                    if (device != null) {
                        sendEvent("onDeviceDiscovered", Arguments.createMap().apply {
                            putString("address", device.address)
                            putString("name", getDeviceNameSafe(device))
                            putInt("bondState", device.bondState)
                        })
                    }
                }
                BluetoothAdapter.ACTION_DISCOVERY_STARTED -> {
                    sendEvent("onDiscoveryStarted", Arguments.createMap())
                }
                BluetoothAdapter.ACTION_DISCOVERY_FINISHED -> {
                    sendEvent("onDiscoveryFinished", Arguments.createMap())
                }
            }
        }
    }

    init {
        registerBluetoothReceiver()
    }

    private fun registerBluetoothReceiver() {
        if (!isReceiverRegistered) {
            try {
                val filter = IntentFilter().apply {
                    addAction(BluetoothAdapter.ACTION_STATE_CHANGED)
                    addAction(BluetoothDevice.ACTION_FOUND)
                    addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED)
                    addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
                }
                reactApplicationContext.registerReceiver(bluetoothReceiver, filter)
                isReceiverRegistered = true
            } catch (e: Exception) {
                Log.e(TAG, "Failed to register Bluetooth broadcast receiver", e)
            }
        }
    }

    private fun registerAppInternal(): Boolean {
        val hid = hidDevice ?: return false
        return try {
            val success = hid.registerApp(
                HidConstants.SDP_SETTINGS,
                null,
                HidConstants.QOS_SETTINGS,
                executor,
                hidCallback
            )
            Log.d(TAG, "hidDevice.registerApp() returned: $success")
            success
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException while calling registerApp", e)
            false
        }
    }

    private fun getDeviceNameSafe(device: BluetoothDevice): String {
        return try {
            device.name ?: device.address ?: "Unknown Device"
        } catch (e: SecurityException) {
            device.address ?: "Unknown Device"
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        if (reactApplicationContext.hasActiveReactInstance()) {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        listenerCount++
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
    }
}

    @ReactMethod
    fun registerApp(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
            promise.reject("UNSUPPORTED_OS", "Bluetooth HID Device API requires Android 9.0 (API 28) or higher.")
            return
        }

        val adapter = bluetoothAdapter
        if (adapter == null) {
            promise.reject("NO_ADAPTER", "Bluetooth adapter is not available on this device.")
            return
        }

        if (!adapter.isEnabled) {
            promise.reject("BLUETOOTH_DISABLED", "Bluetooth must be enabled to register HID Device.")
            return
        }

        try {
            if (hidDevice != null) {
                val registered = registerAppInternal()
                promise.resolve(registered)
                return
            }

            val proxySuccess = adapter.getProfileProxy(
                reactApplicationContext,
                serviceListener,
                BluetoothProfile.HID_DEVICE
            )
            Log.d(TAG, "adapter.getProfileProxy(HID_DEVICE) result: $proxySuccess")
            promise.resolve(proxySuccess)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("REGISTER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun unregisterApp(promise: Promise) {
        val hid = hidDevice
        val adapter = bluetoothAdapter
        if (hid == null || adapter == null) {
            isAppRegistered = false
            connectedDevice = null
            promise.resolve(true)
            return
        }

        try {
            hid.unregisterApp()
            adapter.closeProfileProxy(BluetoothProfile.HID_DEVICE, hid)
            hidDevice = null
            isAppRegistered = false
            connectedDevice = null
            promise.resolve(true)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("UNREGISTER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun isRegistered(promise: Promise) {
        promise.resolve(isAppRegistered)
    }

    @ReactMethod
    fun connectToDevice(deviceAddress: String, promise: Promise) {
        val hid = hidDevice
        val adapter = bluetoothAdapter
        if (hid == null || adapter == null) {
            promise.reject("NOT_INITIALIZED", "Bluetooth HID service is not initialized. Call registerApp first.")
            return
        }

        try {
            val device = adapter.getRemoteDevice(deviceAddress)
            if (device == null) {
                promise.reject("DEVICE_NOT_FOUND", "Device with address $deviceAddress not found.")
                return
            }
            val result = hid.connect(device)
            promise.resolve(result)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("CONNECT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun connect(deviceAddress: String, promise: Promise) {
        connectToDevice(deviceAddress, promise)
    }

    @ReactMethod
    fun disconnect(promise: Promise) {
        val hid = hidDevice
        val dev = connectedDevice
        if (hid == null || dev == null) {
            promise.resolve(true)
            return
        }

        try {
            val result = hid.disconnect(dev)
            promise.resolve(result)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("DISCONNECT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getConnectionState(promise: Promise) {
        val hid = hidDevice
        val dev = connectedDevice
        val map = Arguments.createMap()

        map.putBoolean("isRegistered", isAppRegistered)

        if (hid == null || dev == null) {
            map.putString("state", "DISCONNECTED")
            map.putInt("rawState", BluetoothProfile.STATE_DISCONNECTED)
            map.putNull("device")
            promise.resolve(map)
            return
        }

        try {
            val state = hid.getConnectionState(dev)
            val stateString = when (state) {
                BluetoothProfile.STATE_CONNECTED -> "CONNECTED"
                BluetoothProfile.STATE_CONNECTING -> "CONNECTING"
                BluetoothProfile.STATE_DISCONNECTING -> "DISCONNECTING"
                else -> "DISCONNECTED"
            }
            map.putString("state", stateString)
            map.putInt("rawState", state)
            map.putMap("device", Arguments.createMap().apply {
                putString("address", dev.address)
                putString("name", getDeviceNameSafe(dev))
            })
            promise.resolve(map)
        } catch (e: SecurityException) {
            map.putString("state", "UNKNOWN")
            map.putInt("rawState", -1)
            map.putNull("device")
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("STATE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getBondedDevices(promise: Promise) {
        val adapter = bluetoothAdapter
        if (adapter == null) {
            promise.reject("NO_ADAPTER", "Bluetooth adapter is not available.")
            return
        }

        try {
            val bonded = adapter.bondedDevices ?: emptySet()
            val list = Arguments.createArray()
            for (device in bonded) {
                val map = Arguments.createMap().apply {
                    putString("address", device.address)
                    putString("name", getDeviceNameSafe(device))
                    putInt("bondState", device.bondState)
                    putBoolean("isConnected", connectedDevice?.address == device.address)
                }
                list.pushMap(map)
            }
            promise.resolve(list)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("BONDED_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun sendMouseReport(buttons: Int, dx: Int, dy: Int, scroll: Int, promise: Promise) {
        val dev = connectedDevice
        val hid = hidDevice
        if (hid == null) {
            promise.reject("NOT_INITIALIZED", "HID device proxy is not initialized.")
            return
        }
        if (dev == null) {
            promise.reject("NOT_CONNECTED", "No host computer is currently connected.")
            return
        }

        val report = byteArrayOf(
            (buttons and 0x07).toByte(),
            dx.coerceIn(-127, 127).toByte(),
            dy.coerceIn(-127, 127).toByte(),
            scroll.coerceIn(-127, 127).toByte()
        )

        try {
            val sent = hid.sendReport(dev, HidConstants.ID_MOUSE.toInt(), report)
            promise.resolve(sent)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("SEND_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun sendKeyboardReport(modifier: Int, keyCode: Int, promise: Promise) {
        val dev = connectedDevice
        val hid = hidDevice
        if (hid == null) {
            promise.reject("NOT_INITIALIZED", "HID device proxy is not initialized.")
            return
        }
        if (dev == null) {
            promise.reject("NOT_CONNECTED", "No host computer is currently connected.")
            return
        }

        val report = byteArrayOf(
            (modifier and 0xFF).toByte(),
            0.toByte(),
            (keyCode and 0xFF).toByte(),
            0.toByte(),
            0.toByte(),
            0.toByte(),
            0.toByte(),
            0.toByte()
        )

        try {
            val sent = hid.sendReport(dev, HidConstants.ID_KEYBOARD.toInt(), report)
            promise.resolve(sent)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("SEND_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun sendKeyboardMultiReport(
        modifier: Int,
        key1: Int,
        key2: Int,
        key3: Int,
        key4: Int,
        key5: Int,
        key6: Int,
        promise: Promise
    ) {
        val dev = connectedDevice
        val hid = hidDevice
        if (hid == null) {
            promise.reject("NOT_INITIALIZED", "HID device proxy is not initialized.")
            return
        }
        if (dev == null) {
            promise.reject("NOT_CONNECTED", "No host computer is currently connected.")
            return
        }

        val report = byteArrayOf(
            (modifier and 0xFF).toByte(),
            0.toByte(),
            (key1 and 0xFF).toByte(),
            (key2 and 0xFF).toByte(),
            (key3 and 0xFF).toByte(),
            (key4 and 0xFF).toByte(),
            (key5 and 0xFF).toByte(),
            (key6 and 0xFF).toByte()
        )

        try {
            val sent = hid.sendReport(dev, HidConstants.ID_KEYBOARD.toInt(), report)
            promise.resolve(sent)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("SEND_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun sendRawReport(reportId: Int, data: ReadableArray, promise: Promise) {
        val dev = connectedDevice
        val hid = hidDevice
        if (hid == null) {
            promise.reject("NOT_INITIALIZED", "HID device proxy is not initialized.")
            return
        }
        if (dev == null) {
            promise.reject("NOT_CONNECTED", "No host computer is currently connected.")
            return
        }

        val byteArray = ByteArray(data.size()) { index -> data.getInt(index).toByte() }
        try {
            val sent = hid.sendReport(dev, reportId, byteArray)
            promise.resolve(sent)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_CONNECT is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("SEND_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun makeDiscoverable(durationSeconds: Int, promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null.")
            return
        }

        try {
            val discoverableIntent = Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE).apply {
                putExtra(
                    BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION,
                    durationSeconds.coerceIn(1, 300)
                )
            }
            activity.startActivity(discoverableIntent)
            promise.resolve(true)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_ADVERTISE is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("DISCOVERABLE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getBluetoothState(promise: Promise) {
        val adapter = bluetoothAdapter
        val isEnabled = adapter?.isEnabled == true
        val map = Arguments.createMap().apply {
            putBoolean("enabled", isEnabled)
            putBoolean("isSupported", adapter != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
        }
        promise.resolve(map)
    }

    @ReactMethod
    fun startDiscovery(promise: Promise) {
        val adapter = bluetoothAdapter
        if (adapter == null) {
            promise.reject("NO_ADAPTER", "Bluetooth adapter is not available.")
            return
        }
        try {
            if (adapter.isDiscovering) {
                adapter.cancelDiscovery()
            }
            val started = adapter.startDiscovery()
            promise.resolve(started)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_SCAN is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("DISCOVERY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun cancelDiscovery(promise: Promise) {
        val adapter = bluetoothAdapter
        if (adapter == null) {
            promise.resolve(true)
            return
        }
        try {
            val canceled = adapter.cancelDiscovery()
            promise.resolve(canceled)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Permission BLUETOOTH_SCAN is required: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("DISCOVERY_ERROR", e.message, e)
        }
    }

    override fun invalidate() {
        super.invalidate()
        if (isReceiverRegistered) {
            try {
                reactApplicationContext.unregisterReceiver(bluetoothReceiver)
                isReceiverRegistered = false
            } catch (e: Exception) {
                Log.e(TAG, "Error unregistering receiver", e)
            }
        }

        try {
            hidDevice?.let { hid ->
                bluetoothAdapter?.closeProfileProxy(BluetoothProfile.HID_DEVICE, hid)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error closing profile proxy", e)
        }
        executor.shutdown()
    }
}


