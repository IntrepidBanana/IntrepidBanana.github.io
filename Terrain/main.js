const frameRate = 16;
let width = 0;
let height = 0;
const debug = {
};



function tile(position, length, height) {
    const tile = {
        position: position,
        height: height,
        length: length,
        color: "#" + "00ffff",
        offset: 0
    }
    return tile;
}
let wiggleIntensity = 3;
let wiggleTime = 0;
let drawRequest = true;
let gridSize = 25
let oldSize = 0;
let tileHeight = 150
let grid = createGrid(gridSize, 640 / gridSize);
let needToUpdateVisuals = true;
noise.seed(Math.random());
let colorItems = 1000;
let rainbow = new Rainbow();
rainbow.setNumberRange(0, colorItems);
rainbow.setSpectrum("black", "darkblue", "darkblue", "darkblue", "darkblue", "darkblue", "darkblue", "darkblue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "cyan", "yellow", "yellow", "green", "green", "green", "green");
function vector(x, y, z) {
    return {
        x,
        y,
        z
    }
}
function randomHex(len) {
    var maxlen = 8,
        min = Math.pow(16, Math.min(len, maxlen) - 1)
    max = Math.pow(16, Math.min(len, maxlen)) - 1,
        n = Math.floor(Math.random() * (max - min + 1)) + min,
        r = n.toString(16);
    while (r.length < len) {
        r = r + randHex(len - maxlen);
    }
    return r;
};
function hexToRgb(hex) {

}
function RGBToHex(rgb) {
    let r = rgb.r.toString(16);
    let g = rgb.g.toString(16);
    let b = rgb.b.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}
function hexToRGB(h) {
    let r = parseInt(h[1] + h[2], 16)
    let g = parseInt(h[3] + h[4], 16)
    let b = parseInt(h[5] + h[6], 16)
    return {
        r, g, b
    }
}
function hexBrightnessIncrease(h, n) {
    let rgb = hexToRGB(h);
    rgb = {
        r: Math.floor(rgb.r * (1 + n)),
        g: Math.floor(rgb.g * (1 + n)),
        b: Math.floor(rgb.b * (1 + n))
    }
    const newHex = RGBToHex(rgb);
    return newHex;
}
function updateGridWave(amplitude, t) {
    t /= gridSize * gridSize / 2
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
            let tile = grid[x][y];
            let p = tile.position;
            grid[x][y].offset = amplitude * Math.sin(p.z * (2 * Math.PI / (gridSize * gridSize)) + t)
            // grid[x][y].offset *= amplitude * Math.sin(p.x * (2 * Math.PI / (gridSize * gridSize)) + t)+(p.x * (2 * Math.PI / (gridSize * gridSize)) + t)

        }
    }
    drawRequest = true;
}
function resolveGridWave(t) {
    updateGridWave(wiggleIntensity, t);
}

function draw() {
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    if (gridSize !== oldSize) {
        grid = createGrid(gridSize, 500 / gridSize);
        drawRequest = true;
    }
    if (drawRequest) {

        drawRequest = false;
        width = canvas.width;
        height = canvas.height;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        oldSize = gridSize;
        for (let i = 0; i < grid.length; i++) {
            const row = grid[i];
            for (let j = 0; j < row.length; j++) {
                const tile = row[j];

                drawTile(ctx, tile);

            }

        }
    }
    // console.log(needToUpdateVisuals)
    // needToUpdateVisuals = false;



}
function drawTile(ctx, tile) {

    const tileVerticesInfo = getTileVertices(tile);
    const bottomFace = tileVerticesInfo.bottom;
    const topFace = tileVerticesInfo.top;
    let orthoBottom = []
    let orthoTop = []
    ctx.beginPath();
    let xShift = width / 2 -64;
    let yShift = height / 2 + tileHeight / 4;
    let color = tile.color;
    // if(tile.height/tileHeight < 1){
    // }"
    color = "#" + rainbow.colorAt(((tile.height + tile.offset) / tileHeight).toFixed(3) * 1000)
    // TOP FACE - > Z DOMINATE FACE -> X DOMINATE FACE


    for (let i = 0; i < bottomFace.length; i++) {
        const v = topFace[i];
        let orthoVertex = orthographicTransform(v);
        ctx.lineTo(orthoVertex.x + xShift, orthoVertex.y + yShift);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();


    let ov1 = orthographicTransform(bottomFace[0]);
    let ov2 = orthographicTransform(bottomFace[1]);
    let ov3 = orthographicTransform(bottomFace[2]);
    let ov4 = orthographicTransform(bottomFace[3]);

    let ov5 = orthographicTransform(topFace[0]);
    let ov6 = orthographicTransform(topFace[1]);
    let ov7 = orthographicTransform(topFace[2]);
    let ov8 = orthographicTransform(topFace[3]);

    // Z dominateFace
    ctx.beginPath();
    ctx.lineTo(ov4.x + xShift, ov4.y + yShift);
    ctx.lineTo(ov8.x + xShift, ov8.y + yShift);
    ctx.lineTo(ov7.x + xShift, ov7.y + yShift);
    ctx.lineTo(ov3.x + xShift, ov3.y + yShift);
    ctx.closePath();
    ctx.fillStyle = hexBrightnessIncrease(color, -0.5);
    ctx.fill();

    //X dominateface;
    ctx.beginPath();
    ctx.lineTo(ov4.x + xShift, ov4.y + yShift);
    ctx.lineTo(ov8.x + xShift, ov8.y + yShift);
    ctx.lineTo(ov5.x + xShift, ov5.y + yShift);
    ctx.lineTo(ov1.x + xShift, ov1.y + yShift);

    ctx.closePath();
    ctx.fillStyle = hexBrightnessIncrease(color, -0.75);
    ctx.fill();


}
function getTileVertices(tile) {
    const l = tile.length / 2;
    const pos = tile.position;
    const h = Math.max(tile.height + tile.offset-2*tileHeight/5,0);
    let bottomFace = [];
    let topFace = [];

    const v1 = {
        x: pos.x + l,
        y: pos.y,
        z: pos.z - l
    }
    const v2 = {
        x: pos.x - l,
        y: pos.y,
        z: pos.z - l
    }
    const v3 = {
        x: pos.x - l,
        y: pos.y,
        z: pos.z + l
    }
    const v4 = {
        x: pos.x + l,
        y: pos.y,
        z: pos.z + l
    }
    const v5 = {
        x: pos.x + l,
        y: pos.y - h ,
        z: pos.z - l
    }
    const v6 = {
        x: pos.x - l,
        y: pos.y - h ,
        z: pos.z - l
    }
    const v7 = {
        x: pos.x - l,
        y: pos.y - h,
        z: pos.z + l
    }
    const v8 = {
        x: pos.x + l,
        y: pos.y - h,
        z: pos.z + l
    }
    bottomFace.push(v1, v2, v3, v4);
    topFace.push(v5, v6, v7, v8);
    return {
        bottom: bottomFace,
        top: topFace,
        all: bottomFace.concat(topFace)
    }






}
function orthographicTransform(v) {
    const ax = v.x;
    const ay = v.y;
    const az = v.z;
    const r2 = Math.sqrt(2);
    const r3 = Math.sqrt(3);
    const r6 = Math.sqrt(6);
    const bx = (r3 * ax - r3 * az) / r6;
    const by = (ax + 2 * ay + az) / r6;
    const bz = (r2 * ax - r2 * ay + r2 * az) / r6;

    return vector(bx, by, bz);
}

function createGrid(size, tilePixelLength) {
    const half = Math.floor(size / 2);
    const grid = []
    for (let row = 0; row < size; row++) {
        let gridRow = []
        for (let col = 0; col < size; col++) {

            const xi = row - half + 0.5;
            const x = xi * tilePixelLength;
            const yi = col - half + 0.5;
            const y = yi * tilePixelLength;
            let pos = vector(x + 100, 0, y);
            gridRow.push(tile(pos, tilePixelLength, (noise.perlin2(row / size * 2, col / size * 2) + 1) * tileHeight));

        }
        grid.push(gridRow);
    }
    return grid;
}

function update(t) {
    resolveGridWave(wiggleTime - t)
    wiggleTime -= t;
}
async function gameLoop() {
    let repetition = 100
    const msPerFrame = 1000 / frameRate;
    while (repetition > 0) {

        let startTime = new Date().getTime();

        update(msPerFrame);
        draw();

        let endTime = new Date().getTime();
        let elapsedTime = endTime - startTime;
        await sleep(msPerFrame - elapsedTime);

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initializeGameState() {
}

initializeGameState()
draw();
gameLoop();