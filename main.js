console.log('working');

// mutable variables
let gnomeInterval;
let bpm = 50;
let counter = 0;

// arrach dom elements
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const bpmELm = document.getElementById('bpm');
const counterElm = document.getElementById('counter');
const repsElm = document.getElementById('reps');
const resetCounterButton = document.getElementById('resetCounterButton');
const audioElm = document.getElementById('lo');
const audioElmStress = document.getElementById('hi');
const historyElm = document.getElementById('history');
const increaseBPMByTenButton = document.getElementById('increaseBPMByTen');
const increaseBPMButton = document.getElementById('increaseBPM');
const decreaseBPMButton = document.getElementById('decreaseBPM');
const decreaseBPMByTenButton = document.getElementById('decreaseBPMByTen');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const checkboxElm = document.getElementById('checkbox');
const hiIndicatorElm = document.getElementById('hiIndicator');
const loIndicatorElm = document.getElementById('loIndicator');

// start the metronome
function playGnome() {
    if (gnomeInterval) {
        return;
    }
    const interval = 60 / bpm * 1000;
    gnomeInterval = setInterval(() => {
        if (checkboxElm.checked && counter % 2 === 0) {
            audioElmStress.play();
        } else {
            audioElm.play();
        }
        tickCounter();
        setIndicator();
    }, interval);
}

function setIndicator() {
    if (counter % 2 === 0) {
        hiIndicatorElm.innerText = '○';
        loIndicatorElm.innerText = '●';
    } else { 
        hiIndicatorElm.innerText = '●';
        loIndicatorElm.innerText = '○';
    }
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
    const reps = Math.floor(counter / 2);
    repsElm.innerText = reps;
}

// increment BPM
function setBPM(value) {
    bpm = value;
    bpmELm.innerText = bpm;
    if (gnomeInterval) {
        clearInterval(gnomeInterval);
        gnomeInterval = null;
        playGnome();
    }
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
increaseBPMByTenButton.addEventListener('click', () => setBPM(bpm + 10));
increaseBPMButton.addEventListener('click', () => setBPM(bpm + 1));
decreaseBPMButton.addEventListener('click', () => setBPM(bpm - 1));
decreaseBPMByTenButton.addEventListener('click', () => setBPM(bpm - 10));
clearHistoryButton.addEventListener('click', clearHistory);
