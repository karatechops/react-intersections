import { useState } from 'react';

let prevY = 0;
let prevIntersectionRatio = 0;

export const useEntryPosition = entry => {
  const [isLeaving, setIsLeaving] = useState(true);
  const [direction, setDirection] = useState('up');

  // Check for intersection observer.
  // TODO: Add more elegance to this check.
  if (!entry.intersectionRatio) {
    return { isLeaving, direction };
  }

  const currentY = entry.boundingClientRect.y;
  const entryTop = entry.boundingClientRect.top;
  const { isIntersecting, intersectionRatio } = entry;

  // Scrolling down/up
  if (currentY < prevY && prevY !== 0) {
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

  // Handle when the initial render of the page contains the node
  // leaving or entering the screen. We assume the user will
  // scroll down after the page renders.
  // Example use case: The page renders with deep linking.
  if (prevY === 0 && entryTop < 0) {
    setDirection('down');
    setIsLeaving(true);
  } else if (prevY === 0 && entryTop > 0) {
    setDirection('down');
    setIsLeaving(false);
  }

  prevY = currentY;
  prevIntersectionRatio = intersectionRatio;

  return { isLeaving, direction };
};

export default useEntryPosition;
