// eslint-disable-next-line prefer-spread
export const flatten = array => [].concat.apply([], array);

export const replaceAll = (find, replace, fullText) =>
  fullText.replace(new RegExp(find, 'g'), replace);

export const arrayToString = array => {
  if (!Array.isArray(array)) {
    return '';
  }
  return array.map(
    item => (typeof item === 'object' ? `${JSON.stringify(item)}` : item)
  );
};

export const castNumber = num => {
  const cast = parseFloat(num, 10);
  if (Number.isNaN(cast)) {
    return num;
  }
  return cast;
};

// n decimal places with average rounding
export const dp = (amount, places = 2) => {
  if (!amount) {
    return 0;
  }
  try {
    // eslint-disable-next-line no-restricted-properties
    const exp = Math.pow(10, places);
    const truncated = Math.round(castNumber(amount) * exp) / exp;
    const result = parseFloat(truncated, 10);
    return Number.isNaN(result) ? amount : result;
  } catch (e) {
    console.log(`Rounding error: ${e.message}`);
    return amount;
  }
};

// Parse Excel date code
// XLSX.SSF.parse_date_code
