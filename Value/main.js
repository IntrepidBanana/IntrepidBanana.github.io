const frameRate = 60;
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let width = canvas.width;
let height = canvas.height;
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
let themeSwitchInProgress = false;
let theme = {
    type: 'light',
    t: 0,
    maxTime: 5000,
    color:{
        r:255,
        g:255,
        b:255
    },
    swaps:0
}
theme.t = theme.maxTime
let darkTheme = true;
let wiggleIntensity = 75;
let wiggleTime = 0;
let wigglePeriod = 800;
let drawRequest = true;
let pause = false;
let gridSize = 5
// gridSize = 8
let oldSize = 0;
let tileHeight = height/10
let grid = []

canvas.width = 0
let needToUpdateVisuals = true;
noise.seed(Math.random());
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
            grid[x][y].offset =
                amplitude * Math.sin(
                    (t * 2 * Math.PI / (wigglePeriod)) + p.z
                )
        }
    }
    drawRequest = true;
}
function resolveGridWave(t) {
    updateGridWave(wiggleIntensity, t);

}

function resize(){
    grid = createGrid(gridSize, width*0.4 / gridSize);
    console.log("yo")

}


function draw(t) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    if(width !== canvas.width){
        resize();
    }
    // globalTileLength=canvas.width
    if (drawRequest) {

        drawRequest = false;
        width = canvas.width;
        height = canvas.height;
        if (darkTheme) {
            ctx.fillStyle = "#000000"
        }
        else {

            ctx.fillStyle = "#ffffff";
        }
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
    let r = theme.t / theme.maxTime;
    r = Math.min(r, 1);
    let color = theme.color;
    let style = `rgba(${color.r * r},${color.g * r},${color.b * r},1)`
    if (theme.type === "dark") {
        ctx.fillStyle = style;
    }
    if(theme.type ==="light"){
        r = 1-r;
        style = `rgba(${color.r * r},${color.g * r},${color.b * r},1)`
        ctx.fillStyle = style;
    }
    document.getElementsByTagName("span")[0].style.color = style;
    document.getElementsByTagName("span")[0].style.filter = "invert(1)";
    document.getElementsByTagName("span")[1].style.color = style;
    document.getElementsByTagName("span")[1].style.filter = "invert(1)";
    ctx.globalCompositeOperation = 'difference';
    // ctx.globalAlpha = r;
    theme.t += t;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1




    // console.log(needToUpdateVisuals)
    // needToUpdateVisuals = false;



}
function drawTile(ctx, tile) {
    // tile.length = globalTileLength;
    const tileVerticesInfo = getTileVertices(tile);
    const bottomFace = tileVerticesInfo.bottom;
    const topFace = tileVerticesInfo.top;
    let orthoBottom = []
    let orthoTop = []
    ctx.beginPath();
    let xShift = width / 2 - 64;
    let yShift = height / 2 + tileHeight / 4;
    let color = tile.color;
    // if(tile.height/tileHeight < 1){
    // }"

    let ov1 = orthographicTransform(bottomFace[0]);
    let ov2 = orthographicTransform(bottomFace[1]);
    let ov3 = orthographicTransform(bottomFace[2]);
    let ov4 = orthographicTransform(bottomFace[3]);

    let ov5 = orthographicTransform(topFace[0]);
    let ov6 = orthographicTransform(topFace[1]);
    let ov7 = orthographicTransform(topFace[2]);
    let ov8 = orthographicTransform(topFace[3]);


    let initH = 45;
    let coeff = 10;
    let grad1 = ctx.createLinearGradient(0, ov6.y + yShift - initH, 0, ov2.y + yShift)
    // color = grad;
    let grad2 = ctx.createLinearGradient(0, ov6.y + yShift - initH - coeff, 0, ov2.y + yShift - coeff)
    let grad3 = ctx.createLinearGradient(0, ov6.y + yShift - initH - 2 * coeff, 0, ov2.y + yShift - 2 * coeff)
    if (darkTheme) {

        grad1.addColorStop(0, "white");
        grad1.addColorStop(0.95, "black");
        grad2.addColorStop(0, "white");
        grad2.addColorStop(0.95, "black");
        grad3.addColorStop(0, "white");
        grad3.addColorStop(0.95, "black");
    } else {
        grad1.addColorStop(0, "black");
        grad1.addColorStop(0.95, "white");
        grad2.addColorStop(0, "black");
        grad2.addColorStop(0.95, "white");
        grad3.addColorStop(0, "black");
        grad3.addColorStop(0.95, "white");
    }
    // TOP FACE - > Z DOMINATE FACE -> X DOMINATE FACE

    // Top Face -> every tile will draw this
    for (let i = 0; i < bottomFace.length; i++) {
        const v = topFace[i];
        let orthoVertex = orthographicTransform(v);
        ctx.lineTo(orthoVertex.x + xShift, orthoVertex.y + yShift);
    }
    ctx.closePath();
    ctx.fillStyle = grad1;
    ctx.fill();
    ctx.strokeStyle = grad1;
    ctx.lineWidth = 1;
    ctx.stroke();


    if (tile.col === gridSize - 1 || tile.height + tile.offset > grid[tile.row][tile.col + 1].height + grid[tile.row][tile.col + 1].offset) {


        // Z dominateFace
        ctx.beginPath();
        ctx.lineTo(ov4.x + xShift, ov4.y + yShift);
        ctx.lineTo(ov8.x + xShift, ov8.y + yShift);
        ctx.lineTo(ov7.x + xShift, ov7.y + yShift);
        ctx.lineTo(ov3.x + xShift, ov3.y + yShift);
        ctx.closePath();
        // ctx.fillStyle = hexBrightnessIncrease(color, -0.5);
        ctx.fillStyle = grad2;
        ctx.strokeStyle = grad2;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
    }
    if (tile.row === gridSize - 1 || tile.height + tile.offset > grid[tile.row + 1][tile.col].height + grid[tile.row + 1][tile.col].offset) {


        //X dominateface;
        ctx.beginPath();
        ctx.lineTo(ov4.x + xShift, ov4.y + yShift);
        ctx.lineTo(ov8.x + xShift, ov8.y + yShift);
        ctx.lineTo(ov5.x + xShift, ov5.y + yShift);
        ctx.lineTo(ov1.x + xShift, ov1.y + yShift);

        ctx.closePath();
        ctx.fillStyle = grad3;
        ctx.strokeStyle = grad3;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,1)"
    // ctx.fillText(tile.row + ":" + tile.col,
    //     ov8.x + xShift-8,
    //     ov8.y + yShift-tile.length/2+4);


}
function getTileVertices(tile) {
    const l = tile.length / 2;
    const pos = tile.position;
    const h = Math.max(tile.height + tile.offset - 2 * tileHeight / 5, 0);
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
        y: pos.y - h,
        z: pos.z - l
    }
    const v6 = {
        x: pos.x - l,
        y: pos.y - h,
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
    console.log(tilePixelLength,size);
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
            let t = tile(pos, tilePixelLength, (noise.perlin2(row / size * 2, col / size * 2) + 1) * tileHeight);
            t.row = row;
            t.col = col;
            // t.height = tileHeight
            gridRow.push(t);

        }
        grid.push(gridRow);
    }
    return grid;
}

function update(t) {
    resolveGridWave(wiggleTime + t)
    wiggleTime += t;
    if(theme.t > theme.maxTime*1.5){
        switchTheme();
    }
    
}
async function gameLoop() {
    let repetition = 100
    const msPerFrame = 1000 / frameRate;
    while (repetition > 0) {

        let startTime = new Date().getTime();

        update(msPerFrame);
        draw(msPerFrame);

        let endTime = new Date().getTime();
        let elapsedTime = endTime - startTime;
        await sleep(msPerFrame - elapsedTime);

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initializeGameState() {
    document.onresize=resize;
}
function switchTheme() {
    theme.type = theme.type === 'light' ? 'dark' : 'light';
    theme.t = 0;
    if(theme.swaps%2===0){

        theme.color={
            r:Math.random()*255,
            g:Math.random()*255,
            b:Math.random()*255
        }
    }
    theme.swaps++;
}
function panRectangle() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
}
resize();
initializeGameState()
gameLoop();
