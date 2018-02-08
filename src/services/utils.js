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

// n decimal places with average rounding
export const dp = (amount, places = 2) => {
    if (!amount) { return 0; }
    try {
        const exp = Math.pow(10, places);
        const truncated = Math.round(castNumber(amount) * exp) / exp;
        return parseFloat(truncated, 10);
    } catch (e) {
        console.log(`Rounding error: ${e.message}`);
        return amount;
    }
}
