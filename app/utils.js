export const flatten = (array) => {
    return [].concat.apply([], array);
};

export const replaceAll = (find, replace, fullText) => {
    return fullText.replace(new RegExp(find, 'g'), replace);
}