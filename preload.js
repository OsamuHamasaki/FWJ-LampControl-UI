// preload.js

"use strict"

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'api',
    {
        notifyPowerButtonPressed: () => ipcRenderer.send('PowerButtonPressed'),
        notifyPowerButtonUnpressed: () => ipcRenderer.send('PowerButtonUnpressed'),
        notifyBrightnessButtonPressed: () => ipcRenderer.send('BrightnessButtonPressed'),
        notifyBrightnessButtonUnpressed: () => ipcRenderer.send('BrightnessButtonUnpressed'),
        notifyBlinkButtonPressed: () => ipcRenderer.send('BlinkButtonPressed'),
        notifyBlinkButtonUnpressed: () => ipcRenderer.send('BlinkButtonUnpressed'),
        lampPowerAndBrightness: (listener) => ipcRenderer.on('LampPowerAndBrightness', (event, arg) => listener(arg))
    }
)

