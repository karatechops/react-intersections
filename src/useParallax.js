import useEntryPosition from './useEntryPosition';

export const useParallax = (box, range = 50) => {
  const boxPosStatus = useEntryPosition(box);
  const { direction, elementIs } = boxPosStatus;

  if (direction === 'down') {
    if (elementIs === 'leaving') {
      return (range - range * box.intersectionRatio) * -1;
    }
    return range - range * box.intersectionRatio;
  }

  if (direction === 'up') {
    if (elementIs === 'leaving') {
      return range - range * box.intersectionRatio;
    }
    return (range - range * box.intersectionRatio) * -1;
  }

  return (range - range * box.intersectionRatio) * -1;
};

export default useParallax;
