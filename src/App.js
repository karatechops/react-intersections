import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ParallaxExample from './components/ParallaxExample';
import TriggerOnce from './components/TriggerOnce';
import RepeatingTrigger from './components/RepeatingTrigger';
import EntryPosExample from './components/EntryPosExample';

const Spacer = () => <div style={{ height: '100vh' }} />;

function App() {
  // Test if state changes overwrite observer state
  const [isBtnPressed, setBtnPressed] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button
          type="button"
          onClick={() => setBtnPressed(!isBtnPressed)}
          style={{ background: isBtnPressed ? 'red' : 'blue', color: 'white' }}
        >
          press me
        </button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Spacer />
        {/* Trigger once */}
        <TriggerOnce />
        <Spacer />
        {/* useParallax example */}
        <ParallaxExample />
        <Spacer />
        {/* Repeating trigger */}
        <RepeatingTrigger />
        <Spacer />
        {/* useEntryPosition example */}
        <EntryPosExample />
        <Spacer />
        <Spacer />
      </header>
    </div>
  );
}

export default App;
