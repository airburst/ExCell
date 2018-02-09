import Comment from './comment';

export default class Cell {
  constructor(sheet = '', ref = '', cellData = {}) {
    this.type = cellData.t ? cellData.t : '';
    this.value = null;
    this.initialiseValueByType(this.type, cellData.v);
    this.formula = cellData.f ? cellData.f : null;
    this.sheet = sheet;
    this.ref = ref;
    this.input = null;
    this.output = null;
    this.name = null;
    this.depth = 0;
    this.comment = null;
    this.getCommentData(cellData.c);
    this.setIO();
  }

  initialiseValueByType(type, value) {
    if (value && value !== '') {
      this.value = value;
      return;
    }
    this.value = type === 'n' ? 0 : null;
  }

  getCommentData(commentText) {
    if (commentText) {
      const comment = new Comment(commentText[0].t.toString());
      comment.getData();
      this.comment = comment.isValid() ? comment : null;
      if (this.comment) {
        this.name = comment.name;
      }
    }
  }

  isFormula() {
    return this.formula !== null;
  }

  setIO() {
    this.input = this.comment && this.comment.type === 'I';
    this.output = this.comment && this.comment.type === 'O';
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
