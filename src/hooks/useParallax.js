import useEntryPosition from './useEntryPosition';

const getRangeValue = (direction, elementIs, range, box) => {
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

export const useParallax = ({ range = 50 }) => {
  const [boxPosToWatch, { direction, elementIs }, box] = useEntryPosition();
  const rangeValue =
    direction && elementIs && range && box
      ? getRangeValue(direction, elementIs, range, box)
      : 0;
  return [boxPosToWatch, { range: rangeValue }, box];
};

export default useParallax;
