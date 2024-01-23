console.log('working');

// mutable variables
let gnomeInterval;
let bpm = 60;
let counter = 0;

// dom elements
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const bpmELm = document.getElementById('bpm');
const counterElm = document.getElementById('counter');
const resetCounterButton = document.getElementById('resetCounterButton');
const audioElm = document.getElementById('lo');
const audioElmStress = document.getElementById('hi');
const historyElm = document.getElementById('history');
const increaseBPMButton = document.getElementById('increaseBPM');
const decreaseBPMButton = document.getElementById('decreaseBPM');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const checkbox = document.getElementById('checkbox');

// start the metronome
function playGnome() {
    if (gnomeInterval) {
        return;
    }
    const interval = 60 / bpm * 1000;
    gnomeInterval = setInterval(() => {
        if (checkbox.checked && counter % 2 === 0) {
            audioElmStress.play();
        } else {
            audioElm.play();
        }
        tickCounter();
    }, interval);
}

// pause the metronome
function pauseGnome() {
    audioElm.pause();
    audioElmStress.pause();
    clearInterval(gnomeInterval);
    gnomeInterval = null;
}

// increment counter
function tickCounter() {
    counter = counter + 1;
    counterElm.innerText = counter;
}

// increment BPM
function incrementBPM() {
    bpm = bpm + 1;
    bpmELm.innerText = bpm;
}

// decrement BPM
function decrementBPM() {
    bpm = bpm - 1;
    bpmELm.innerText = bpm;
}

// reset counter and log history
function resetCounter() {
    logCounterHistory();
    counter = 0;
    counterElm.innerText = counter;
}

// log history
function logCounterHistory() {
    const newHistoryRecord = document.createElement('li');
    const reps = Math.floor(counter / 2);
    newHistoryRecord.innerText = `Count: ${counter} -- Reps: ${reps}`;
    historyElm.appendChild(newHistoryRecord);
}

function clearHistory() {
    historyElm.innerHTML = "";
}

// initial paint
bpmELm.innerText = bpm;

// attach listeners
playButton.addEventListener('click', playGnome);
pauseButton.addEventListener('click', pauseGnome);
resetCounterButton.addEventListener('click', resetCounter);
increaseBPMButton.addEventListener('click', incrementBPM);
decreaseBPMButton.addEventListener('click', decrementBPM);
clearHistoryButton.addEventListener('click', clearHistory);
