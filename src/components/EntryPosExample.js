import React from 'react';
import useEntryPosition from '../hooks/useEntryPosition';

export const EntryPosExample = () => {
  const [boxPosToWatch, { direction, elementIs }] = useEntryPosition();

  return (
    <div
      ref={boxPosToWatch}
      style={{
        padding: '20px',
        border: `${elementIs === 'visible' ? 'green' : 'red'} 3px solid`,
        transition: 'border-color 1s linear',
      }}
    >
      <h1>
        You are scrolling {direction} {direction === 'up' ? '⬆️' : '⬇️️'} while
        <br />
        element is <u>{elementIs}</u> in the window.
      </h1>
    </div>
  );
};

export default EntryPosExample;
