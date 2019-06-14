// maximum intensity of the fire (color)
const maxIntensity = 36;

// size of each pixel
const pixelSize = 8;

// fire color
const colorsPallete = [
    '#070707',
    '#1f0707',
    '#2f0f07',
    '#470f07',
    '#571707',
    '#671f07',
    '#771f07',
    '#8f2707',
    '#9f2f07',
    '#af3f07',
    '#bf4707',
    '#c74707',
    '#df4f07',
    '#df5707',
    '#df5707',
    '#d75f07',
    '#d75f07',
    '#d7670f',
    '#cf6f0f',
    '#cf770f',
    '#cf7f0f',
    '#cf8717',
    '#c78717',
    '#c78f17',
    '#c7971f',
    '#bf9f1f',
    '#bf9f1f',
    '#bfa727',
    '#bfa727',
    '#bfaf2f',
    '#b7af2f',
    '#b7b72f',
    '#b7b737',
    '#cfcf6f',
    '#dfdf9f',
    '#efefc7',
    '#ffffff',
];

class DoomFire {

    constructor(canvasId, width, height) {
        const canvas = document.getElementById(canvasId);
        canvas.width = (width * pixelSize);
        canvas.height = (height * pixelSize);

        this.width = width;
        this.height = height;

        this.context = canvas.getContext('2d');

        this.pixels = new Array(width * height);
        this.pixels.fill(0);
    }

    start() {
        this.startFireIntensity();
        this.loop();
    }

    loop() {
        this.calculateFireIntensity();
        this.render();
        requestAnimationFrame(() => {
            this.loop();
        });
    }

    /**
     * all bottom pixels must start with the maximum intensity of 36
     */
    startFireIntensity() {
        const bottomColumn = (this.pixels.length - this.width);
        for (let column = bottomColumn; column < this.pixels.length; column++) {
            this.pixels[column] = maxIntensity;
        }
    }

    /**
     * Calculates the new intensity of the fire for each pixel based on a random value (decay) 
     * which will be used to decrease the intensity
     */
    calculateFireIntensity() {
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                // get the pixel index
                const index2d = column + (row * this.width);
                // get the index of the pixel below
                const indexBelow = index2d + this.width;

                // if it overflows the size of the canvas we must ignore
                if (indexBelow >= (this.width * this.height)) {
                    continue;
                }

                // random value which will help to update the fire intensity
                const decay = this.getDecay();
                const belowFireIntensity = this.pixels[indexBelow];
                let newFireIntensity = belowFireIntensity - decay;

                if (newFireIntensity < 0) {
                    newFireIntensity = 0;
                }

                // this helps to create the wind effect
                this.pixels[index2d - decay] = newFireIntensity;
            }
        }
    }

    getDecay() {
        return Math.floor(Math.random() * 2);
    }

    render() {
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                const index2d = column + (row * this.width);
                const fireIntensity = this.pixels[index2d];
                const color = colorsPallete[fireIntensity];

                this.context.fillStyle = color;
                this.context.fillRect(column * pixelSize, row * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

// here we start the fire
const doomfire = new DoomFire('fire-canvas', 80, 70);
doomfire.start();
