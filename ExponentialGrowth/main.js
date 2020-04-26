let id = 0
const debugMode = {
    displayRadii: false
};

let seperationDistance = 10;
let maximumCapacity = 20;
let virusFramesTillPassover = 60;


function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function distanceBetweenPeople(p1, p2) {
    return distance(p1.x, p1.y, p2.x, p2.y);
}
function normalize(x1, x2) {
    return {
        x: x1 / (distance(0, 0, x1, x2)),
        y: x2 / (distance(0, 0, x1, x2))
    }
}


class Person {

    constructor() {
        this.id = id;
        id += 1;
        this.speed = 0.7;
        this.x = 25;
        this.y = 25;
        this.size = 1;
        this.radius = 7;
        this.vX = 1;
        this.vY = 1;

        this.color = "#000000"

        this.nearby = [];
        this.infected = false;
        this.viralPassoverTimer = 0;
        this.age = 50;
        this.extraversion = 0.5;
        this.immunity = 0.5;
        this.stability = 0.5;
    }

    normalizeDirection() {
        this.vX = normalize(this.vX, this.vY).x;
        this.vY = normalize(this.vX, this.vY).y;
    }

    update() {

        this.getNearby();
        this.extraversionMeasure();
        this.minimumSeperation();
        
        this.maintainWithinGameField();
        this.normalizeDirection();
        this.x += this.vX * this.speed;
        this.y += this.vY * this.speed;

        if(this.infected){
            this.viralPassoverTimer++;
            if(this.viralPassoverTimer>virusFramesTillPassover){
                if(this.nearby.length > 0){
                    for (const p of this.nearby) {
                        if(p.infected){
                            continue;
                        }
                        else{
                            p.infected = true;
                            this.viralPassoverTimer=0;
                            break;
                        }
                    }
                }

            }
        }

    }


    draw(ctx) {
        ctx.beginPath();
        ctx.lineTo(this.x, this.y);
        ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 360);
        ctx.closePath();
        ctx.fillStyle = this.color;
        if(this.infected){
            ctx.fillStyle = "#FF6347"
        }
        ctx.fill();

        if (debugMode.displayRadii) {
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 360);
            ctx.closePath();
            ctx.stroke();
        }

        return ctx;
    }

    getNearby() {
        let arr = []
        for (const p of personList) {
            if (p.id == this.id) {
                continue;
            }
            if (distanceBetweenPeople(this, p) < this.radius) {
                arr.push(p);
            }
        }
        this.nearby = arr;
    }

    // Behaviours:
    maintainWithinGameField() {
        if (this.x < 50) { this.vX += 3 };
        if (this.x > 590) { this.vX -= 3 };
        if (this.y < 50) { this.vY += 3 };
        if (this.y > 590) { this.vY -= 3 };
    }

    minimumSeperation() {
        for (const p of this.nearby) {
            if (distanceBetweenPeople(this, p) < seperationDistance) {
                let n = normalize(this.x - p.x, this.y - p.y);
                this.vX += n.x * 0.05;
                this.vY += n.y * 0.05;
            }

        }
    }

    extraversionMeasure() {
        let capacity = this.extraversion*maximumCapacity;
        if(this.nearby.length > 0 && this.nearby.length < capacity&&!this.infected){
            let avgX = 0;
            let avgY = 0;
            for (const p of this.nearby) {
                avgX += p.x;
                avgY += p.y;

            }
            avgX = avgX/this.nearby.length;
            avgX = avgX-this.x;
            avgY = avgY/this.nearby.length;
            avgY = avgY-this.y;
            let n = normalize(avgX,avgY);
            this.vX += avgX*0.1;
            this.vY += avgY *0.1;
        }
    }

}


let personList = [new Person()];
let p2 = new Person();
p2.x = 50;
p2.y = 50;
p2.vX = -1;
p2.vY = -1;

personList.push(p2);
function draw() {
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");



    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
    for (const p of personList) {
        ctx = p.draw(ctx);
    }

}

function update() {
    for (const p of personList) {
        p.update();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function gameLoop() {
    let repetition = 10000
    const msPerFrame = 1000 / 24;
    while (repetition > 0) {

        let startTime = new Date().getTime();

        update();
        draw();

        let endTime = new Date().getTime();
        let elapsedTime = endTime - startTime;
        await sleep(msPerFrame - elapsedTime);

    }
}

function initializeGameState() {
    personList = [];
    seperationDistance = 20;
    for (let i = 0; i < 2000; i++) {
        let p = new Person();
        p.x = Math.random() * 640;
        p.y = Math.random() * 640;
        p.vX = Math.random() * 2 - 1;
        p.vY = Math.random() * 2 - 1;
        p.extraversion = Math.random();
        personList.push(p);
    }
    personList[0].infected = true;
}

initializeGameState()
gameLoop();