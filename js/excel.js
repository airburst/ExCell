const XLSX = require('xlsx');

class Excell {

    constructor() {
        this.data = [];
        this.comments = [];
    }

    processFile(fileName) {
        let workbook = XLSX.readFile(fileName); // TODO: Error check
        let sheetNames = workbook.SheetNames,
            output = '';

        for (let name of sheetNames) {
            let worksheet = workbook.Sheets[name];
            for (let sheet in worksheet) {
                /* all keys that do not begin with "!" correspond to cell addresses */
                if (sheet[0] === '!') continue;
                if (this.hasComment(worksheet[sheet])) { this.getCommentData(worksheet[sheet].c); }
                output += (name + '!' + sheet + '=' + JSON.stringify(worksheet[sheet])) + '\n';
            }
        };
        return output;
    }

    hasComment(cell) {
        return cell.c !== undefined;
    }

    getCommentData(commentText) {
        let comment = new Comment(commentText[0].t.toString());
        comment.getData();
        this.addComment(comment);
    }

    addComment(comment) {
        if (comment.isValid()) { this.comments.push(comment); }
    }
}


class Comment {
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

// Main
(function() {
    let xl = new Excell();
    let details = xl.processFile('checker.xlsx');
    document.getElementById('excel-file').innerText = details;
})();

/* set up drag-and-drop event */
// function handleDrop(e) {
//   e.stopPropagation();
//   e.preventDefault();
//   var files = e.dataTransfer.files;
//   var i,f;
//   for (i = 0, f = files[i]; i != files.length; ++i) {
//     var reader = new FileReader();
//     var name = f.name;
//     reader.onload = function(e) {
//       var data = e.target.result;

//       /* if binary string, read with type 'binary' */
//       var workbook = XLSX.read(data, {type: 'binary'});

//       /* DO SOMETHING WITH workbook HERE */
//     };
//     reader.readAsBinaryString(f);
//   }
// }
// drop_dom_element.addEventListener('drop', handleDrop, false);

// function handleFile(e) {
//   var files = e.target.files;
//   var i,f;
//   for (i = 0, f = files[i]; i != files.length; ++i) {
//     var reader = new FileReader();
//     var name = f.name;
//     reader.onload = function(e) {
//       var data = e.target.result;

//       var workbook = XLSX.read(data, {type: 'binary'});

//       /* DO SOMETHING WITH workbook HERE */
//     };
//     reader.readAsBinaryString(f);
//   }
// }
// input_dom_element.addEventListener('change', handleFile, false);
