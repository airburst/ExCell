import formula from 'excel-formula';

export default class Parser {

    constructor() {
        this.getTokens = formula.getTokens;
    }

    getRangeTokens(formula = '') {
        return this.getTokens(formula)
            .filter((t) => { return t.subtype === 'range' })
            .map((r) => { return r.value; });
    }
}