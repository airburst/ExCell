import Comment from './comment';

export default class Cell {

    constructor(sheet = '', ref = '', cellData = {}) {
        this.type = (cellData.t) ? cellData.t : '';
        this.value = this.initialiseValueByType(this.type, cellData.v);
        this.formula = (cellData.f) ? cellData.f : '';
        this.sheet = sheet;
        this.ref = ref;
        this.input = null;
        this.output = null;
        this.depth = 0;
        this.comment = (cellData.c) ? this.getCommentData(cellData.c) : null;
    }

    initialiseValueByType(type, value) {
        if (value && value !== '') { return value; }
        return (type === 'n') ? 0 : '';
    }

    getCommentData(commentText) {
        let comment = new Comment(commentText[0].t.toString());
        comment.getData();
        return comment.isValid() ? comment : null;
    }

    isFormula() {
        return (this.formula.length > 0);
    }

    isInput() {
        return (this.comment && this.comment.type === 'I');
    }

    isOutput() {
        return (this.comment && this.comment.type === 'O');
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