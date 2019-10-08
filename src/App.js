import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

const buildThresholdArray = () => Array.from(Array(100).keys(), i => i / 100);
const Spacer = () => <div style={{ height: '100vh' }} />;

let prevY = 0;
let prevIntersectionRatio = 0;

export const useIsEntryLeaving = entry => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [direction, setDirection] = useState('down');

  // Check for intersection observer.
  // TODO: Add more elegance to this check. Warn user.
  if (!entry.intersectionRatio) {
    return { isLeaving, direction };
  }

  const currentY = entry.boundingClientRect.y;
  const { isIntersecting, intersectionRatio } = entry;

  // Scrolling down/up
  if (currentY < prevY || prevY === 0) {
    if (intersectionRatio > prevIntersectionRatio && isIntersecting) {
      setIsLeaving(false);
    } else {
      setIsLeaving(true);
    }
    setDirection('down');
  } else if (currentY > prevY && isIntersecting) {
    if (intersectionRatio < prevIntersectionRatio) {
      setIsLeaving(true);
    } else {
      setIsLeaving(false);
    }
    setDirection('up');
  }

  prevY = currentY;
  prevIntersectionRatio = intersectionRatio;

  return { isLeaving, direction };
};

export const useIntersect = ({
  root = null, // defaults to viewport when null.
  rootMargin, // expands or contracts the intersection root hit area
  threshold = 0, // intersection ratio value, also accepts arrays
  repeats = true,
  debug = false,
} = {}) => {
  const [observerEntry, updateEntry] = useState({});
  const [node, setNode] = useState(null);

  const observer = useRef(
    new window.IntersectionObserver(
      ([currEntry]) => {
        if (debug) {
          console.log(currEntry); // eslint-disable-line no-console
        }

        // Only trigger once if repeat option is false
        if (!repeats && currEntry.isIntersecting) {
          // Disable the observer after the event fires
          observer.current.disconnect();
          updateEntry(currEntry);
        }
        if (repeats) {
          updateEntry(currEntry);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      },
    ),
  );

  useEffect(() => {
    const { current: currentObserver } = observer;
    currentObserver.disconnect();

    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node]);

  // Pass back method to set dom node and observer output
  return [setNode, observerEntry];
};

function App() {
  // Test if state changes overwrite observer state
  const [isBtnPressed, setBtnPressed] = useState(false);

  const [thingToWatch, entry] = useIntersect({ repeats: false });
  const [thingToWatchNext, entryNext] = useIntersect();
  const [boxToWatch, box] = useIntersect({
    threshold: buildThresholdArray(),
    rootMargin: '-10%', // Box is 10% past viewport bottom
  });

  const boxPosStatus = useIsEntryLeaving(box);
  console.log(boxPosStatus);
  const isVisible = entry.isIntersecting;
  const isNextVisible = entryNext.isIntersecting;
  const boxPercentVisible = Math.ceil(box.intersectionRatio * 100) / 100;
  const getYParallax = (range = 50) => {
    console.log('range', range, box.intersectionRatio);
    const { direction, isLeaving } = boxPosStatus;

    if (direction === 'down') {
      if (isLeaving) {
        return (range - range * box.intersectionRatio) * -1;
      }
      return range - range * box.intersectionRatio;
    }

    if (direction === 'up') {
      if (isLeaving) {
        return range - range * box.intersectionRatio;
      }
      return (range - range * box.intersectionRatio) * -1;
    }

    return (range - range * box.intersectionRatio) * -1;
  };
  const parallaxY = getYParallax(50);
  console.log(parallaxY);
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
          <div style={{ position: 'absolute', zIndex: 10 }}>
            intersection ratio: {box.intersectionRatio && boxPercentVisible}
          </div>
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
