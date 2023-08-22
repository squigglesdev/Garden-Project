const maxFlowers = 1000;
const maxApocalypseFlowers = 1000;
let flowers = [];
let apocalypseFlowers = [];

let skyColor = "#82e4ff";
let groundColor = "#75b560";
let sunColor = "#fffa73";
let soilColor = "#786c4f";
let bodyColor = "#fff";

let sunPosX = 0;


let apocalypse = false;

let time = 1;

function setup() {
  createCanvas(800, 400);
  frameRate(165);
}

function draw() {
    background(skyColor);
    fill(groundColor);
    square(-10, 300, 820);
    
    fill(sunColor);
    circle(sunPosX, 0, 250);

    if(!apocalypse) {
        sunPosX = 800 - easeInOutSine(time, 0, 800, 1);
        skyColor = lerpColor(color("#770b01"), color("#82e4ff"), time);
        groundColor = lerpColor(color("#180000"), color("#75b560"), time);
        sunColor = lerpColor(color("#be2502"), color("#fffa73"), time);
        soilColor = lerpColor(color("#000"), color("#786c4f"), time);
        changeText("Cosy Garden", skyColor);
        bodyColor = lerpColor(color("#000"), color("#fff"), time);
        changeBody(bodyColor, "icons/Cosy.png");
        for (let f of flowers) {
            f.display();
        }
        for (let f of apocalypseFlowers) {
            f.displayDead();
        }
    }
    else {
        sunPosX = easeInOutSine(time, 0, 800, 1);
        skyColor = lerpColor(color("#82e4ff"), color("#770b01"), time);
        groundColor = lerpColor(color("#75b560"), color("#180000"), time);
        sunColor = lerpColor(color("#fffa73"), color("#be2502"), time);
        soilColor = lerpColor(color("#786c4f"), color("#000"), time);
        changeText("Hellish Garden", skyColor);
        bodyColor = lerpColor(color("#fff"), color("#000"), time);
        changeBody(bodyColor, "icons/Hellish.png");
        for (let f of apocalypseFlowers) {
            f.display();
        }
        for (let f of flowers) {
            f.displayDead();
        }
    }
    time += 0.01;
    time = max(0, min(time, 1));
}

function easeOutBack (t, b, c, d) {
    q = 1.70158; 
    return c * ((t = t / d - 1) * t * ((q + 1) * t + q) + 1) + b;
}

function easeInSine (t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}

function easeOutSine (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

function easeInOutSine (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}

function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}

function mouseClicked() {
    if(mouseY > 300) {
        if (!apocalypse) {
            createFlower();
        }
        else {createApocalypseFlower();}
    }
    if(!apocalypse) {
        if(mouseY < 125 && mouseX < 125) {
            time = 0;
            apocalypse = !apocalypse;
        }
    }
    else {
        if(mouseY < 125 && mouseX > 675) {
            time = 0;
            apocalypse = !apocalypse;
        }
    }
}

function drawFlower(x, y, size, r, g, b) {
    const petalSize = size / 2;
    const spacing = petalSize / 2;
    fill(r, g, b);
    circle(x - spacing, y - spacing, petalSize);
    circle(x + spacing, y - spacing, petalSize);
    circle(x - spacing, y + spacing, petalSize);
    circle(x + spacing, y + spacing, petalSize);
    fill("#fffa73");
    circle(x, y, petalSize);
}

function drawApocalypseFlower(x, y, size, r, g, b, p, s) {
    const petalSize = size / 2;
    const spacing = petalSize / 2;
    fill(r, g, b);
    polygon(x, y, petalSize, p);
    fill("#786c4f");
    polygon(x, y, spacing, s);
}

function changeText(text, color){
    toChange = document.getElementById("title");
    toChange.innerHTML = text;
    toChange.style.color = color;
    toChange = document.getElementById("pageTitle");
    toChange.innerHTML = text;
}

function changeBody(color, icon){
    toChange = document.getElementById("body");
    toChange.style.backgroundColor = color;
    toChange = document.querySelector("link[rel~='icon']");
    toChange.href = icon;
}

function createFlower() {
    const f = flowers.length == maxFlowers && flowers.shift() || new Flower;
    flowers.push(f.setXYRGBT(mouseX, mouseY, random(255), random(255), random(255), 0.0));
}

function createApocalypseFlower() {
    const f = apocalypseFlowers.length == maxApocalypseFlowers && apocalypseFlowers.shift() || new ApocalypseFlower;
    apocalypseFlowers.push(f.setXYRGBT(mouseX, mouseY, random(70), random(25), random(25), 0.0));
}

class Flower {
    static get DIAM() { return 50; }
    constructor(x, y) { this.setXYRGBT(x, y, this.r, this.g, this.b, this.time); }
    
    setXYRGBT(x, y, r, g, b, t) {
        this.x = x, this.y = y, this.r = r, this.g = g, this.b = b, this.time = t;
        this.growth = 0;
        return this;
    }
    display() { 
        fill(soilColor);
        ellipse(this.x, this.y, 20, 10);
        this.time += 1;
        this.time = max(0, min(this.time, 100));
        this.growth = easeOutBack(this.time, 0, 30, 100);
        line(this.x, this.y, this.x, this.y-(this.growth));
        drawFlower(this.x, this.y-(this.growth), (this.growth), this.r, this.g, this.b);
    }
    displayDead() {
        this.time -= 1;
        this.time = max(0, min(this.time, 100));
        this.growth = easeOutBack(this.time, 0, 30, 100);
        if (this.growth > 0) {line(this.x, this.y, this.x, this.y-(this.growth));}
        drawFlower(this.x, this.y-(this.growth), (this.growth), this.r, this.g, this.b);
    }
}

class ApocalypseFlower {
    static get DIAM() { return 50; }
    constructor(x, y) { this.setXYRGBT(x, y, this.r, this.g, this.b, this.time); }
    
    setXYRGBT(x, y, r, g, b, t) {
        this.x = x, this.y = y, this.r = r, this.g = g, this.b = b, this.time = t;
        this.growth = 0;
        this.pointsA = random(3, 8);
        this.pointsB = random(3, 8);
        return this;
    }
    display() { 
        fill(soilColor);
        ellipse(this.x, this.y, 20, 10);
        this.time += 1;
        this.time = max(0, min(this.time, 100));
        this.growth = easeInSine(this.time, 0, 30, 100);
        line(this.x, this.y, this.x, this.y-(this.growth));
        drawApocalypseFlower(this.x, this.y-(this.growth), (this.growth), this.r, this.g, this.b, this.pointsA, this.pointsB);
    }
    displayDead() {
        this.time -= 1;
        this.time = max(0, min(this.time, 100));
        this.growth = easeInSine(this.time, 0, 30, 100);
        if (this.growth > 0) {line(this.x, this.y, this.x, this.y-(this.growth));}
        drawApocalypseFlower(this.x, this.y-(this.growth), (this.growth), this.r, this.g, this.b, this.pointsA, this.pointsB);
    }
}