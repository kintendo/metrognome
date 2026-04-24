import { useEffect, useRef, useState } from 'react';

export default function Metronome() {
  const [bpm, setBpm] = useState(50);
  const [counter, setCounter] = useState(0);
  const [setSize, setSetSize] = useState(0);
  const [setSizeInput, setSetSizeInput] = useState('');
  const [setCount, setSetCount] = useState(0);
  const [stressFirstBeat, setStressFirstBeat] = useState(true);
  const [setCompleteSound, setSetCompleteSound] = useState(false);
  const [setCompletePause, setSetCompletePause] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pauseLabel, setPauseLabel] = useState('Pause');
  const [history, setHistory] = useState([]);

  const loAudioRef = useRef(null);
  const hiAudioRef = useRef(null);
  const bellAudioRef = useRef(null);

  const stressRef = useRef(stressFirstBeat);
  const setSizeRef = useRef(setSize);
  const setCompleteSoundRef = useRef(setCompleteSound);
  const setCompletePauseRef = useRef(setCompletePause);
  useEffect(() => {
    stressRef.current = stressFirstBeat;
  }, [stressFirstBeat]);
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
    if (!playing) return;
    const intervalMs = (60 / bpm) * 1000;
    const id = setInterval(() => {
      setCounter((c) => {
        const next = c + 1;
        if (stressRef.current && next % 2 === 0) {
          hiAudioRef.current?.play();
        } else {
          loAudioRef.current?.play();
        }
        const size = setSizeRef.current;
        if (size && next % 2 === 0 && (next / 2) % size === 0) {
          if (setCompleteSoundRef.current) {
            bellAudioRef.current?.play();
          }
          setSetCount((s) => s + 1);
          if (setCompletePauseRef.current) {
            setPlaying(false);
            setPauseLabel('Paused');
          }
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [playing, bpm]);

  function play() {
    setPlaying(true);
    setPauseLabel('Pause');
  }

  function pause() {
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
  }

  function commitSetSize() {
    setSetSize(Math.floor(Number(setSizeInput)) || 0);
  }

  function clearHistory() {
    setHistory([]);
  }

  const reps = Math.floor(counter / 2);
  const hiDot = counter !== 0 && counter % 2 !== 0 ? '●' : '○';
  const loDot = counter !== 0 && counter % 2 === 0 ? '●' : '○';

  return (
    <div>
      <div id="dots">
        <div>{hiDot}</div>
        <div>{loDot}</div>
      </div>
      <article>
        <header>BPM Controls</header>
        <div className="container center-text">
          <span className="bpm-value">{bpm}</span>{' '}
          <span className="bpm-label">beats per minute</span>
        </div>
        <div className="container bpm-controls">
          <button onClick={() => changeBpm(-10)}>- 10</button>
          <button onClick={() => changeBpm(-1)}>- 1</button>
          <button onClick={() => changeBpm(1)}>+ 1</button>
          <button onClick={() => changeBpm(10)}>+ 10</button>
        </div>
      </article>
      <article className="main-controls">
        <div>
          <button onClick={play}>{playing ? 'Playing' : 'Play'}</button>
          <button onClick={pause}>{playing ? 'Pause' : pauseLabel}</button>
        </div>
        <label>
          <input
            type="checkbox"
            checked={stressFirstBeat}
            onChange={(e) => setStressFirstBeat(e.target.checked)}
          />
          Stress First Beat
        </label>
      </article>
      <article>
        <em data-tooltip="Number of total beats">
          Counter:&nbsp;<span>{counter}</span>&nbsp;&nbsp;
        </em>
        <br />
        <br />
        <em data-tooltip="Every two beats is a rep">
          Reps:&nbsp;<span>{reps}</span>
        </em>
        <br />
        <br />
        <button onClick={resetCounter}>Reset Counter</button>
      </article>
      <article>
        <header>Set Controls</header>
        <div className="container">
          <fieldset role="group">
            <input
              type="number"
              placeholder="Number of reps in set"
              value={setSizeInput}
              onChange={(e) => setSetSizeInput(e.target.value)}
            />
            <input
              type="submit"
              value="Set reps in set"
              onClick={commitSetSize}
            />
          </fieldset>
          <span>Number of Reps in Set:&nbsp;</span>
          <span>{setSize || 'None'}</span>
          <br />
          <span>Number of Sets:&nbsp;</span>
          <span>{setCount}</span>
          <label>
            <input
              type="checkbox"
              checked={setCompleteSound}
              onChange={(e) => setSetCompleteSound(e.target.checked)}
            />{' '}
            Play sound on set completion
          </label>
          <label>
            <input
              type="checkbox"
              checked={setCompletePause}
              onChange={(e) => setSetCompletePause(e.target.checked)}
            />{' '}
            Pause on set completion
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
        <button onClick={clearHistory}>Clear History</button>
      </article>

      <audio ref={loAudioRef} src="/Synth_Sine_C_lo.wav" />
      <audio ref={hiAudioRef} src="/Synth_Sine_C_hi.wav" />
      <audio ref={bellAudioRef} src="/boxing-bell.mp3" />
    </div>
  );
}
