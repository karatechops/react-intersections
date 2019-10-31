import React from 'react';
import useIntersect from '../hooks/useIntersect';

export const TriggerOnce = () => {
  const [thingToWatch, entry] = useIntersect({ repeats: false });
  const isVisible = entry.isIntersecting;
  return (
    <>
      {' '}
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
        Im visible and only trigger once{' '}
        <span role="img" aria-label="hand waving">
          👋
        </span>
      </span>
    </>
  );
};

export default TriggerOnce;
