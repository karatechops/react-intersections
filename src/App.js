import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

// Attempting to create a reusable intersection observer...
export const useIntersect = (
  ref, // Node to watch
  {
    threshold = 0,
    rootMargin = '0px',
    root = null, // Intersection API params
  } = {},
  { repeats = true } = {}, // Options
) => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        console.log(entry);
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
      observer.unobserve(ref.current);
    };
  });

  return isIntersecting;
};

function App() {
  const rootRect = useRef();
  const thingToWatch = useRef();
  const thingToWatchNext = useRef();
  const [isBtnPressed, setBtnPressed] = useState(false);
  // This reusable hook is not firing correctly when state
  // updating quickly
  const isVisible = useIntersect(thingToWatch);
  const isNextVisible = useIntersect(thingToWatchNext);
  console.log(isVisible, isNextVisible);

  // This observer fires correctly when scrolling quickly
  /* 
  const [isVisible, setIsVisible] = useState(false);
  console.log('isVisible', isVisible);
  const observer = new IntersectionObserver(
    ([entry]) => {
      // Update our state when observer callback fires
      console.log(entry);
      setIsVisible(entry.isIntersecting);
    },
    {
      rootMargin: '0px',
      threshold: [1],
    },
  );
  useEffect(() => {
    const currRef = thingToWatch.current;
    observer.observe(currRef);

    return () => observer.unobserve(currRef);
  });
  */
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
