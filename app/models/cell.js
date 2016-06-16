import {Comment} from './comment.js';

export class Cell {

    constructor(sheet = '', ref = '', cellData = {}) {
        this.type = (cellData.t) ? cellData.t : '';
        this.value = this.initialiseValueByType(this.type, cellData.v);
        this.formula = (cellData.f) ? cellData.f : '';
        this.sheet = sheet;
        this.ref = ref;
        this.depth = 0;
        this.comment = (cellData.c) ? this.getCommentData(cellData.c) : undefined;
    }

    initialiseValueByType(type, value) {
        if ((value) && (value !== undefined) && (value !== null) && (value !== '')) { return value; }
        return this.castInitialValue(type);
    }

    castInitialValue(type) {
        if ((type === 'n') || (type === 'n')) { return 0; }
        return '';
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