// renderer.js
"use strict"

class Widget {
    constructor(id) {
        this._element = document.getElementById(id)
    }
}

class Lamp extends Widget {
    constructor(id) {
        super(id)
        this._context = this._element.getContext("2d")
        this.drawFrame()
        this.off()
    }

    drawFrame() {
        this._context.fillStyle = "gray"
        this._context.fillRect(0, 0, this._element.width, this._element.height)
    }

    drawCircle(color) {
        const x = this._element.width / 2
        const y = this._element.height /2
        const r = Math.min(x, y)
        this._context.fillStyle = color
        this._context.beginPath()
        this._context.arc(x, y, r, 0, Math.PI * 2)
        this._context.fill()
    }

    off() {
        this.drawCircle("black")
    }

    dark() {
        this.drawCircle("lightgray")
    }

    bright() {
        this.drawCircle("white")
    }
}

class Button extends Widget {
    constructor(id) {
        super(id)
        this._mouseDownHandler = (e)=>{}
        this._mouseUpHandler = (e)=>{} 
        this.initialize()
    }

    initialize() {
        this._element.addEventListener("mousedown",
            (e) => {
                this._mouseDownHandler(e)
                document.addEventListener("mouseup",
                    (e) => {
                        this._mouseUpHandler(e)
                    },
                    { once: true})
            })
    }

    onMouseDown(f) {
        this._mouseDownHandler = f
    }

    onMouseUp(f) {
        this._mouseUpHandler = f
    }
}

const powerButton = new Button("PowerButton")
powerButton.onMouseDown((e) => {
    window.api.notifyPowerButtonPressed()
})
powerButton.onMouseUp((e) => {
    window.api.notifyPowerButtonUnpressed()
})

const brightnessButton = new Button("BrightnessButton")
brightnessButton.onMouseDown((e) => {
    window.api.notifyBrightnessButtonPressed()
})
brightnessButton.onMouseUp((e) => {
    window.api.notifyBrightnessButtonUnpressed()
})

const blinkButton = new Button("BlinkButton")
blinkButton.onMouseDown((e) => {
    window.api.notifyBlinkButtonPressed()
})
blinkButton.onMouseUp((e) => {
    window.api.notifyBlinkButtonUnpressed()
})

const lamp = new Lamp("Lamp")

window.api.lampPowerAndBrightness(({power, brightness}) => {
    if (!power) {
        lamp.off()
    }
    else if (!brightness) {
        lamp.dark()
    }
    else {
        lamp.bright()
    }
})

// End of File

