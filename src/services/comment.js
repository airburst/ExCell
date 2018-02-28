const isBlank = str => !str || /^\s*$/.test(str);

const camelize = str =>
  str
    .toLowerCase()
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');

const hasTwoParts = pair => pair.length > 1 && !isBlank(pair[1]);

const pairs = text =>
  text
    .split('\n')
    .map(line => line.split(':'))
    .filter(pair => hasTwoParts(pair));

const getCommentData = text => {
  const keyPairs = {};
  pairs(text).forEach(([type, value]) => {
    keyPairs[type] = camelize(value.trim());
  });
  keyPairs.name = keyPairs.I || keyPairs.O;
  return keyPairs;
};

export default getCommentData;
