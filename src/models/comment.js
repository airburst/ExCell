export default class Comment {
    constructor(commentText = '') {
        this.fullText = commentText;
        this.name = '';
        this.type = '';
        this.dataType = 'single';
        this.rows = 0;
        this.cols = 0;
    }

    lines() {
        return this.fullText.split('\n');
    }

    pairs() {
        const hasTwoParts = (pair) =>
            (pair.length > 1) && !this.isBlank(pair[1]);
        return this.lines()
            .map(line => line.split(':'))
            .filter(pair => hasTwoParts(pair));
    }

    isValid() {
        return !this.isBlank(this.type);
    }

    isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    getData() {
        this.pairs().forEach(p => {
            this.setType(p);
            this.setDataType(p);
            this.setRows(p);
            this.setCols(p);
        });
    }

    setType(p) {
        if ((p[0] === 'I') || (p[0] === 'O')) {
            this.type = p[0];
            this.name = p[1].trim();
        }
    }

    setDataType(p) {
        if (p[0] === 'dataType') { this.dataType = p[1]; }
    }

    setRows(p) {
        if (p[0] === 'rows') { this.rows = p[1]; }
    }

    setCols(p) {
        if (p[0] === 'cols') { this.cols = p[1]; }
    }

    data() {
        return {
            name: this.name,
            type: this.type,
            dataType: this.dataType,
            rows: this.rows,
            cols: this.cols
        }
    }
}