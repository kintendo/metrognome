import { useEffect, useRef, useState } from 'react';

export default function Metronome() {
  const [bpm, setBpm] = useState(50);
  const [counter, setCounter] = useState(0);
  const [setSize, setSetSize] = useState(0);
  const [setsInput, setSetsInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [targetSets, setTargetSets] = useState(0);
  const [setCount, setSetCount] = useState(0);
  const [setCompleteSound, setSetCompleteSound] = useState(false);
  const [setCompletePause, setSetCompletePause] = useState(false);
  const [restInput, setRestInput] = useState('');
  const [restSeconds, setRestSeconds] = useState(0);
  const [resting, setResting] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pauseLabel, setPauseLabel] = useState('Pause');
  const [history, setHistory] = useState([]);

  const loAudioRef = useRef(null);
  const hiAudioRef = useRef(null);
  const bellAudioRef = useRef(null);

  const setSizeRef = useRef(setSize);
  const setCompleteSoundRef = useRef(setCompleteSound);
  const setCompletePauseRef = useRef(setCompletePause);
  const targetSetsRef = useRef(targetSets);
  const restSecondsRef = useRef(restSeconds);
  const restTimerRef = useRef(null);
  const setCountSeenRef = useRef(0);
  useEffect(() => {
    setSizeRef.current = setSize;
  }, [setSize]);
  useEffect(() => {
    setCompleteSoundRef.current = setCompleteSound;
  }, [setCompleteSound]);
  useEffect(() => {
    setCompletePauseRef.current = setCompletePause;
  }, [setCompletePause]);
  useEffect(() => {
    targetSetsRef.current = targetSets;
  }, [targetSets]);
  useEffect(() => {
    restSecondsRef.current = restSeconds;
  }, [restSeconds]);

  useEffect(() => {
    if (!playing) return;
    const intervalMs = (60 / bpm) * 1000;
    const id = setInterval(() => {
      setCounter((c) => {
        const next = c + 1;
        if (next % 2 === 0) {
          hiAudioRef.current?.play();
        } else {
          loAudioRef.current?.play();
        }
        const size = setSizeRef.current;
        if (size && next % 2 === 0 && (next / 2) % size === 0) {
          setSetCount((s) => s + 1);
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [playing, bpm]);

  useEffect(() => {
    if (setCount === 0) {
      setCountSeenRef.current = 0;
      return;
    }
    if (setCount === setCountSeenRef.current) return;
    setCountSeenRef.current = setCount;

    const target = targetSetsRef.current;
    const targetReached = target && setCount >= target;

    if (targetReached) {
      if (setCompleteSoundRef.current) {
        bellAudioRef.current?.play();
      }
      if (setCompletePauseRef.current) {
        setPlaying(false);
        setPauseLabel('Paused');
      }
      return;
    }

    if (restSecondsRef.current > 0) {
      setPlaying(false);
      setResting(true);
      restTimerRef.current = setTimeout(() => {
        restTimerRef.current = null;
        setResting(false);
        setPlaying(true);
        setPauseLabel('Pause');
      }, restSecondsRef.current * 1000);
    }
  }, [setCount]);

  function clearRestTimer() {
    if (restTimerRef.current) {
      clearTimeout(restTimerRef.current);
      restTimerRef.current = null;
    }
    setResting(false);
  }

  useEffect(() => {
    if (!resting) {
      setRestRemaining(0);
      return;
    }
    setRestRemaining(restSecondsRef.current);
    const id = setInterval(() => {
      setRestRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resting]);

  function play() {
    clearRestTimer();
    setPlaying(true);
    setPauseLabel('Pause');
  }

  function pause() {
    clearRestTimer();
    setPlaying(false);
    setPauseLabel('Paused');
  }

  function changeBpm(delta) {
    setBpm((b) => b + delta);
  }

  function resetCounter() {
    setHistory((h) => [
      ...h,
      { count: counter, reps: Math.floor(counter / 2), sets: setCount },
    ]);
    setCounter(0);
    setSetCount(0);
    setPauseLabel('Pause');
  }

  function commitSetSize() {
    let reps = Math.floor(Number(repsInput)) || 0;
    let sets = Math.floor(Number(setsInput)) || 0;
    let rest = Math.floor(Number(restInput)) || 0;
    if (reps < 2) reps = 0;
    if (sets < 1) sets = 0;
    if (rest < 1) rest = 0;
    if (reps > 0 && sets === 0) {
      sets = 1;
      setSetsInput('1');
    }
    setSetSize(reps);
    setTargetSets(sets);
    setRestSeconds(rest);
    if (reps > 0 || sets > 0) {
      setSetCompleteSound(true);
      setSetCompletePause(true);
    }
  }

  function clearSetsReps() {
    setSetsInput('');
    setRepsInput('');
    setRestInput('');
    setSetSize(0);
    setTargetSets(0);
    setRestSeconds(0);
  }

  function clearHistory() {
    setHistory([]);
  }

  const reps = Math.floor(counter / 2);
  const repsInSet =
    setSize > 0 ? (reps === 0 ? 0 : ((reps - 1) % setSize) + 1) : reps;
  const hiDot = counter !== 0 && counter % 2 !== 0 ? '●' : '○';
  const loDot = counter !== 0 && counter % 2 === 0 ? '●' : '○';

  return (
    <div>
      <article>
        <header>BPM Controls</header>
        <div className="container center-text">
          <span className="bpm-value">{bpm}</span>{' '}
          <span className="bpm-label">beats per minute</span>
        </div>
        <div className="container bpm-controls">
          <button className="btn-reset" onClick={() => changeBpm(-10)}>
            - 10
          </button>
          <button className="btn-reset" onClick={() => changeBpm(-1)}>
            - 1
          </button>
          <button className="btn-reset" onClick={() => changeBpm(1)}>
            + 1
          </button>
          <button className="btn-reset" onClick={() => changeBpm(10)}>
            + 10
          </button>
        </div>
      </article>
      <article className="main-controls">
        <div>
          <button
            onClick={play}
            className={
              playing || resting
                ? 'btn-playing'
                : pauseLabel === 'Paused'
                  ? 'btn-resume'
                  : ''
            }
          >
            {playing || resting
              ? 'Playing'
              : pauseLabel === 'Paused'
                ? 'Resume'
                : 'Start'}
          </button>
          <button
            onClick={pause}
            className={!playing && pauseLabel === 'Paused' ? 'btn-paused' : ''}
          >
            {playing ? 'Pause' : pauseLabel}
          </button>
          <button className="btn-reset" onClick={resetCounter}>
            Reset Counter
          </button>
        </div>
      </article>
      <article>
        <div id="dots">
          <div>{hiDot}</div>
          <div>{loDot}</div>
        </div>
        <div className="counters-row">
          <em data-tooltip="Number of total beats">
            Beats:&nbsp;<span>{counter}</span>
          </em>
          <em data-tooltip="Number of sets completed">
            Sets:&nbsp;
            <span className={targetSets > 0 ? 'committed-value' : ''}>
              {targetSets > 0 ? `${setCount}/${targetSets}` : setCount}
            </span>
          </em>
          <em data-tooltip="Every two beats is a rep">
            Reps:&nbsp;
            <span className={setSize > 0 ? 'committed-value' : ''}>
              {setSize > 0 ? `${repsInSet}/${setSize}` : reps}
            </span>
          </em>
          <em data-tooltip="Rest seconds remaining">
            Rest:&nbsp;
            <span className={restSeconds > 0 ? 'committed-value' : ''}>
              {resting ? restRemaining : restSeconds}s
            </span>
          </em>
        </div>
      </article>
      <article>
        <header>Reps and Set Controls</header>
        <div className="container">
          <div className="sets-reps-row">
            <input
              className={`small-input sets-reps-input${
                targetSets > 0 && setsInput === String(targetSets)
                  ? ' committed'
                  : ''
              }`}
              type="number"
              min="1"
              placeholder="Sets"
              value={setsInput}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) setSetsInput(val);
              }}
            />
            <span className="multiplier">x</span>
            <input
              className={`small-input sets-reps-input${
                setSize > 0 && repsInput === String(setSize) ? ' committed' : ''
              }`}
              type="number"
              min="2"
              placeholder="Reps"
              value={repsInput}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) setRepsInput(val);
              }}
            />
            <span className="multiplier">x</span>
            <input
              className={`small-input sets-reps-input${
                restSeconds > 0 && restInput === String(restSeconds)
                  ? ' committed'
                  : ''
              }`}
              type="number"
              min="1"
              placeholder="Rest (s)"
              value={restInput}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) setRestInput(val);
              }}
            />
          </div>
          <div className="sets-reps-buttons">
            <button className="btn-reset" onClick={commitSetSize}>
              Set
            </button>
            <button className="btn-reset" onClick={clearSetsReps}>
              Clear
            </button>
          </div>
          <label>
            <input
              type="checkbox"
              checked={setCompleteSound}
              onChange={(e) => setSetCompleteSound(e.target.checked)}
            />{' '}
            Play sound on completion of all sets
          </label>
          <label>
            <input
              type="checkbox"
              checked={setCompletePause}
              onChange={(e) => setSetCompletePause(e.target.checked)}
            />{' '}
            Pause when all sets completed
          </label>
        </div>
      </article>
      <article>
        <header>History</header>
        <table>
          <thead>
            <tr>
              <th scope="col">Count</th>
              <th scope="col">Reps</th>
              <th scope="col">Sets</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i}>
                <td>{row.count}</td>
                <td>{row.reps}</td>
                <td>{row.sets}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-reset" onClick={clearHistory}>
          Clear History
        </button>
      </article>

      <audio ref={loAudioRef} src="/Synth_Sine_C_lo.wav" />
      <audio ref={hiAudioRef} src="/Synth_Sine_C_hi.wav" />
      <audio ref={bellAudioRef} src="/boxing-bell.mp3" />
    </div>
  );
}
