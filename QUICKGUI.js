const frameRate = 60;
const debug = {
};
function draw() {
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
 

}
function update() {
}
async function gameLoop() {
    let repetition = 10000
    const msPerFrame = 1000 / frameRate;
    while (repetition > 0) {

        let startTime = new Date().getTime();

        update();
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
gameLoop();