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
    stopwatchElm.innerHTML = `
        <span class="swText">${h < 10 ? `0${h}` : h}</span> :
        <span class="swText">${m < 10 ? `0${m}` : m}</span> :
        <span class="swText">${s < 10 ? `0${s}`  : s}</span> :
        <span>${cs < 10 ? `0${cs}` : cs}</span>
    `;
}

function stopwatchReset() {
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
    stopwatchReset();
    newStopwatchInterval();
}

function stopwatchStop() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function stopwatchContinue() {
    if (!stopwatchInterval) {
        newStopwatchInterval();
    }
}

function handleSpaceBar() {
    if (stopwatchInterval) {
        stopwatchStop();
    } else {
        stopwatchContinue();
    }
}

updateDisplay();

stopwatchZeroStartButton.addEventListener('click', stopwatchStart);
stopwatchContinueButton.addEventListener('click', stopwatchStop);
stopwatchStopButton.addEventListener('click', stopwatchContinue);
stopwatchResetButton.addEventListener('click', stopwatchReset);

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        handleSpaceBar();
    }
});