import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

export const useIntersectRef = ({
  root = null,
  rootMargin,
  threshold = 0,
} = {}) => {
  const [entry, updateEntry] = useState({});
  const [node, setNode] = useState(null);

  const observer = useRef(
    new window.IntersectionObserver(
      ([currEntry]) => {
        updateEntry(currEntry.isIntersecting);
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

  return [setNode, entry];
};

// Attempting to create a reusable intersection observer...
export const useIntersect = (
  ref, // Node to watch
  {
    threshold = 0,
    rootMargin = '0px',
    root = null, // Intersection API params
  } = {},
  { repeats = true, debug = false } = {}, // Options
) => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        if (debug) console.log(entry); // eslint-disable-line no-console
        if (!repeats && entry.isIntersecting) {
          setIntersecting(entry.isIntersecting);
          observer.unobserve(ref.current);
        } else {
          setIntersecting(entry.isIntersecting);
        }
      },
      {
        root, // defaults to viewport when null.
        threshold, // intersection ratio value, also accepts arrays
        rootMargin, // expands or contracts the intersection root hit area
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      // react-hooks linter complains here but copying the ref.current
      // to a variable breaks the hooks.
      observer.unobserve(ref.current); // eslint-disable-line react-hooks/exhaustive-deps
    };
  });

  return isIntersecting;
};

function App() {
  const rootRect = useRef();
  // const thingToWatch = useRef();
  // const thingToWatchNext = useRef();
  const [isBtnPressed, setBtnPressed] = useState(false);

  /* const isVisible = useIntersect(thingToWatch);
  const isNextVisible = useIntersect(thingToWatchNext); */
  /* const isVisible = useIntersect(thingToWatch, undefined, {
    debug: true,
    repeats: false,
  });
  const isNextVisible = useIntersect(thingToWatchNext, undefined, {
    debug: true,
    repeats: false,
  });
  console.log(isVisible, isNextVisible);
  */
  const [thingToWatch, isVisible] = useIntersectRef();
  const [thingToWatchNext, isNextVisible] = useIntersectRef();

  return (
    <div ref={rootRect} className="App">
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
        <div style={{ height: '100vh' }} />
        <div style={{ height: '100vh' }} />
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
          Im visible!!!!!
        </span>
        <div style={{ height: '50vh' }} />
        <div
          id="otherThing"
          ref={thingToWatchNext}
          style={{ height: '10px', width: '10px', background: 'green' }}
        />
        <span
          style={{
            opacity: isNextVisible ? 1 : 0,
            transition: 'ease-in opacity 1s',
          }}
        >
          Im visible also!!!!!
        </span>
        <div style={{ height: '100vh' }} />
      </header>
    </div>
  );
}

export default App;
