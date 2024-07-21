// mutable variables
let gnomeInterval;
let bpm = 50;
let counter = 0;
let setSize = 0;
let setCount = 0;

// attach dom elements
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const bpmELm = document.getElementById('bpm');
const counterElm = document.getElementById('counter');
const repsElm = document.getElementById('reps');
const resetCounterButton = document.getElementById('resetCounterButton');
const audioElm = document.getElementById('lo');
const audioElmStress = document.getElementById('hi');
const audioElmBell = document.getElementById('bell');
const historyElm = document.getElementById('history');
const increaseBPMByTenButton = document.getElementById('increaseBPMByTen');
const increaseBPMButton = document.getElementById('increaseBPM');
const decreaseBPMButton = document.getElementById('decreaseBPM');
const decreaseBPMByTenButton = document.getElementById('decreaseBPMByTen');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const checkboxElm = document.getElementById('checkbox');
const hiIndicatorElm = document.getElementById('hiIndicator');
const loIndicatorElm = document.getElementById('loIndicator');
// const setCompleteResetCheck = document.getElementById('setCompleteReset');
const setCompleteSoundCheck = document.getElementById('setCompleteSound');
const setCompletePauseCheck = document.getElementById('setCompletePause');
const setSizeInputElm = document.getElementById('setSize');
const setSizeButton = document.getElementById('setSizeButton');
const setSizeParsedElm = document.getElementById('setSizeParsed');
const setCountElm = document.getElementById('setCount');

// start the metronome
function playGnome() {
    if (gnomeInterval) {
        return;
    }
    playButton.innerText = 'Playing';
    pauseButton.innerText = 'Pause';
    const interval = 60 / bpm * 1000;
    gnomeInterval = setInterval(() => {
        tickCounter();
        setIndicator();
        if (checkboxElm.checked && counter % 2 === 0) {
            audioElmStress.play();
        } else {
            audioElm.play();
        }
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
    clearInterval(gnomeInterval);
    audioElm.pause();
    audioElmStress.pause();
    gnomeInterval = null;
    playButton.innerText = 'Play';
    pauseButton.innerText = 'Paused';
}

// increment counter
function tickCounter() {
    counter = counter + 1;
    counterElm.innerText = counter;
    const reps = Math.floor(counter / 2);
    repsElm.innerText = reps;

    setSizeParsedElm.innerText = setSize || 'None';
    if (setSize && (counter / 2) % setSize === 0) {
        // if (setCompleteResetCheck.checked) {
        //     resetCounter();
        // }
        if (setCompleteSoundCheck.checked) {
            audioElmBell.play();
        }
        if (setCompletePauseCheck.checked) {
            pauseGnome();
        }
        setCount = setCount + 1;
        setCountElm.innerText = setCount;
    }
    
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
    setCount = 0;
    counterElm.innerText = counter;
    repsElm.innerText = 0;
    setCountElm.innerText = setCount;
}

// set set size
function setSetSize() {
    setSize = Math.floor(Number(setSizeInputElm.value));
    setSizeParsedElm.innerText = setSize || 'None';
}

// log history
function logCounterHistory() {
    const newHistoryRecord = document.createElement('tr');
    const newCountRecord = document.createElement('td');
    const newRepsRecord = document.createElement('td');
    const newSetRecord = document.createElement('td');
    newCountRecord.innerText = counter;
    const reps = Math.floor(counter / 2);
    newRepsRecord.innerText = reps;
    newSetRecord.innerText = setCount;
    newHistoryRecord.appendChild(newCountRecord);
    newHistoryRecord.appendChild(newRepsRecord);
    newHistoryRecord.appendChild(newSetRecord);
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
setSizeButton.addEventListener('click', setSetSize);
