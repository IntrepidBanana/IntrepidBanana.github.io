
// let l = [5,6,3,1,4,9,8,2,7,10];

// function runSimulation(speed, size){
let playSpeed = 0;
let playStepRequests = 0;
let drawQueue = []
let currentQueueIndex = -1;
let play;
let inPlay = false;
let flourishPlay;
let iq = []
let speed = 500;

function createQueueStep(l, customIndexInfo = []) {
    let QueueReadyList = {};
    for (let i = 0; i < l.length; i++) {
        const element = l[i];
        const selement = element.toString();
        const elementInfo = {
            size: element,
            // color: "#6495ed"
            color: "#ffffff"
        };


        if (Object.keys(customIndexInfo).includes(selement)) {
            elementInfo.color = customIndexInfo[selement];
        }
        QueueReadyList[i] = elementInfo;
    }
    return QueueReadyList;

}

function getBlankQueue(frame){
    let newFrame = {}
    let size = Object.keys(frame).length;
    for (let i = 0; i < size; i++) {
        newFrame[i] = {
            size:frame[i].size,
            color:"#ffffff"
        }

    }
    return newFrame;
}

function nextQueueStep() {
    if (currentQueueIndex < drawQueue.length-1) {
        currentQueueIndex++;
    }
}

function previousQueueStep() {
    if (currentQueueIndex > 0) {
        currentQueueIndex--;
    }
}

function playQueue() {
    // console.log(drawQueue.length);
    play = setTimeout(() => {
        if (currentQueueIndex < drawQueue.length) {
            const frame = drawQueue[currentQueueIndex];
            drawGrid(frame);
            nextQueueStep();
        }
        else if (currentQueueIndex >= drawQueue.length && drawQueue.length > 1){
            const lastFrame = drawQueue[currentQueueIndex-1];
            flourish(lastFrame);
            drawGrid(getBlankQueue(lastFrame));
            drawQueue = [];
            drawQueue.push(lastFrame)
            currentQueueIndex = 0;
            
        }
        playQueue();
        console.log(drawQueue.length);
    }, document.getElementById("speed").value);


    // for (let i = 0; i < drawQueue.length; i++) {

    // }
}

function clearQueue(){
    drawQueue = drawQueue.slice(0,1);
}


function flourish(l, line = 0) {
    let size = Object.keys(l).length
    if (line > size) {
        drawGrid(getBlankQueue(l));
        return;
    }
    let customInfo = {};
    flourishPlay = setTimeout(() => {
        for (let i = 0; i < size; i++) {
            const element = l[i];
            l[i].color = "#ffffff";
            if( i <= line){

                l[i].color = "#ff9900";
            }
        }
        let frame = l;
        drawGrid(frame);
        line = line + 1;
        flourish(l,line);
    }, 500/(size));
}
function bubbleSort(l) {
    for (let i = 0; i < l.length; i++) {
        let hasSwapped = false;
        for (let j = 0; j < l.length - i; j++) {
            const element = l[j];
            
            if (l[j - 1] > l[j]) {
                let temp = l[j - 1];
                l[j - 1] = l[j]
                l[j] = temp;
                hasSwapped = true;
            }
            let customInfo = {};
            customInfo[l[j]] = "#e06666";
            // customInfo[l[j-1]] = "#93c47d";
            let frame = createQueueStep(l, customInfo);
            drawQueue.push(frame);

        }
        if (!hasSwapped) {
            break;
        }

    }
    return l;
}



// https://www.guru99.com/quicksort-in-javascript.html
function swap(l, leftIndex, rightIndex) {
    var temp = l[leftIndex];
    l[leftIndex] = l[rightIndex];
    l[rightIndex] = temp;
}
 function partition(l, left, right) {
    var pivot = l[Math.floor((right + left) / 2)], //middle element
        i = left, //left pointer
        j = right; //right pointer
    while (i <= j) {
        while (l[i] < pivot) {
            i++;
        }
        while (l[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(l, i, j); //sawpping two elements
            i++;
            j--;
            let customInfo = {};
            customInfo[l[i]] = "#93c47d";
            customInfo[l[j]] = "#93c47d";
            customInfo[pivot] = "#e06666";
            let frame = createQueueStep(l, customInfo);
            drawQueue.push(frame);

        }
    }
    return i;
}

function quickSort(l, left = -1, right = -1) {
    if (left === -1 || right === -1) {
        left = 0;
        right = l.length - 1;
    }
    var index;
    if (l.length > 1) {
        index = partition(l, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(l, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(l, index, right);
        }
    }
    return l;
}






function randomList(size) {
    let myList = [];
    while (myList.length < size) {
        let r = getRandomInt(size) + 1
        if (myList.includes(r)) {
            continue;
        }
        myList.push(r);
    }
    return myList
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
async function doSort(list) {
    switch (getCurrentMethod()) {
        case "bubbleSort":
            bubbleSort(list);
            break;
        case "quickSort":
            quickSort(list);

        default:
            break;
    }
};

function setMethod(id) {
    ["btn1", "btn2", "btn3"].forEach(element => {
        document.getElementById(element).classList.remove("selected");
    });
    document.getElementById(id).classList.add("selected");

};

function getCurrentMethod() {
    var val = "bubbleSort";
    ["btn1", "btn2", "btn3"].forEach(element => {
        if (document.getElementById(element).classList.contains("selected")) {
            switch (element) {
                case "btn1":
                    val = "bubbleSort";
                    break;
                case "btn2":
                    val = "quickSort";
                    break;
                case "btn3":
                    val = "mergeSort";
                    break;
            }
        }

    });
    return val;
}

let mainList = randomList(10);







var runClick = function () {
    // clearTimeout(delayedDrawExecution);
    iq = [];
    currentQueueIndex = 0;
    clearQueue();
    // clearTimeout(play);
    // clearTimeout(flourishPlay);
    let s = document.getElementById("size").value;
    mainList = randomList(s);
    // quickSort(mainList);
    // drawQueue.push(createQueueStep(new Array(s)));
    // drawQueue.push(createQueueStep(new Array(s)));
    // drawQueue.push(createQueueStep(new Array(s)));
    // drawQueue.push(createQueueStep(new Array(s)));
    // drawQueue.push(createQueueStep(new Array(s)));
    
    doSort(mainList);
    console.log(mainList);
    drawGrid(createQueueStep(mainList));
    console.log(drawQueue);
    console.log(createQueueStep(mainList));
    console.log(getCurrentMethod());
};

function init() {
    document.getElementById("run").onclick = runClick;
    document.getElementById("shuffle").onclick = shuffle;
    const buttons = document.getElementsByClassName("selectBtn");
    for (let i = 0; i < buttons.length; i++) {
        const element = buttons[i];
        let id = element.id;
        let idMethod = id.slice(-1);
        element.onclick = function () {
            setMethod(id);
        }
    }
    let s = document.getElementById("size").value;
    drawQueue.push(createQueueStep(new Array(s)));

}
window.onload = function () {
    init();
    runClick();
    playQueue();
};



function drawGrid(l) {
    const c = document.getElementById("mainCanvas");
    const ctx = c.getContext("2d");
    ctx.canvas.width = window.innerHeight;
    ctx.canvas.height = window.innerHeight;
    const height = c.height;
    const width = c.width - 2;
    const size = Object.keys(l).length;
    const heightQuotient = (height / size);
    const widthQuotient = (width / size);
    ctx.beginPath();
    ctx.fillStyle = "#6495ed";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < size; i++) {
        const element = l[i];
        ctx.fillStyle = element.color;
        ctx.fillRect(i * widthQuotient, height, widthQuotient, -element.size * heightQuotient);
        ctx.fillRect(i * widthQuotient + 0.5, height, widthQuotient + 0.5, -element.size * heightQuotient);
    };
    ctx.closePath();
}