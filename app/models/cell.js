import {Comment} from './comment.js';

export class Cell {

    constructor(sheet = '', ref = '', cellData = {}) {
        this.value = (cellData.v) ? cellData.v : '';
        this.type = (cellData.t) ? cellData.t : '';
        this.formula = (cellData.f) ? cellData.f : '';
        this.sheet = sheet;
        this.ref = ref;
        this.depth = 0;
        this.comment = (cellData.c) ? this.getCommentData(cellData.c) : undefined;
    }

    getCommentData(commentText) {
        let comment = new Comment(commentText[0].t.toString());
        comment.getData();
        return comment.isValid() ? comment : undefined;
    }

    isFormula() {
        return (this.formula.length > 0);
    }

    isInput() {
        return ((this.comment !== undefined) && (this.comment.type === 'I'));
    }

    isOutput() {
        return ((this.comment !== undefined) && (this.comment.type === 'O'));
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