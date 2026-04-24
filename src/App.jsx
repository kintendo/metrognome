import Metronome from './components/Metronome.jsx';
import Stopwatch from './components/Stopwatch.jsx';

export default function App() {
  return (
    <>
      <header className="center-text">
        <h1>Metrognome</h1>
      </header>
      <main>
        <div className="container grid">
          <Metronome />
          <Stopwatch />
        </div>
      </main>
      <footer>
        <p>© 2024 Metrognome</p>
      </footer>
    </>
  );
}
