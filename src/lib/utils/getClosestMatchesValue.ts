const getClosestMatchedValue = (inputValue: number, max: number, step: number): number => {
  const availableValues = [0];

  for (let i = step; i <= max; i += step) {
    availableValues.push(i);
  }

  return availableValues.reduce(function (prev, curr) {
    return Math.abs(curr - inputValue) < Math.abs(prev - inputValue) ? curr : prev;
  });
};

export default getClosestMatchedValue;
