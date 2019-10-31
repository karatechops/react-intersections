import React from 'react';
import useParallax from '../hooks/useParallax';

export const ParallaxExample = () => {
  const [boxToWatch, parallaxValue] = useParallax({
    range: 50,
  });
  const parallaxY = parallaxValue.range;

  return (
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
        Parallax rocks!
      </div>
    </div>
  );
};

export default ParallaxExample;
