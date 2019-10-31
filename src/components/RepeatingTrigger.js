import React from 'react';
import useIntersect from '../hooks/useIntersect';

export const RepeatingTrigger = () => {
  const [thingToWatchNext, entryNext] = useIntersect();
  const isNextVisible = entryNext.isIntersecting;

  return (
    <>
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
    </>
  );
};

export default RepeatingTrigger;
