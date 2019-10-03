import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

// Attempting to create a reusable intersection observer...
export const useIntersect = (ref, rootMargin = '0px') => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);
  //
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        console.log(entry);
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
};
function App() {
  const rootRect = useRef();
  const thingToWatch = useRef();
  const [isVisible, setIsVisible] = useState(false);
  console.log('isVisible', isVisible);
  // This reusable hook is not firing correctly when state
  // updating quickly
  // const entry = useIntersect(thingToWatch, '-50%');
  // console.log(entry);

  // This observer fires correctly when scrolling quickly
  const observer = new IntersectionObserver(
    ([entry]) => {
      // Update our state when observer callback fires
      console.log(entry);
      setIsVisible(entry.isIntersecting);
    },
    {
      rootMargin: '-25%',
    },
  );
  useEffect(() => {
    const currRef = thingToWatch.current;
    observer.observe(currRef);

    return () => observer.unobserve(currRef);
  });
  return (
    <div ref={rootRect} className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
        <div style={{ height: '100vh' }} />
      </header>
    </div>
  );
}

export default App;
