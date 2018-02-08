import formula from 'excel-formula';

class Parser {
  constructor() {
    this.getTokens = formula.getTokens;
  }

  getRangeTokens(expression = '') {
    return this.getTokens(expression)
      .filter(t => t.subtype === 'range')
      .map(r => r.value);
  }
}

export default new Parser();
