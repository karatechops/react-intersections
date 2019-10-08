import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

const buildThresholdArray = () => Array.from(Array(100).keys(), i => i / 100);
const Spacer = () => <div style={{ height: '100vh' }} />;

export const useIntersect = ({
  root = null, // defaults to viewport when null.
  rootMargin, // expands or contracts the intersection root hit area
  threshold = 0, // intersection ratio value, also accepts arrays
  repeats = true,
  debug = false,
} = {}) => {
  const [observerEntry, updateEntry] = useState({});
  let prevIntersectionRatio = 0;
  let prevY = 0;
  const [node, setNode] = useState(null);

  const observer = useRef(
    new window.IntersectionObserver(
      ([currEntry]) => {
        const appendedEntry = {
          isLeaving: false,
        };

        const currentY = currEntry.boundingClientRect.y;
        const currentRatio = currEntry.intersectionRatio;
        const { isIntersecting } = currEntry;

        // Gymnastics to convert the observer type to a new object.
        // Object.keys will not work here due to observer's inherited type.
        /* eslint-disable */
        for (let i in currEntry) {
          appendedEntry[i] = currEntry[i];
        }
        /* eslint-enable */

        // Scrolling down/up
        if (currentY < prevY) {
          if (currentRatio > prevIntersectionRatio && isIntersecting) {
            console.log(currEntry.target, 'Scrolling down enter');
            appendedEntry.isLeaving = false;
          } else {
            appendedEntry.isLeaving = true;
            console.log(currEntry.target, 'Scrolling down leave');
          }
        } else if (currentY > prevY && isIntersecting) {
          if (currentRatio < prevIntersectionRatio) {
            appendedEntry.isLeaving = true;
            console.log(currEntry.target, 'Scrolling up leave');
          } else {
            appendedEntry.isLeaving = false;
            console.log(currEntry.target, 'Scrolling up enter');
          }
        }

        prevY = currentY;
        prevIntersectionRatio = currentRatio;

        if (debug) {
          console.log(appendedEntry); // eslint-disable-line no-console
        }

        // Only trigger once if repeat option is false
        if (!repeats && appendedEntry.isIntersecting) {
          // Disable the observer after the event fires
          observer.current.disconnect();
          updateEntry(appendedEntry);
        }
        if (repeats) {
          updateEntry(appendedEntry);
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
    debug: true,
  });

  const isVisible = entry.isIntersecting;
  const isNextVisible = entryNext.isIntersecting;
  const boxPercentVisible = Math.ceil(box.intersectionRatio * 100) / 100;

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
            postion: 'relative',
          }}
        >
          <div style={{ position: 'absolute', zIndex: 10 }}>
            intersection ratio: {box.intersectionRatio && boxPercentVisible}
          </div>
          <div
            style={{
              height: '500px',
              width: '50vw',
              background: 'magenta',
              postion: 'absolute',
              bottom: 0,
              opacity: '0.4',
              transform: `translateY(${50 - 100 * box.intersectionRatio}px)`,
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
