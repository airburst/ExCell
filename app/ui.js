export const setDomValue = (el, value) => {
    document.getElementById(el).innerHTML = value;
};

export const showElement = (el) => {
    let klass = document.getElementById(el).className;
    if (klass.indexOf(' hide') > -1) {
        klass = klass.replace(' hide', '');
        document.getElementById(el).className = klass;
    }
};

export const hideElement = (el) => {
    let klass = document.getElementById(el).className;
    if (klass.indexOf(' hide') === -1) {
        document.getElementById(el).className = klass + ' hide';
    }
};