export const flatten = array => [].concat.apply([], array);

export const replaceAll = (find, replace, fullText) =>
    fullText.replace(new RegExp(find, 'g'), replace);

export const arrayToString = array => {
    if (!Array.isArray(array)) { return ''; }
    return array.map(item => (typeof (item) === 'object')
        ? JSON.stringify(item) + '\n'
        : item + '\n');
}
