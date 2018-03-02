// eslint-disable-next-line prefer-spread
export const flatten = array => [].concat.apply([], array);

export const replaceAll = (find, replace, fullText) =>
  fullText.replace(new RegExp(find, 'g'), replace);

const removeQuotes = text => replaceAll('"', '', text);

export const arrayToString = array => {
  if (!Array.isArray(array)) {
    return '';
  }
  return array.map(
    item => (typeof item === 'object' ? `${JSON.stringify(item)}` : item)
  );
};

// const zeroPad = (num, places) => {
//   const zero = places - num.toString().length + 1;
//   return Array(+(zero > 0 && zero)).join('0') + num;
// };

export const castNumber = num => {
  const cast = parseFloat(num, 10);
  if (Number.isNaN(cast)) {
    return num;
  }
  return cast;
};

const EXCEL_CURRENCY_TOKEN = '_-[$£-';
const THOUSANDS_FORMAT_TOKEN = '#,##0';

const toCurrency = num =>
  num.toLocaleString('en-UK', {
    style: 'currency',
    currency: 'GBP',
  });

// n decimal places with average rounding
export const dp = (amount, places = 2) => {
  if (!amount) {
    return '0';
  }
  try {
    // eslint-disable-next-line no-restricted-properties
    const exp = Math.pow(10, places);
    const truncated = Math.round(castNumber(amount) * exp) / exp;
    const result = parseFloat(truncated, 10);
    return Number.isNaN(result) ? amount : result.toFixed(places);
  } catch (e) {
    console.log(`Rounding error: ${e.message}`);
    return amount;
  }
};

export const countDecimals = format => {
  const f = format.toString().split('.');
  if (f.length === 1) {
    return 0;
  }
  const places = f[f.length - 1];
  return places.length;
};

const thousands = (num, places = 2) =>
  dp(num, places).replace(
    /./g,
    (c, i, a) => (i && c !== '.' && (a.length - i) % 3 === 0 ? `,${c}` : c)
  );

export const formatNumber = (num, format) => {
  if (!format || format === 'General') {
    return num.toString();
  }
  const token = removeQuotes(format).split('_-;')[0];
  const tokenFormat = token
    .split(' ')
    .filter(t => t.indexOf(EXCEL_CURRENCY_TOKEN) === -1)[0];
  if (token.indexOf(EXCEL_CURRENCY_TOKEN) > -1) {
    return toCurrency(num);
  }
  if (tokenFormat.indexOf(THOUSANDS_FORMAT_TOKEN) > -1) {
    return (
      tokenFormat.split(THOUSANDS_FORMAT_TOKEN)[0] +
      thousands(num, countDecimals(tokenFormat))
    );
  }
  return dp(num, countDecimals(tokenFormat));
};

export const makeRef = (sheet, ref) => `${sheet}!${ref}`;

export const splitOutSheetName = (sheet, range, namedRanges) => {
  const realRange = namedRanges.get(range) ? namedRanges.get(range) : range;
  const r = realRange.split('!');
  if (r.length === 2) {
    return { sheet: r[0], range: r[1] };
  }
  return { sheet, range };
};

// Parse Excel date code
// XLSX.SSF.parse_date_code
