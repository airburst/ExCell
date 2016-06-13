const XLSX = require('xlsx');
// Cell Object

// Key	Description
// v	raw value (see Data Types section for more info)
// w	formatted text (if applicable)
// t	cell type: b Boolean, n Number, e error, s String, d Date
// f	cell formula (if applicable)
// r	rich text encoding (if applicable)
// h	HTML rendering of the rich text (if applicable)
// c	comments associated with the cell **
// z	number format string associated with the cell (if requested)
// l	cell hyperlink object (.Target holds link, .tooltip is tooltip)
// s	the style/theme of the cell (if applicable)

// Data Types
// The raw value is stored in the v field, interpreted based on the t field.
// Type b is the Boolean type. v is interpreted according to JS truth tables
// Type e is the Error type. v holds the number and w holds the common name:

// Value	Error Meaning
// 0x00	#NULL!
// 0x07	#DIV/0!
// 0x0F	#VALUE!
// 0x17	#REF!
// 0x1D	#NAME?
// 0x24	#NUM!
// 0x2A	#N/A
// 0x2B	#GETTING_DATA

class Excell {

    constructor() {
        this.data = [];
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
        console.log(comment);
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

let xl = new Excell();
let details = xl.processFile('checker.xlsx');
document.getElementById('excel-file').innerText = details;

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
