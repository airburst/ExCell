export const flatten = (array) => {
    return [].concat.apply([], array);
};

export const replaceAll = (find, replace, fullText) => {
    return fullText.replace(new RegExp(find, 'g'), replace);
}

export const arrayToString = (array) => {
    let text = '';
    for (let item of array) { text += JSON.stringify(item) + '\n'; }
    return text;
}