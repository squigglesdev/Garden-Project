const maxFlowers = 1000;
const maxGrass = 1000;
const maxTrees = 1000;
let flowers = [];
let grass = [];
let trees = [];
let cashIndicators = [];

let ALLDATA = {};

let flowersUnlocked = false;
let treesUnlocked = false;

const pickerOpts = {
    types: [
      {
        description: "Save File",
        accept: {
          "json/*": [".json"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
};


let skyColor = "#82e4ff";
let groundColor = "#75b560";
let sunColor = "#fffa73";
let soilColor = "#786c4f";
let bodyColor = "#fff";

let sunPosX = 0;

let flowersBought = 0;
let grassBought = 0;
let currentCash = 50;

let cashMeter = document.getElementById("cash");

let firstTime = true;

let time = 1;

let flowerImage;

function saveGame() {
    ALLDATA = {
        flowers: flowers,
        grass: grass,
        trees: trees,
        cashIndicators: cashIndicators,
        flowersUnlocked: flowersUnlocked,
        treesUnlocked: treesUnlocked,
        flowersBought: flowersBought,
        grassBought: grassBought,
        currentCash: currentCash,
        firstTime: firstTime,
        time: time
    }
    save(ALLDATA, "save.json");
}

function loadGame() {
    print("load");
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", ".json");
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        console.log(fileList);
        parseFile(fileList[0]);
    });
    fileSelector.click();

    
    /*
    ALLDATA = loadJSON(file, function() {
        flowers = ALLDATA.flowers;
        grass = ALLDATA.grass;
        trees = ALLDATA.trees;
        cashIndicators = ALLDATA.cashIndicators;
        flowersUnlocked = ALLDATA.flowersUnlocked;
        treesUnlocked = ALLDATA.treesUnlocked;
        flowersBought = ALLDATA.flowersBought;
        grassBought = ALLDATA.grassBought;
        currentCash = ALLDATA.currentCash;
        firstTime = ALLDATA.firstTime;
        time = ALLDATA.time;
    });*/
}

function parseFile(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const result = event.target.result;
        print(result);
        ALLDATA = JSON.parse(result);
        print(ALLDATA);
        for(f in ALLDATA.flowers) {
            flowers.push(new Flower(ALLDATA.flowers[f].x, ALLDATA.flowers[f].y).setXYRGBT(ALLDATA.flowers[f].x, ALLDATA.flowers[f].y, ALLDATA.flowers[f].r, ALLDATA.flowers[f].g, ALLDATA.flowers[f].b, ALLDATA.flowers[f].time));
        }
        for(g in ALLDATA.grass) {
            grass.push(new Grass(ALLDATA.grass[g].x, ALLDATA.grass[g].y).setXY(ALLDATA.grass[g].x, ALLDATA.grass[g].y));
        }
        for(c in ALLDATA.cashIndicators) {
            cashIndicators.push(new CashIndicator(ALLDATA.cashIndicators[c].x, ALLDATA.cashIndicators[c].y).setXYCash(ALLDATA.cashIndicators[c].x, ALLDATA.cashIndicators[c].y, ALLDATA.cashIndicators[c].c, ALLDATA.cashIndicators[c].offset));
        }
        trees = ALLDATA.trees;
        flowersUnlocked = ALLDATA.flowersUnlocked;
        treesUnlocked = ALLDATA.treesUnlocked;
        flowersBought = ALLDATA.flowersBought;
        grassBought = ALLDATA.grassBought;
        currentCash = ALLDATA.currentCash;
        firstTime = ALLDATA.firstTime;
        time = ALLDATA.time;
    });
    reader.readAsText(file);
}


function preload() {
    flowerImage = loadImage("assets/sprites/flowerPurchase.png");
    grassImage = loadImage("assets/sprites/grassPurchase.png");
    font = loadFont("assets/fonts/ceraProMedium.otf");
}

function setup() {
  canvas = createCanvas(800, 400);
  canvas.parent("game");
  frameRate(165);
}

function draw() {
    strokeWeight(2);
    background(skyColor);
    fill(groundColor);
    square(-10, 300, 820);
    
    fill(sunColor);
    circle(sunPosX, 0, 250);

    
    for (let g of grass) {
        g.display();
    }

    for (let f of flowers) {
        f.display();
    }

    for (let c of cashIndicators) {
        c.display();
    }


    time += 0.01;
    time = max(0, min(time, 1));

    textAlign(CENTER);

    fill("#fff");
    strokeWeight(2);
    let saveButton = button(555, 25, 60, 30);
    fill("#000");
    textFont(font);
    textSize(20);
    text("Save", 585, 45);

    fill("#fff");
    strokeWeight(2);
    let loadButton = button(625, 25, 60, 30);
    fill("#000");
    textFont(font);
    textSize(20);
    text("Load", 655, 45);


    fill("#fff");
    strokeWeight(2);
    let buyGrassButton = button(695, 25, 70, 90);
    image(grassImage, 700, 30, 60, 60);
    fill("#000");
    textFont(font);
    textSize(20);
    text("$10", 730, 107)


    if(flowersUnlocked) {
        fill("#fff");
        buyFlowerButton = button(695, 125, 70, 90);
        image(flowerImage, 700, 130, 60, 60);
        fill("#000");
        textFont(font);
        textSize(20);
        text("$50", 730, 207);
    }

    cashMeter.innerHTML = "$" + currentCash;

    textAlign(LEFT);

    if((flowersBought > 0 || grassBought > 0)&& firstTime) {
        fill("#000");
        textFont(font);
        textSize(20);
        text("Click anywhere in the green area to plant.\nThey will generate cash over time.\nNew plants will unlock when you have enough cash!", 20, 330);
    }

    if((flowersBought == 0 && grassBought == 0)&& firstTime) {
        fill("#000");
        textFont(font);
        textSize(20);
        text("Click to buy a plant →", 480, 110);
    }

    textAlign(CENTER);

    if(flowersBought > 0) {
        fill("#fff");
        circle(765, 125, 25)
        fill("#000");
        textFont(font);
        textSize(15);
        text(flowersBought, 765, 130);
    }

    if(grassBought > 0) {
        fill("#fff");
        circle(765, 25, 25)
        fill("#000");
        textFont(font);
        textSize(15);
        text(grassBought, 765, 30);
    }
    if(flowersUnlocked) {
        if(buyFlowerButton) {
            if(currentCash >= 50) {
                currentCash -= 50;
                flowersBought += 1;
            }
        }
    }

    if(buyGrassButton) {
        if(currentCash >= 10) {
            currentCash -= 10;
            grassBought += 1;
        }
    }

    if(currentCash >= 100) {
        flowersUnlocked = true;
    }

    if(saveButton) {
        saveGame();
    }

    if(loadButton) {
        loadGame();
    }

    uiupd();
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
    if(mouseY > 300 && mouseY < 400 && mouseX > 0 && mouseX < 800) {
        if(flowersBought > 0) {
            createFlower();
            flowersBought -= 1;
            firstTime = false;
        }
        else if(grassBought > 0) {
            createGrass();
            grassBought -= 1;
            firstTime = false;
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

function drawGrass(x, y, g, o) {
    fill("#4A8437");
    beginShape();
    if (o === 1) {
        vertex(x + (2.5 * g), y);             
        vertex(x + (2.5 * g), y - (15 * g));   
        vertex(x + (5 * g), y - (25 * g));     
        vertex(x - (2.5 * g), y - (15 * g));   
        vertex(x - (2.5 * g), y);             
    } else {
        vertex(x - (2.5 * g), y);             
        vertex(x - (2.5 * g), y - (15 * g));
        vertex(x - (5 * g), y - (25 * g));
        vertex(x + (2.5 * g), y - (15 * g));
        vertex(x + (2.5 * g), y);
    }
    endShape(CLOSE);
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

function createGrass() {
    const g = grass.length == maxGrass && grass.shift() || new Grass;
    grass.push(g.setXY(mouseX, mouseY));
}

function createCashIndicator(x, y, z, o) {
    const c = cashIndicators.length == 100000 && cashIndicators.shift() || new CashIndicator;
    cashIndicators.push(c.setXYCash(x, y, z, o));
}

class Flower {
    static get DIAM() { return 50; }
    constructor(x, y) { this.setXYRGBT(x, y, this.r, this.g, this.b, this.time); }
    
    setXYRGBT(x, y, r, g, b, t) {
        this.x = x, this.y = y, this.r = r, this.g = g, this.b = b, this.time = t;
        this.growth = 0;
        this.cashTime = 0;
        return this;
    }
    display() { 
        fill(soilColor);
        ellipse(this.x, this.y, 20, 10);
        this.time += 1;
        this.time = max(0, min(this.time, 100));
        this.cashTime += 1;
        fill("#000");
        textFont(font);
        textSize(20);
        if(this.cashTime % 1000 == 0) {
            currentCash += 5;
            createCashIndicator(this.x, this.y, 5, 50);
        }
        this.growth = easeOutBack(this.time, 0, 30, 100);
        line(this.x, this.y, this.x, this.y-(this.growth));
        drawFlower(this.x, this.y-(this.growth), (this.growth), this.r, this.g, this.b);
    }
}

class Grass {
    static get DIAM() { return 50; }
    constructor(x, y) { this.setXY(x, y); }
    setXY(x, y) { this.x = x, this.y = y; 
        this.time = 0;
        this.cashTime = 0;
        this.orientation = random([0, 1]);
        return this;
    }
    display() {
        this.time += 1;
        this.cashTime += 1;
        if(this.cashTime % 1000 == 0) {
            currentCash += 1;
            createCashIndicator(this.x, this.y, 1, 25);
        }
        this.time = max(0, min(this.time, 100));
        this.growth = easeOutBack(this.time, 0, 1, 100);
        drawGrass(this.x, this.y, (this.growth), this.orientation);
    }
}

class CashIndicator {
    constructor(x, y) { this.setXYCash(x, y, this.c); }
    setXYCash(x, y, c, o) { 
        this.x = x, 
        this.y = y; 
        this.c = c;
        this.offset = o; 
        this.time = 0;
        return this;}
    display() { 
        this.time += 1;
        if (this.time > 100) {
            // Find the index of this instance in the cashIndicators array
            const index = cashIndicators.indexOf(this);
            if (index !== -1) {
                // Remove this instance from the array
                cashIndicators.splice(index, 1);
            }
            return;
        }
        this.alpha = 255 - easeOutSine(this.time, 0, 255, 100);
        this.textColor = color(0, 0, 0, this.alpha);
        fill(this.textColor);
        textFont(font);
        textSize(20);
        text("+ $" + this.c, this.x, this.y-(this.offset+easeOutSine(this.time, 0, 30, 100)));
        this.textColor.setAlpha(easeOutSine(this.time, 255, 0, 100));
    }
}