// Super light PURPLE
// #e8ebff

// LIGHT PURPLE
// #bca0dc

// MEDIUM PURPLE
// #663a82

// DARK PURPLE
// #3c1361

let c = document.getElementsByTagName("canvas")[0];
let ctx = c.getContext("2d");
let height, width;

let boids = [];
let boidNumber = 40;
let boidSize = 40

let globalFOV = 270;
let globalViewDistance = 60;

let seperationMinimum = 100;
let seperationSpeed = 2.5;

let alignmentSpeed = .125;

let cohesionSpeed = .0025;

let debug = true;
let debugNear = false;

window.onload = function () {

    ctx.canvas.width = window.innerHeight;
    ctx.canvas.height = window.innerHeight;
    height = c.height;
    width = c.width;
    this.document.getElementById("numberOfBoids").oninput = function () {
        boidNumber = document.getElementById("numberOfBoids").value;
    }
    document.getElementById("fieldOfView").oninput = function () {
        globalFOV = document.getElementById("fieldOfView").value;
    }
    this.document.getElementById("viewDistance").oninput = function () {
        globalViewDistance = document.getElementById("viewDistance").value;
    }
    this.document.getElementById("debug").onclick = function () {
        debug = document.getElementById("debug").checked;
    }
    init();
    gameLoop();
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function newBoid(i) {
    return makeBoid(i, [Math.random() * width, Math.random() * height], Math.random() * 360, 5, globalViewDistance, 220);
}

function init() {
    for (let i = 0; i < boidNumber; i++) {
        boids.push(newBoid(i));

    }
    boids[0].selected = true;
}

async function gameLoop() {
    let repetition = 10000
    const msPerFrame = 1000 / 60;
    while (repetition > 0) {

        let startTime = new Date().getTime();
        ctx.fillStyle = "#3c1361";
        ctx.fillRect(0, 0, c.height, c.width);
        if (boids.length > boidNumber) {
            boids.pop();
        }
        if (boids.length < boidNumber) {
            boids.push(newBoid(boids.length));
        }
        updateBoids();
        draw();

        let endTime = new Date().getTime();
        let elapsedTime = endTime - startTime;
        await sleep(msPerFrame - elapsedTime);

    }
}

function draw() {
    // ctx.beginPath();

    for (const boid of boids) {
        drawBoid(boid);
    }

    ctx.closePath();
}

function normalizeVector(vector = { x: 1, y: 0 }) {
    const sum = dist(0, 0, vector.x, vector.y);

    let newX = vector.x / sum;
    let newY = vector.y / sum;

    return { x: newX, y: newY };

}

function makeBoid(id = 0, initialPosition = [0, 0], initialDirection = 0, initialSpeed = 10, initialViewDistance = 75, initialFov = 270) {
    let boid = {
        id: id,
        x: initialPosition[0],
        y: initialPosition[1],
        forwardVector: {
            x: Math.cos(toRadians(initialDirection)),
            y: Math.sin(toRadians(initialDirection))
        },
        speed: initialSpeed,
        viewDistance: initialViewDistance,
        fov: initialFov,
        selected: false,
        updateForwardVector: function () {
            this.forwardVector = normalizeVector({ x: Math.cos(this.direction), y: Math.sin(this.direction) });
        },
        updateDirection: function () {
            this.direction = (Math.atan2(this.forwardVector.y, this.forwardVector.y) + 360) % 360;
        },
        addChangeInVelocity: function (dx, dy) {
            let x = this.forwardVector.x * this.speed;
            let y = this.forwardVector.y * this.speed;
            x += dx;
            y += dy;
            let v = { x: x, y: y };
            this.forwardVector = normalizeVector(v);
            // this.direction = (toDegrees(Math.atan2(y, x)) + 360)%360;
            // this.updateForwardVector();
            // this.updateDirection();
        },
        updateVelocity: function () {
            this.x += this.forwardVector.x * this.speed;
            this.y += this.forwardVector.y * this.speed;
            if (this.selected) {

                // console.log((toDegrees(Math.atan2(this.forwardVector.y,this.forwardVector.x))+360)%360,this.direction);
            }
        },
        getDirectionRadians: function () {
            return (Math.atan2(-this.forwardVector.y, -this.forwardVector.x)) + Math.PI;
        },
        getDirectionDegrees: function () {
            let deg = toDegrees(Math.atan2(this.forwardVector.y, this.forwardVector.x));
            return toDegrees(this.getDirectionRadians());
        }

    };

    return boid;
}

function updateBoid(boid) {
    boid.fov = globalFOV;
    boid.viewDistance = globalViewDistance;
    boid.updateVelocity();
    boid = keepBoidInBounds(boid);
    nearby = getNearbyBoids(boid);
    boid = aligmnentMeasure(boid, nearby);
    boid = cohesionMeasure(boid, nearby);
    boid = seperationMeasure(boid, nearby);
    return boid;

}

function dotProduct(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
}


function getNearbyBoids(boid) {
    nearby = [];
    for (const b of boids) {
        if (b.id == boid.id) {
            continue;
        }
        let d = dist(boid.x, boid.y, b.x, b.y);
        if (d < boid.viewDistance) {
        }
        else {
            continue;
        }

        let dx = b.x - boid.x, dy = b.y - boid.y;
        // MAKE THE ANGLE BETWEEN 2 VECTORS CALCULATION HERE
        let dot = dotProduct(boid.forwardVector, { x: dx, y: dy });
        let magnitude = dist(0, 0, dx, dy);
        let cosTheta = dot / magnitude;
        let theta = Math.acos(cosTheta);


        // let angle = Math.abs(dir - relDir) % 180;
        let angle = toDegrees(theta);

        if (angle <= boid.fov / 2) {
            if (debug && boid.selected) {
                // console.log(Math.floor(dir), Math.floor(relDir), Math.floor(Math.abs(dir - relDir) % 180), Math.floor(Math.abs(dir - relDir) % 180) < boid.fov/2);
                ctx.beginPath();
                ctx.moveTo(boid.x, boid.y);
                ctx.lineTo(b.x, b.y);
                ctx.closePath()
                ctx.strokeStyle = "#ffffff";
                ctx.stroke();

            }

            nearby.push(b);
        }


    }
    if (boid.selected) {
        // console.log(nearby);
    }
    return nearby;
}

function dist(myX, myY, targetX, targetY) {
    return Math.sqrt(Math.pow(myX - targetX, 2) + Math.pow(myY - targetY, 2));
}

function seperationMeasure(boid, nearby) {
    let deltax = 0, deltay = 0;
    if (debug && boid.selected&&false) {

        ctx.beginPath();
        ctx.ellipse(boid.x, boid.y, seperationMinimum, seperationMinimum, 0, 0, Math.PI * 2)
        ctx.closePath();
        ctx.stroke();
    }
    for (const b of nearby) {
        let d = dist(boid.x, boid.y, b.x, b.y);
        let deltaX = b.x - boid.x, deltaY = b.y - boid.y;
        if (d < seperationMinimum) {
            let bDist = dist(boid.x, boid.y, b.x, b.y);
            let delta = seperationMinimum - bDist;
            let theta = Math.atan2(deltaY, deltaX) + Math.PI;
            // let dx = seperationMinimum - Math.abs(deltaX);
            // let dy = seperationMinimum - Math.abs(deltaY);
            let dx = delta * Math.cos(theta);
            let dy = delta * Math.sin(theta);
            // deltax += dx*0.1;
            // deltay += dy*0.1;
            boid.addChangeInVelocity(dx * Math.pow(10, -seperationSpeed), dy * Math.pow(10, -seperationSpeed));
        }

    }
    return boid;

}

function aligmnentMeasure(boid, nearby) {
    let dx = 0, dy = 0;
    for (const b of nearby) {
        boid.addChangeInVelocity(b.forwardVector.x * alignmentSpeed, b.forwardVector.y * alignmentSpeed);
    }
    return boid;
}

function cohesionMeasure(boid, nearby) {
    let v = { x: 0, y: 0 };
    let numOfNearby = nearby.length;
    if (numOfNearby <= 0) {
        return boid;
    }
    for (const b of nearby) {
        v.x += b.x;
        v.y += b.y;
    }
    v.x = v.x / numOfNearby - boid.x;
    v.y = v.y / numOfNearby - boid.y;
    boid.addChangeInVelocity(v.x * cohesionSpeed, v.y * cohesionSpeed);
    return boid;
}

function keepBoidInBounds(boid) {
    let x = boid.x, y = boid.y;

    let c = 1.05;

    if (x < -width * .1) {
        x = width * c;
    }
    else if (x > width * c) {
        x = -width * .1;
    }

    if (y < -height * .1) {
        y = height * c;
    }
    else if (y > height * c) {
        y = -height * .1;
    }

    boid.x = x;
    boid.y = y;
    return boid;




}

function updateBoids() {
    for (let i = 0; i < boids.length; i++) {
        const boid = boids[i];
        boids[i] = updateBoid(boid);

    }
}

function toRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}
function toDegrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

function drawPolygon(polygon, centerx, centery, dir = 0, color = "#000000") {
    let ox = polygon[0][0], oy = polygon[0][1];
    ctx.beginPath();
    ctx.moveTo(ox, oy);

    for (const point of polygon) {
        let px = point[0], py = point[1];

        let newx = Math.cos(dir) * (px - centerx) - Math.sin(dir) * (py - centery) + centerx
        let newy = Math.sin(dir) * (px - centerx) + Math.cos(dir) * (py - centery) + centery
        ctx.lineTo(newx, newy);



    }
    ctx.closePath()
    ctx.fillStyle = color;
    ctx.fill();
}
function drawBoid(boid) {
    const size = boidSize;
    let x = boid.x, y = boid.y;
    let dir = boid.getDirectionDegrees();
    let color = "#663a82";
    let polygon = [
        [(x - size * 0.3), y],
        [(x) - size * 0.4, y - size * .25],
        [(x) + size * 0.3, y],
        [(x) - size * 0.4, y + size * .25],
        [(x - size * 0.3), y]
    ]
    if (boid.selected && debug) {
        color = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(boid.forwardVector.x * 100 + x, boid.forwardVector.y * 100 + y);
        ctx.closePath();
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
    }

    if (debug && boid.selected) {
        ctx.beginPath()
        ctx.lineTo(x, y);
        ctx.ellipse(x, y, boid.viewDistance, boid.viewDistance, boid.getDirectionRadians(), toRadians(boid.fov) / 2 * -1, toRadians(boid.fov) / 2);
        // ctx.arc(x, y, boid.viewDistance, toRadians(boid.direction), toRadians(boid.fov)+toRadians(boid.direction))
        ctx.closePath();
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "#e8ebff";
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    drawPolygon(polygon, boid.x, boid.y, toRadians(dir), color);

    if (debug && boid.selected) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(boid.x - 2.5, boid.y - 2.5, 5, 5);
    }





}