export const getConvertedValue = (value, mode) => {
  if (mode === "decimalsToPercentages") {
    return (Number(value) * 100).toFixed(0);
  } else if (mode === "percentagesTodecimals") {
    return Number(value) / 100;
  } else if (mode === "gifDisplay") {
    return 20 - Number(value) + 1;
  } else if (mode === "gifState") {
    return 20 - Number(value) + 1;
  }
};
