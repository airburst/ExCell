export class Comment {
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
        let pairs = [],
            self = this;
        for (let line of this.lines()) {
            let pair = line.split(':');
            if (hasTwoParts(pair)) { pairs.push(pair); }
        }
        return pairs;

        function hasTwoParts(pair) {
            return (pair.length > 1) && !self.isBlank(pair[1]);
        }
    }

    isValid() {
        return !this.isBlank(this.type);
    }

    isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    getData() {
        for (let p of this.pairs()) {
            this.setType(p);
            this.setDataType(p);
            this.setRows(p);
            this.setCols(p);
        }
    }

    setType(p) {
        if ((p[0] === 'I') || (p[0] === 'O')) {
            this.type = p[0];
            this.name = p[1];
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
}