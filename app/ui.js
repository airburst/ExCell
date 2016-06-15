export const setDomValue = (el, value) => {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById(el).innerHTML = value;
    });
};