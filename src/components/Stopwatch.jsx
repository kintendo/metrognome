import { useEffect, useRef, useState } from 'react';

const fmt = (n) => (n < 10 ? `0${n}` : `${n}`);

export default function Stopwatch() {
  const [totalCs, setTotalCs] = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [intervalInput, setIntervalInput] = useState('');
  const [intervalSec, setIntervalSec] = useState(0);

  const runningRef = useRef(running);
  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const totalCsRef = useRef(totalCs);
  useEffect(() => {
    totalCsRef.current = totalCs;
  }, [totalCs]);

  const intervalSecRef = useRef(intervalSec);
  useEffect(() => {
    intervalSecRef.current = intervalSec;
  }, [intervalSec]);

  const audioCtxRef = useRef(null);
  const bellBufferRef = useRef(null);

  useEffect(() => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    audioCtxRef.current = ctx;
    fetch('/alarm.wav')
      .then((r) => r.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        bellBufferRef.current = decoded;
      });
  }, []);

  function playAlert() {
    const ctx = audioCtxRef.current;
    const buf = bellBufferRef.current;
    if (!ctx || !buf) return;
    if (ctx.state === 'suspended') ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
  }

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTotalCs((t) => {
        const next = t + 1;
        const sec = intervalSecRef.current;
        if (sec > 0) {
          const prevSec = Math.floor(t / 100);
          const nextSec = Math.floor(next / 100);
          if (nextSec > prevSec && nextSec % sec === 0) {
            playAlert();
          }
        }
        return next;
      });
    }, 10);
    return () => clearInterval(id);
  }, [running]);

  const cs = totalCs % 100;
  const s = Math.floor(totalCs / 100) % 60;
  const m = Math.floor(totalCs / 6000) % 60;
  const h = Math.floor(totalCs / 360000);

  function startFromZero() {
    setTotalCs(0);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
    const t = totalCsRef.current;
    setHistory((hist) => [
      ...hist,
      {
        h: Math.floor(t / 360000),
        m: Math.floor(t / 6000) % 60,
        s: Math.floor(t / 100) % 60,
        cs: t % 100,
      },
    ]);
  }

  function doContinue() {
    setRunning(true);
  }

  function reset() {
    setTotalCs(0);
  }

  function commitInterval() {
    setIntervalSec(Math.max(0, Math.floor(Number(intervalInput))) || 0);
  }

  function clearIntervalAlert() {
    setIntervalInput('');
    setIntervalSec(0);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (runningRef.current) {
        stop();
      } else {
        doContinue();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="stopwatch-container">
      <article>
        <header>Stopwatch</header>
        <p>
          <span className="sw-text">{fmt(h)}</span> :{' '}
          <span className="sw-text">{fmt(m)}</span> :{' '}
          <span className="sw-text">{fmt(s)}</span> :{' '}
          <span>{fmt(cs)}</span>
        </p>
        <button onClick={startFromZero}>Start from zero</button>
        <button onClick={stop}>Stop</button>
        <button onClick={doContinue}>Continue</button>
        <button onClick={reset}>Reset</button>
      </article>
      <article>
        <header>Interval Alert</header>
        <div className="container">
          <input
            type="number"
            min="0"
            placeholder="Interval (seconds)"
            value={intervalInput}
            onChange={(e) => setIntervalInput(e.target.value)}
          />
          <button onClick={commitInterval}>Set interval</button>
          <button onClick={clearIntervalAlert}>Clear interval</button>
          <div>
            <span>Alert every:&nbsp;</span>
            <span>{intervalSec ? `${intervalSec}s` : 'Off'}</span>
          </div>
        </div>
      </article>
      <article>
        <header>Stopwatch History</header>
        <table>
          <tbody>
            {history.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {fmt(row.h)} : {fmt(row.m)} : {fmt(row.s)} : {fmt(row.cs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </div>
  );
}
