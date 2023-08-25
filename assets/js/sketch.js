const maxFlowers = 1000;
const maxGrass = 1000;
const maxTrees = 1000;
const maxFruit = 200;
let flowers = [];
let grass = [];
let trees = [];
let apples = [];
let cashIndicators = [];


let prestigeMultiplier = 1;


let farmType = "spring";

let ALLDATA = {};

let flowersUnlocked = false;
let treesUnlocked = false;
let prestigeUnlocked = false;

let prestigeAmount = 10;

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

const springSkyColor = "#82e4ff";
const springGroundColor = "#75b560";
const springSunColor = "#fffa73";
const springSoilColor = "#786c4f";
const springLeafColor = "#FEDDFF";
const springGrassColor = "#4A8437";
const springTitle = "Spring Garden";

const summerSkyColor = "#46b7ff";
const summerGroundColor = "#4A8437";
const summerSunColor = "#fffa73";
const summerSoilColor = "#786c4f";
const summerLeafColor = "#75b560";
const summerGrassColor = "#75b560";
const summerTitle = "Summer Garden";

const autumnSkyColor = "#2595DD";
const autumnGroundColor = "#BC8823";
const autumnSunColor = "#fffa73";
const autumnSoilColor = "#786c4f";
const autumnLeafColor = "#BC8823";
const autumnGrassColor = "#ECAD32";
const autumnTitle = "Autumn Garden";

const winterSkyColor = "#f3f3f3";
const winterGroundColor = "#DBFBFF";
const winterSunColor = "#ffffff";
const winterSoilColor = "#ffffff";
const winterLeafColor = "#224A14";
const winterGrassColor = "#224A14";
const winterTitle = "Winter Garden";


let skyColor = springSkyColor;
let groundColor = springGroundColor;
let sunColor = springSunColor;
let soilColor = springSoilColor;
let leafColor = springLeafColor;
let grassColor = springGrassColor;
let titleText = springTitle;
let bodyColor = "#fff";

let sunPosX = 0;

let flowersBought = 0;
let grassBought = 0;
let treesBought = 0;
let currentCash = 60;

let header = document.getElementById("title");
let pageTitle = document.getElementById("pageTitle");
let cashMeter = document.getElementById("cash");

let firstTime = true;

let time = 1;

function saveGame() {
    ALLDATA = {
        farmType: farmType,
        flowers: flowers,
        grass: grass,
        trees: trees,
        apples: apples,
        cashIndicators: cashIndicators,
        flowersUnlocked: flowersUnlocked,
        treesUnlocked: treesUnlocked,
        prestigeUnlocked: prestigeUnlocked,
        prestigeMultiplier: prestigeMultiplier,
        prestigeAmount: prestigeAmount,
        flowersBought: flowersBought,
        treesBought: treesBought,
        grassBought: grassBought,
        currentCash: currentCash,
        firstTime: firstTime,
        time: time
    }
    save(ALLDATA, "save.json");
}

function loadGame() {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", "text/json");
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        parseFile(fileList[0]);
    });
    fileSelector.click();
}


function parseFile(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const result = event.target.result;
        ALLDATA = JSON.parse(result);
        farmType = ALLDATA.farmType;
        flowers = [];
        for(f in ALLDATA.flowers) {
            flowers.push(new Flower(ALLDATA.flowers[f].x, ALLDATA.flowers[f].y).setXYRGBT(ALLDATA.flowers[f].x, ALLDATA.flowers[f].y, ALLDATA.flowers[f].r, ALLDATA.flowers[f].g, ALLDATA.flowers[f].b, ALLDATA.flowers[f].time));
        }
        grass = [];
        for(g in ALLDATA.grass) {
            grass.push(new Grass(ALLDATA.grass[g].x, ALLDATA.grass[g].y).setXY(ALLDATA.grass[g].x, ALLDATA.grass[g].y));
        }
        trees = [];
        for(t in ALLDATA.trees) {
            trees.push(new Tree(ALLDATA.trees[t].x, ALLDATA.trees[t].y).setXY(ALLDATA.trees[t].x, ALLDATA.trees[t].y, 1000));
        }
        apples = [];
        cashIndicators = [];
        for(c in ALLDATA.cashIndicators) {
            cashIndicators.push(new CashIndicator(ALLDATA.cashIndicators[c].x, ALLDATA.cashIndicators[c].y).setXYCash(ALLDATA.cashIndicators[c].x, ALLDATA.cashIndicators[c].y, ALLDATA.cashIndicators[c].c, ALLDATA.cashIndicators[c].offset));
        }
        flowersUnlocked = ALLDATA.flowersUnlocked;
        treesUnlocked = ALLDATA.treesUnlocked;
        prestigeUnlocked = ALLDATA.prestigeUnlocked;
        prestigeMultiplier = ALLDATA.prestigeMultiplier;
        prestigeAmount = ALLDATA.prestigeAmount;
        flowersBought = ALLDATA.flowersBought;
        treesBought = ALLDATA.treesBought;
        grassBought = ALLDATA.grassBought;
        currentCash = ALLDATA.currentCash;
        firstTime = ALLDATA.firstTime;
        time = ALLDATA.time;
    });
    reader.readAsText(file);
}

function preload() {
    //Spring sprites
    grassImage = loadImage("assets/sprites/grassPurchase.png");
    flowerImage = loadImage("assets/sprites/flowerPurchase.png");   
    cherryTreeImage = loadImage("assets/sprites/cherryTreePurchase.png");

    //Summer sprites
    carrotImage = loadImage("assets/sprites/carrotPurchase.png");
    cornImage = loadImage("assets/sprites/cornPurchase.png");
    orangeTreeImage = loadImage("assets/sprites/orangeTreePurchase.png");

    //Autumn sprites
    shroomImage = loadImage("assets/sprites/shroomPurchase.png");
    pumpkinImage = loadImage("assets/sprites/pumpkinPurchase.png");
    appleTreeImage = loadImage("assets/sprites/appleTreePurchase.png");

    //Winter sprites
    presentImage = loadImage("assets/sprites/presentPurchase.png");
    snowmanImage = loadImage("assets/sprites/snowmanPurchase.png");
    xmasImage = loadImage("assets/sprites/xmasTreePurchase.png");

    //Other sprites
    unknownImage = loadImage("assets/sprites/unknownPurchase.png");

    //Sound effects
    tapSound = loadSound("assets/audio/tap.wav");
    failSound = loadSound("assets/audio/fail.wav");
    cashSound = loadSound("assets/audio/coin.wav");
    levelUpSound = loadSound("assets/audio/levelUp.wav");
    plantSound = loadSound("assets/audio/plant.wav");

    //Fonts
    font = loadFont("assets/fonts/ceraProMedium.otf");
}

function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent("game");
    frameRate(165);
    cashSound.setVolume(0.5);
}

function draw() {
    if(farmType == "spring") {
        skyColor = springSkyColor;
        groundColor = springGroundColor;
        sunColor = springSunColor;
        soilColor = springSoilColor;
        leafColor = springLeafColor;
        grassColor = springGrassColor;
        titleText = springTitle;
        titleColor = springSkyColor;
        bodyColor = "#fff";
    }
    else if(farmType == "summer") {
        skyColor = summerSkyColor;
        groundColor = summerGroundColor;
        sunColor = summerSunColor;
        soilColor = summerSoilColor;
        leafColor = summerLeafColor;
        grassColor = summerGrassColor;
        titleText = summerTitle;
        titleColor = summerSkyColor;
        bodyColor = "#fff";
    }
    else if(farmType == "autumn") {
        skyColor = autumnSkyColor;
        groundColor = autumnGroundColor;
        sunColor = autumnSunColor;
        soilColor = autumnSoilColor;
        leafColor = autumnLeafColor;
        grassColor = autumnGrassColor;
        titleText = autumnTitle;
        titleColor = autumnGroundColor;
        bodyColor = "#fff";
    }
    else if(farmType == "winter") {
        skyColor = winterSkyColor;
        groundColor = winterGroundColor;
        sunColor = winterSunColor;
        soilColor = winterSoilColor;
        leafColor = winterLeafColor;
        grassColor = winterGrassColor;
        titleText = winterTitle;
        titleColor = winterGroundColor;
        bodyColor = "#fff";
    }

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

    for (let t of trees) {
        t.display();
    }

    for (let a of apples) {
        a.display();
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
    if(farmType == "spring") { image(grassImage, 700, 30, 60, 60); }
    else if(farmType == "summer") { image(carrotImage, 700, 30, 60, 60); }
    else if(farmType == "autumn") { image(shroomImage, 700, 30, 60, 60); }
    else if(farmType == "winter") { image(presentImage, 700, 30, 60, 60); }
    fill("#000");
    textFont(font);
    textSize(20);
    price = Math.trunc(10 * prestigeMultiplier * 1.25);
        if(price >= 1000000) {
            price = (price / 1000000).toFixed(1) + "M";
        }
        else if(price >= 10000) {
            price = Math.trunc(price / 1000) + "K";
        }
    text("$" + price, 730, 107)


    if(flowersUnlocked) {
        fill("#fff");
        buyFlowerButton = button(695, 125, 70, 90);
        fill("#000");
        textFont(font);
        textSize(20);
        price = Math.trunc(50 * prestigeMultiplier * 1.25);
        if(price >= 1000000) {
            price = (price / 1000000).toFixed(1) + "M";
        }
        else if(price >= 10000) {
            price = Math.trunc(price / 1000) + "K";
        }
        text("$" + price, 730, 207);
        if(farmType == "spring") { image(flowerImage, 700, 130, 60, 60); }
        else if(farmType == "summer") { image(cornImage, 700, 130, 60, 60); }
        else if(farmType == "autumn") { image(pumpkinImage, 700, 130, 60, 60); }
        else if(farmType == "winter") { image(snowmanImage, 700, 130, 60, 60); }
    }
    else{
        fill("#aaaaaaaa");
        rect(695, 125, 70, 90, 5);
        image(unknownImage, 700, 130, 60, 60);
        fill("#000");
        textFont(font);
        textSize(20);
        price = Math.trunc(50 * prestigeMultiplier * 1.25);
        if(price >= 1000000) {
            price = (price / 1000000).toFixed(1) + "M";
        }
        else if(price >= 10000) {
            price = Math.trunc(price / 1000) + "K";
        }
        text("$" + price, 730, 207);
    }

    if(treesUnlocked) {
        fill("#fff");
        buyTreeButton = button(695, 225, 70, 90);
        fill("#000");
        textFont(font);
        textSize(20);
        price = Math.trunc(500 * prestigeMultiplier * 1.25);
        if(price >= 1000000) {
            price = (price / 1000000).toFixed(1) + "M";
        }
        else if(price >= 10000) {
            price = Math.trunc(price / 1000) + "K";
        }
        text("$" + price, 730, 307);
        if(farmType == "spring") { image(cherryTreeImage, 700, 230, 60, 60); }
        else if(farmType == "summer") { image(orangeTreeImage, 700, 230, 60, 60); }
        else if(farmType == "autumn") { image(appleTreeImage, 700, 230, 60, 60); }
        else if(farmType == "winter") { image(xmasImage, 700, 230, 60, 60); }
    }
    else{
        fill("#aaaaaaaa");
        rect(695, 225, 70, 90, 5);
        image(unknownImage, 700, 230, 60, 60);
        fill("#000");
        textFont(font);
        textSize(20);
        price = Math.trunc(500 * prestigeMultiplier * 1.25);
        if(price >= 1000000) {
            price = (price / 1000000).toFixed(1) + "M";
        }
        else if(price >= 10000) {
            price = Math.trunc(price / 1000) + "K";
        }
        text("$" + price, 730, 307);
    }

    if(prestigeUnlocked) {
        fill("#fff");
        prestigeButton = button(695, 325, 70, 70);
        fill("#000");
        textFont(font);
        textSize(15);
        text("Upgrade\nGarden", 730, 347);
        textSize(20);
        price = Math.trunc(prestigeAmount) * 1000;
        if(price >= 1000000) {
            price = (price / 1000000).toFixed(1) + "M";
        }
        else if(price >= 10000) {
            price = Math.trunc(price / 1000) + "K";
        }
        text("$" + price, 730, 387);
    }
    else{
        fill("#aaaaaaaa");
        rect(695, 325, 70, 30, 5);
        fill("#000");
        textFont(font);
        textSize(20);
        price = Math.trunc(prestigeAmount) * 1000;
        if(price >= 1000000) {
            price = (price / 1000000).toFixed(1) + "M";
        }
        else if(price >= 10000) {
            price = Math.trunc(price / 1000) + "K";
        }
        text("$" + price, 730, 347);
    }

    header.innerHTML = titleText;
    header.style.color = titleColor;
    pageTitle.innerHTML = titleText;
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
        text("Click to buy a plant →", 480, 100);
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

    if(treesBought > 0) {
        fill("#fff");
        circle(765, 225, 25)
        fill("#000");
        textFont(font);
        textSize(15);
        text(treesBought, 765, 230);
    }

    if(flowersUnlocked) {
        if(buyFlowerButton) {
            if(currentCash >= Math.trunc(50 * prestigeMultiplier * 1.25)) {
                currentCash -= Math.trunc(50 * prestigeMultiplier * 1.25);
                flowersBought += 1;
                tapSound.play();
            }
            else {
                failSound.play();
            }
        }
    }

    if(treesUnlocked) {
        if(buyTreeButton) {
            if(currentCash >= Math.trunc(500 * prestigeMultiplier * 1.25)) {
                currentCash -= Math.trunc(500 * prestigeMultiplier * 1.25);
                treesBought += 1;
                tapSound.play();
            }
            else {
                failSound.play();
            }
        }
    }

    if(buyGrassButton) {
        if(currentCash >= Math.trunc(10 * prestigeMultiplier * 1.25)) {
            currentCash -= Math.trunc(10 * prestigeMultiplier * 1.25);
            grassBought += 1;
            tapSound.play();
        }
        else {
            failSound.play();
        }
    }

    if(prestigeUnlocked){
        if(prestigeButton) {
            if(currentCash >= Math.trunc(prestigeAmount) * 1000) {
                currentCash -= Math.trunc(prestigeAmount) * 1000;
                prestigeMultiplier *= 2;
                prestigeAmount *= 2.5;
                flowersBought = 0;
                grassBought = 0;
                treesBought = 0;
                flowersUnlocked = false;
                treesUnlocked = false;
                prestigeUnlocked = false;
                flowers = [];
                grass = [];
                trees = [];
                apples = [];
                cashIndicators = [];
                currentCash = Math.trunc(10 * prestigeMultiplier * 1.25) * 4;
                time = 1;
                sunPosX = 0;
                if(farmType == "spring") {
                    farmType = "summer";
                }
                else if(farmType == "summer") {
                    farmType = "autumn";
                }
                else if(farmType == "autumn") {
                    farmType = "winter";
                }
                else if(farmType == "winter") {
                    farmType = "spring";
                }
                tapSound.play();
                levelUpSound.play();
            }
            else {
                failSound.play();
            }
        }
    }

    if(currentCash >= Math.trunc(50 * prestigeMultiplier * 1.25)) {
        flowersUnlocked = true;
    }

    if(currentCash >= Math.trunc(500 * prestigeMultiplier * 1.25)) {
        treesUnlocked = true;
    }

    if(currentCash >= Math.trunc(prestigeAmount) * 1000) {
        prestigeUnlocked = true;
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
            plantSound.play();
        }
        else if(grassBought > 0) {
            createGrass();
            grassBought -= 1;
            firstTime = false;
            plantSound.play();
        }
        else if(treesBought > 0) {
            createTree();
            treesBought -= 1;
            firstTime = false;
            plantSound.play();
        }
    }
    for (let a of apples) {
        if (dist(mouseX, mouseY, a.x, a.y) < 10) {
            const index = apples.indexOf(a);
            if (index !== -1) {
                apples.splice(index, 1);
                currentCash += 50 * prestigeMultiplier;
                createCashIndicator(a.x, a.y, 50 * prestigeMultiplier, 10);
            }
        }
    }

}

function touchEnded() {
    if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) 
         {
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
            else if(treesBought > 0) {
                createTree();
                treesBought -= 1;
                firstTime = false;
            }
        }
        for (let a of apples) {
            if (dist(mouseX, mouseY, a.x, a.y) < 20) {
                const index = apples.indexOf(a);
                if (index !== -1) {
                    apples.splice(index, 1);
                    currentCash += 50 * prestigeMultiplier;
                    createCashIndicator(a.x, a.y, 50 * prestigeMultiplier, 10);
                }
            }
        }
    }
}

function drawFlower(x, y, size, r, g, b) {
    let petalSize = size / 2;
    let spacing = petalSize / 2;
    if(farmType == "spring") {
        fill(r, g, b);
        circle(x - spacing, y - spacing, petalSize);
        circle(x + spacing, y - spacing, petalSize);
        circle(x - spacing, y + spacing, petalSize);
        circle(x + spacing, y + spacing, petalSize);
        fill("#fffa73");
        circle(x, y, petalSize);
    }
    else if(farmType == "summer") {
        fill("#E7CF50")
        rectMode(CENTER);
        rect(x, y - spacing, 17.5, 35, 100);
        rectMode(CORNER);
        fill("#75B560");
        angleMode(DEGREES);
        arc(x - spacing, y + 1, 1.5 * petalSize, 1.5 * petalSize, 30, 210, PIE);
        arc(x + spacing, y + 1, 1.5 * petalSize, 1.5 * petalSize, 330, 150, PIE);
        angleMode(RADIANS);
    }
    else if(farmType == "autumn") {
        size *= 1.5;
        petalSize *= 1.5;
        spacing *= 1.5;

        fill("#75B560");
        rectMode(CENTER);
        square(x, y - size, spacing, 1);
        rectMode(CORNER);
        fill("#ECAD32")
        ellipse(x - spacing, y - petalSize, spacing*2.8, petalSize*2);
        ellipse(x + spacing, y - petalSize, spacing*2.8, petalSize*2);
        ellipse(x, y - petalSize, spacing*2, petalSize*2);
    }
    else if(farmType == "winter") {
        fill("#DBFBFF");
        circle(x, y - petalSize, size);
        circle(x, y - petalSize * 2.5, size);
        fill("#ECAD32");
        strokeWeight(3);
        line(x - spacing * 0.8, y - petalSize * 2.9, x - spacing * 0.8, y - petalSize * 3);
        line(x + spacing * 0.8, y - petalSize * 2.7, x + spacing * 0.8, y - petalSize * 2.8);
        strokeWeight(2);
        beginShape();
        vertex(x, y - petalSize * 2.7);
        vertex(x, y - petalSize * 2.2);
        vertex(x - size * 0.75, y - petalSize * 2.45);
        endShape(CLOSE);
    }
}

function drawGrass(x, y, g, o) {
    if(farmType == "spring") {
        fill(grassColor);
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
    else if(farmType == "summer") {
        fill(soilColor);
        ellipse(x, y, 30, 15);
        fill("#ECAD32");
        arc(x, y, 20 * g, 20 * g, PI, 0, PIE);
        fill("#75B560");
        arc(x - (7*g), y - (16 * g) , 7.5 * g, 15 * g, PI-5.23599, -5.23599, PIE);
        arc(x + (7*g), y - (16 * g) , 7.5 * g, 15 * g, PI+5.23599, 5.23599, PIE);
        ellipse(x, y - (18 * g), 7.5 * g, 15 * g);
    }
    else if(farmType == "winter") {
        g *= 0.75;
        fill("#C34040");
        rectMode(CENTER);
        square(x, y - (15 * g), 30 * g);
        line(x - (15 * g), y - (15 * g), x + (15 * g), y - (15 * g));
        line(x, y - (30 * g), x, y);
        fill("#ffffff00");
        arc(x - (6*g), y - (38 * g) , 11.25 * g, 22.5 * g, PI-5.23599, -5.23599, PIE);
        arc(x + (6*g), y - (38 * g) , 11.25 * g, 22.5 * g, PI+5.23599, 5.23599, PIE);
        rectMode(CORNER);
    }

}

function drawSapling(x, y, s) {
    const leafSize = s / 2;
    const spacing = leafSize / 2;
    fill(leafColor);
    rectMode(CENTER);
    square(x, y+spacing, leafSize);
    rectMode(CORNER);
    circle(x, y - (spacing*1.5), leafSize);
    circle(x - spacing, y - (spacing-3), leafSize);
    circle(x + spacing, y - (spacing-3), leafSize);
    circle(x - spacing, y + spacing, leafSize);
    circle(x + spacing, y + spacing, leafSize);
    strokeWeight(0);
    circle(x, y-3, leafSize);
    rectMode(CENTER);
    square(x, y+(spacing-1), leafSize);
    rectMode(CORNER);
    strokeWeight(2);
}

function drawTree(x, y, g, s) {
    //Trunk
    if(farmType != "winter") { fill(soilColor); }
    else { fill("#392A0C"); }
    beginShape();
    vertex(x + (20 * g), y);
    vertex(x + (14 * g), y - (100 * g));
    vertex(x + (14 * g), y - (200 * g));
    vertex(x - (14 * g), y - (200 * g));
    vertex(x - (14 * g), y - (100 * g));
    vertex(x - (20 * g), y);
    endShape(CLOSE);
    

    //Leaves
    if(farmType != "winter") { 
        fill(leafColor);
        circle(x + (15 * g), y - (155 * g), 100 * g);
        circle(x - (35 * g), y - (175 * g), 125 * g);
        circle(x + (30 * g), y - (200 * g), 100 * g);
        circle(x - (14 * g), y - (220 * g), 95 * g);
        circle(x + (14 * g), y - (165 * g), 90 * g);
        strokeWeight(0);
        circle(x - (35 * g), y - (175 * g), 75 * g);
        circle(x + (40 * g), y - (200 * g), 60 * g);
        circle(x + (15 * g), y - (135 * g), 50 * g);   
    }
    else {
        fill(leafColor);
        triangle(x + (60 * g), y - (150 * g), x - (60 * g), y - (150 * g), x, y - (230 * g));
        triangle(x + (75 * g), y - (100 * g), x - (75 * g), y - (100 * g), x, y - (200 * g));
        triangle(x + (75 * g), y - (50 * g), x - (75 * g), y - (50 * g), x, y - (150 * g));
        strokeWeight(0);
        rectMode(CENTER);
        square(x, y - (150 * g), 50 * g);
        square(x, y - (175 * g), 40 * g);
        square(x, y - (200 * g), 20 * g);
        square(x, y - (125 * g), 60 * g);
        strokeWeight(2);
        rectMode(CORNER);
        fill("#E7CF50")
        star(x, y - (230 * g), 10 * g, 25 * g, s);
    }

    strokeWeight(2);
    
}

function drawShroom(x, y, s) {
    s *= 30;
    fill("#E4E4E4");
    rectMode(CENTER);
    rect(x, y-(s/2.5), s/4, s/2);
    rectMode(CORNER);
    fill("#C34040");
    arc(x, y-(s/2), s*0.75, s*0.75, PI, 0, PIE);
}

function changeText(text, color){
    toChange = document.getElementById("title");
    toChange.innerHTML = text;
    toChange.style.color = color;
    toChange = document.getElementById("pageTitle");
    toChange.innerHTML = text;
}

function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
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

function createTree() {
    const t = trees.length == maxTrees && trees.shift() || new Tree;
    trees.push(t.setXY(mouseX, mouseY, 0));
}

function createFruit(x, y) {
    const a = apples.length == maxFruit && apples.shift() || new Fruit;
    apples.push(a.setXY(x, y));
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
        this.time += 1;
        this.time = max(0, min(this.time, 100));
        this.cashTime += 1;
        if(this.cashTime % 500 == 0) {
            currentCash += 5 * prestigeMultiplier;
            if(farmType == "spring") {createCashIndicator(this.x, this.y, 5 * prestigeMultiplier, 50);}
            else if(farmType == "summer") {createCashIndicator(this.x, this.y, 5 * prestigeMultiplier, 60);}
            else if(farmType == "autumn") {createCashIndicator(this.x, this.y, 5 * prestigeMultiplier, 50);}
            else if(farmType == "winter") {createCashIndicator(this.x, this.y, 5 * prestigeMultiplier, 50);}
            
        }
        this.growth = easeOutBack(this.time, 0, 30, 100);
        if(farmType == "spring" || farmType == "summer") {
            fill(soilColor);
            ellipse(this.x, this.y, 20, 10);
            line(this.x, this.y, this.x, this.y-(this.growth));
            drawFlower(this.x, this.y-(this.growth), (this.growth), this.r, this.g, this.b);
        }
        else if(farmType == "autumn" || farmType == "winter") {
            drawFlower(this.x, this.y, (this.growth), this.r, this.g, this.b);
        }
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
            currentCash += 1 * prestigeMultiplier;
            createCashIndicator(this.x, this.y, 1 * prestigeMultiplier, 25);
        }
        this.time = max(0, min(this.time, 100));
        this.growth = easeOutBack(this.time, 0, 1, 100);
        if(farmType == "spring" || farmType == "summer" || farmType == "winter") { drawGrass(this.x, this.y, (this.growth), this.orientation); }
        else if(farmType == "autumn") { drawShroom(this.x, this.y, (this.growth)); }
            
    }
}

class Tree {
    constructor(x, y) { this.setXY(x, y, this.cashTime); }
    setXY(x, y, t) { 
        this.x = x, this.y = y;
        this.time = 0;
        this.treeTime = 0;
        this.cashTime = t; 
        this.growth = 0;
        this.star = random([5, 6, 7, 8]);
        return this; 
    }
    display() {
        this.time += 1;
        this.time = max(0, min(this.time, 100));
        
        this.cashTime += 1;
        if(this.cashTime < 1000) {
            fill(soilColor);
            ellipse(this.x, this.y, 20, 10);
            this.growth = easeOutBack(this.time, 0, 30, 100);
            line(this.x, this.y, this.x, this.y-(this.growth));
            drawSapling(this.x, this.y-(this.growth), (this.growth));
        }
        else {
            this.treeTime += 1;
            this.cashTime += 1;
            if((this.cashTime % 2000 == 3 || this.cashTime % 2000 == 0) && farmType != "winter") {
                createFruit(this.x, this.y-200);
            }
            else if((this.cashTime % 2000 == 3 || this.cashTime % 2000 == 0) && farmType == "winter") {
                currentCash += 50 * prestigeMultiplier;
                createCashIndicator(this.x, this.y-250, 50 * prestigeMultiplier, 10);
            }
            this.treeTime = max(0, min(this.treeTime, 100));
            this.growth = easeOutBack(this.treeTime, 0, 1, 100);
            drawTree(this.x, this.y, (this.growth), this.star);
        }
    }
}

class Fruit {
    constructor(x, y) { this.setXY(x, y); }
    setXY(x, y) {
        this.yy = y;
        this.x = (x-50) + random(0, 80), 
        this.y = (y-60) + random(0, 150);
        if (this.y > this.yy){
            this.yy -= this.y + (this.yy - this.y);
        }
        else{
            this.yy -= this.y - (this.y - this.yy);
        }
        this.time = 0;
        return this; 
    }
    display() {
        this.time += 1;
        if(farmType == "spring") {
            fill("#8b2a34");
            line(this.x-10, this.y, this.x, this.y-20);
            line(this.x+10, this.y-2.5, this.x, this.y-20);
            circle(this.x-10, this.y, 10);
            circle(this.x+10, this.y-2.5, 10);
        }
        else if(farmType == "summer") {
            fill("#ECAD32");
            circle(this.x, this.y, 20);
        }
        else if(farmType == "autumn") {
            fill("#C34040");
            circle(this.x, this.y, 20);
        }
        if(this.time > 500) {
            this.y = easeInSine(this.time, this.yy, 200, 100);
        }
        if(this.time > 600) {
            createCashIndicator(this.x, this.y, 40 * prestigeMultiplier, 10);
            currentCash += 40 * prestigeMultiplier;
            const index = apples.indexOf(this);
            if (index !== -1) {
                apples.splice(index, 1);
            }
        }
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
