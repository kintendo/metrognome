const stopwatchZeroStartButton = document.getElementById('stopwatchZeroStart');
const stopwatchContinueButton = document.getElementById('stopwatchStop');
const stopwatchStopButton = document.getElementById('stopwatchContinue');
const stopwatchResetButton = document.getElementById('stopwatchReset');
const stopwatchElm = document.getElementById('stopwatch');
const stopwatchHistoryElm = document.getElementById('stopwatchHistory');

let stopwatchInterval = null;
let cs = 0;
let s = 0;
let m = 0;
let h = 0;
let swHistoryRowCount = 0;

function updateDisplay() {
    stopwatchElm.innerHTML = `
        <span class="swText">${h < 10 ? `0${h}` : h}</span> :
        <span class="swText">${m < 10 ? `0${m}` : m}</span> :
        <span class="swText">${s < 10 ? `0${s}`  : s}</span> :
        <span>${cs < 10 ? `0${cs}` : cs}</span>
    `;
}

function updateStopwatchHistory() {
    swHistoryRowCount = swHistoryRowCount + 1;
    const tr = document.createElement('tr');
    const rowHeader = document.createElement('td');
    rowHeader.innerHTML = swHistoryRowCount;
    tr.appendChild(rowHeader);
    const td = document.createElement('td');
    td.innerHTML = `
        ${h < 10 ? `0${h}` : h} :
        ${m < 10 ? `0${m}` : m} :
        ${s < 10 ? `0${s}`  : s} :
        ${cs < 10 ? `0${cs}` : cs}
    `;
    tr.appendChild(td);
    stopwatchHistoryElm.appendChild(tr);

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
    updateStopwatchHistory();
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