import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import useIntersect from './useIntersect';
import useParallax from './useParallax';

const buildThresholdArray = () => Array.from(Array(100).keys(), i => i / 100);
const Spacer = () => <div style={{ height: '100vh' }} />;

function App() {
  // Test if state changes overwrite observer state
  const [isBtnPressed, setBtnPressed] = useState(false);

  const [thingToWatch, entry] = useIntersect({ repeats: false });
  const [thingToWatchNext, entryNext] = useIntersect();
  const [boxToWatch, box] = useIntersect({
    threshold: buildThresholdArray(),
    rootMargin: '-15%', // Box is 15% past viewport bottom
  });

  const isVisible = entry.isIntersecting;
  const isNextVisible = entryNext.isIntersecting;
  const boxPercentVisible = Math.ceil(box.intersectionRatio * 100) / 100;
  const parallaxY = useParallax(box, 50);

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
        <div
          id="myDude"
          ref={thingToWatch}
          style={{ height: '10px', width: '10px', background: 'red' }}
        />
        <span
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'ease-in opacity 1s',
          }}
        >
          Im visible and only trigger once{' '}
          <span role="img" aria-label="hand waving">
            👋
          </span>
        </span>
        <div style={{ height: '50vh' }} />
        {/* Intersection ratio display, parallax effect */}
        <div
          id="boxThing"
          ref={boxToWatch}
          style={{
            height: '500px',
            width: '50vw',
            background: 'cyan',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '50vw',
              background: 'magenta',
              position: 'absolute',
              bottom: 0,
              top: 0,
              opacity: '0.4',
              zIndex: 2,
              transform: `translateX(25px) translateY(${parallaxY}px)`,
            }}
          />
          <div
            style={{
              height: '100%',
              width: '50vw',
              background: 'blue',
              position: 'absolute',
              bottom: 0,
              top: 0,
              opacity: '0.4',
              zIndex: 3,
              transform: `translateX(50px) translateY(${parallaxY * 2}px)`,
            }}
          />
          <div
            style={{
              height: '100%',
              width: '50vw',
              position: 'absolute',
              bottom: 0,
              top: 0,
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              transform: `translateX(50px) translateY(${parallaxY * 5}px)`,
            }}
          >
            intersection ratio: {box.intersectionRatio && boxPercentVisible}
          </div>
        </div>
        <Spacer />
        {/* Repeating trigger */}
        <div
          id="otherThing"
          ref={thingToWatchNext}
          style={{
            height: '10px',
            width: '10px',
            background: 'green',
          }}
        />
        <span
          style={{
            opacity: isNextVisible ? 1 : 0,
            transition: 'ease-in opacity 1s',
          }}
        >
          Im visible and repeatedly trigger{' '}
          <span role="img" aria-label="hand waving">
            🔁
          </span>
        </span>
        <Spacer />
      </header>
    </div>
  );
}

export default App;
