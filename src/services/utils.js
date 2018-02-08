export const flatten = array => [].concat.apply([], array);

export const replaceAll = (find, replace, fullText) =>
    fullText.replace(new RegExp(find, 'g'), replace);

export const arrayToString = array => {
    if (!Array.isArray(array)) { return ''; }
    return array.map(item => (typeof (item) === 'object')
        ? JSON.stringify(item) + '\n'
        : item + '\n');
}

export const castNumber = num => {
    const cast = parseFloat(num, 10);
    if (isNaN(cast)) { return 0; }
    return cast;
}

export const dp = (num, places = 2) => {
    const n = castNumber(num);
    const nn = Math.floor(n * Math.pow(10, places)) / Math.pow(10, places);
    return nn.toFixed(places);
}

export const roundUpToPenny = (amount) => {
    if (!amount) { return 0; }
    return Math.ceil((castNumber(amount) - 0.0000001) * 100) / 100;
}

export const roundDownToPenny = (amount) => {
    if (!amount) { return 0; }
    return Math.floor(castNumber(amount) * 100) / 100;
}

export const roundUpToPound = (amount) => {
    if (!amount) { return 0; }
    return parseInt(Math.ceil(castNumber(amount)), 10);
}
