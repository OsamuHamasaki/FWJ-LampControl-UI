// main.js
"use strict"

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

class LampIO {
    constructor() {
        this._buttonState = 0
    }
    
    get buttonState() {
        return this._buttonState
    }

    powerButtonOn() {
        this._buttonState |= 1 
    }

    powerButtonOff() {
        this._buttonState &= ~1 
    }

    brightnessButtonOn() {
        this._buttonState |= 2
    }

    brightnessButtonOff() {
        this._buttonState &= ~2
    }

    blinkButtonOn() {
        this._buttonState |= 4
    }

    blinkButtonOff() {
        this._buttonState &= ~4
    }
}

const lampIO = new LampIO()

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 316,
        height: 392,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(()=> {
    createWindow();

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('PowerButtonPressed', (event, args) => {
    lampIO.powerButtonOn()
})

ipcMain.on('PowerButtonUnpressed', (event, args) => {
    lampIO.powerButtonOff()
})

ipcMain.on('BrightnessButtonPressed', (event, args) => {
    lampIO.brightnessButtonOn()
})

ipcMain.on('BrightnessButtonUnpressed', (event, args) => {
    lampIO.brightnessButtonOff()
})

ipcMain.on('BlinkButtonPressed', (event, args) => {
    lampIO.blinkButtonOn()
})

ipcMain.on('BlinkButtonUnpressed', (event, args) => {
    lampIO.blinkButtonOff()
})

function powerAndBrightnessState(x) {
    const temp = Number.parseInt(x)
    return { power: (temp & 1) === 1, brightness: (temp & 2) === 2}
}

const server = net.createServer((connection) => {
    console.log('connection open.')

    connection.on('data', (data) => {
        try {
            mainWindow.webContents.send('LampPowerAndBrightness', powerAndBrightnessState(data)) 
            connection.write(lampIO.buttonState.toString())
        }
        catch (e) {
            console.log('application quitting while client connect')
        }
    })

    connection.on('close', () => {
        console.log('Connection closed frome client')
    })

}).listen(3000)

// End of File

