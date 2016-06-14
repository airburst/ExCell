import XLSX from 'xlsx';
import {Comment} from './comment.js';

export class Excell {

    constructor() {
        this.data = [];
        this.comments = [];
    }

    processFile(fileName) {
        let workbook = XLSX.readFile(fileName, {cellDates: true}); // TODO: Error check
        let sheetNames = workbook.SheetNames,
            output = '';

        for (let name of sheetNames) {
            let worksheet = workbook.Sheets[name];

            // Test for named ranges

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