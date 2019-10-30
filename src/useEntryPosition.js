import { useState, useLayoutEffect } from 'react';
import { buildThresholdArray } from './utils';
import useIntersect from './useIntersect';

// TODO: A bug still exists in this component. Ocassionally, if the user
// TODO: is scoller slowly through a given observer threshold the
// TODO: intersectionRatio of 1 is missed.

// These values respond better outside of the scope of
// the component.
// TODO: figure out if this is best practice.
let prevTop = 0;
let prevIntersectionRatio = 0;

const POSITION_STATUS = {
  LEAVING: 'leaving',
  ENTERING: 'entering',
  VISIBLE: 'visible',
};

export const useEntryPosition = () => {
  const [setEntry, entryObserver] = useIntersect({
    threshold: buildThresholdArray(),
  });
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [target, setTarget] = useState();
  const [elementIs, setElementIs] = useState(undefined);
  const [direction, setDirection] = useState('down');
  const [onScroll, setOnScroll] = useState();

  const handleScroll = () => {
    // Setting a function to state requires an extra return.
    const { top } = entryObserver.target.getBoundingClientRect();
    if (top < prevTop || prevTop === 0) {
      setDirection('down');
    } else if (top > prevTop) {
      setDirection('up');
    }
    prevTop = top;
  };

  useLayoutEffect(() => {
    if (!target && entryObserver.target) {
      setTarget(entryObserver.target);
      // Store scroll handler in state so we can keep track
      // of it to remove later.
      setOnScroll(() => handleScroll);
    }

    if (entryObserver.isIntersecting && target && onScroll) {
      document.addEventListener('scroll', onScroll);
    }

    if (!entryObserver.isIntersecting && target) {
      document.removeEventListener('scroll', onScroll);
    }

    if (entryObserver.intersectionRatio !== intersectionRatio) {
      setIntersectionRatio(entryObserver.intersectionRatio);
      // Re-attach scroll listener to remove stale React state data.
      setOnScroll(() => handleScroll);
    }

    if (entryObserver.isIntersecting) {
      if (intersectionRatio > prevIntersectionRatio) {
        setElementIs(POSITION_STATUS.ENTERING);
      }
      if (intersectionRatio < prevIntersectionRatio) {
        setElementIs(POSITION_STATUS.LEAVING);
      }
      if (intersectionRatio === 1 || prevIntersectionRatio === 1) {
        setElementIs(POSITION_STATUS.VISIBLE);
      }
    }

    prevIntersectionRatio = intersectionRatio;

    // 🧹 Clean up when we're done.
    return () => document.removeEventListener('scroll', onScroll);
  }, [onScroll, target, entryObserver, intersectionRatio]); // eslint-disable-line react-hooks/exhaustive-deps

  return [setEntry, { direction, elementIs }];
};

export default useEntryPosition;
