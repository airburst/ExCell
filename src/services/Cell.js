import getCommentData from './comment';

export default class Cell {
  constructor(sheet = '', ref = '', cellData = {}) {
    this.type = cellData.t ? cellData.t : '';
    this.value = 0;
    this.initialiseValueByType(this.type, cellData.v);
    this.formula = cellData.f ? cellData.f : null;
    this.format = cellData.z;
    this.sheet = sheet;
    this.ref = ref;
    this.input = null;
    this.output = null;
    this.name = null;
    this.depth = 0;
    this.processComment(cellData.c);
  }

  initialiseValueByType(type, value) {
    if (value && value !== '') {
      this.value = value;
      return;
    }
    this.value = type === 's' ? '' : 0;
  }

  processComment(commentText) {
    if (commentText) {
      // Allocate any future comment keys here
      const { name, I, O } = getCommentData(commentText[0].t.toString());
      this.name = name;
      this.input = I !== undefined;
      this.output = O !== undefined;
    }
  }

  isFormula() {
    return this.formula !== null;
  }

  setValue(val) {
    this.value = val;
  }

  setInput(flag) {
    this.input = flag;
  }

  setOuput(flag) {
    this.output = flag;
  }

  setDepth(depth) {
    this.depth = depth;
  }

  setComment(comment) {
    this.comment = comment;
  }
}
