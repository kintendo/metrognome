const stopwatchZeroStartButton = document.getElementById('stopwatchZeroStart');
const stopwatchContinueButton = document.getElementById('stopwatchStop');
const stopwatchStopButton = document.getElementById('stopwatchContinue');
const stopwatchResetButton = document.getElementById('stopwatchReset');
const stopwatchElm = document.getElementById('stopwatch');

let stopwatchInterval = null;
let cs = 0;
let s = 0;
let m = 0;
let h = 0;

function updateDisplay() {
    stopwatchElm.innerHTML = `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}`  : s}:${cs < 10 ? `0${cs}` : cs}`;
}

function stopwatchReset() {
    console.log('reset');
    cs = 0;
    s = 0;
    m = 0;
    h = 0;
    updateDisplay();
}

function newStopwatchInterval() {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
            cs = cs + 1;
            if (cs >= 100) {
                cs = 0;
                s = s + 1;
            }
            if (s >= 60) {
                s = 0;
                m = m + 1;
            }
            if (m >= 60) {
                m = 0;
                h = h + 1;
            }
            updateDisplay();
        }, 10)
    }
}

function stopwatchStart() {
    console.log('start');
    stopwatchReset();
    newStopwatchInterval();
}

function stopwatchStop() {
    console.log('stop');
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function stopwatchContinue() {
    console.log('continue');
    if (!stopwatchInterval) {
        newStopwatchInterval();
    }
}

updateDisplay();

stopwatchZeroStartButton.addEventListener('click', stopwatchStart);
stopwatchContinueButton.addEventListener('click', stopwatchStop);
stopwatchStopButton.addEventListener('click', stopwatchContinue);
stopwatchResetButton.addEventListener('click', stopwatchReset);