const TOK_TYPE_NOOP = 'noop';
const TOK_TYPE_OPERAND = 'operand';
const TOK_TYPE_FUNCTION = 'function';
const TOK_TYPE_SUBEXPR = 'subexpression';
const TOK_TYPE_ARGUMENT = 'argument';
const TOK_TYPE_OP_PRE = 'operator-prefix';
const TOK_TYPE_OP_IN = 'operator-infix';
const TOK_TYPE_OP_POST = 'operator-postfix';
const TOK_TYPE_WSPACE = 'white-space';
const TOK_TYPE_UNKNOWN = 'unknown'

const TOK_SUBTYPE_START = 'start';
const TOK_SUBTYPE_STOP = 'stop';

const TOK_SUBTYPE_TEXT = 'text';
const TOK_SUBTYPE_NUMBER = 'number';
const TOK_SUBTYPE_LOGICAL = 'logical';
const TOK_SUBTYPE_ERROR = 'error';
const TOK_SUBTYPE_RANGE = 'range';

const TOK_SUBTYPE_MATH = 'math';
const TOK_SUBTYPE_CONCAT = 'concatenate';
const TOK_SUBTYPE_INTERSECT = 'intersect';
const TOK_SUBTYPE_UNION = 'union';

class f_token {
    constructor(value, type, subtype) {
        this.value = value;
        this.type = type;
        this.subtype = subtype;
    }
}

class f_tokens {
    constructor() {
        this.items = [];
        this.index = -1;
    }

    add(value, type, subtype) {
        if (!subtype) { subtype = ''; }
        let token = new f_token(value, type, subtype); 
        this.addRef(token); 
        return token; 
    }

    addRef(token) { 
        this.items.push(token); 
    }

    reset() { 
        this.index = -1; 
    }

    BOF() { 
        return (this.index <= 0); 
    }

    EOF() { 
        return (this.index >= (this.items.length - 1)); 
    }

    moveNext() { 
        if (this.EOF()) { return false; }
        this.index++; 
        return true; 
    }

    current() { 
        if (this.index == -1) { return null; }
        return (this.items[this.index]); 
    }

    next() { 
        if (this.EOF()) { return null; }
        return (this.items[this.index + 1]); 
    }

    previous() { 
        if (this.index < 1) { return null; }
        return (this.items[this.index - 1]); 
    }
}


class f_tokenStack {
    constructor() {
        this.items = [];
    }

    push(token) { 
        this.items.push(token); 
    }

    pop() { 
        let token = this.items.pop(); 
        return (new f_token('', token.type, TOK_SUBTYPE_STOP)); 
    }

    token() { 
        return ((this.items.length > 0) ? this.items[this.items.length - 1] : null); 
    }

    value() { 
        return ((this.token()) ? this.token().value : ''); 
    }

    type() { 
        return ((this.token()) ? this.token().type : ''); 
    }

    subtype() { 
        return ((this.token()) ? this.token().subtype : ''); 
    }
}


export default class Parser {

    constructor() { }

    getRangeTokens(formula = '') {
        let tokens = this.getTokens(formula);
        return tokens.items
            .filter((t) => { return t.subtype === 'range' })
            .map((r) => { return r.value; });
    }

    getTokens(formula) {
        let tokens = new f_tokens();
        let tokenStack = new f_tokenStack();
        let offset = 0;
        
        let currentChar = function () { return formula.substr(offset, 1); };
        let doubleChar = function () { return formula.substr(offset, 2); };
        let nextChar = function () { return formula.substr(offset + 1, 1); };
        let EOF = function () { return (offset >= formula.length); };

        let token = '';

        let inString = false;
        let inPath = false;
        let inRange = false;
        let inError = false;

        while (formula.length > 0) {
            if (formula.substr(0, 1) == ' ')
                formula = formula.substr(1);
            else {
                if (formula.substr(0, 1) == '=')
                    formula = formula.substr(1);
                break;
            }
        }

        let regexSN = /^[1-9]{1}(\.[0-9]+)?E{1}$/;

        while (!EOF()) {

            // state-dependent character evaluation (order is important)

            // double-quoted strings
            // embeds are doubled
            // end marks token

            if (inString) {
                if (currentChar() == '"') {
                    if (nextChar() == '"') {
                        token += '"';
                        offset += 1;
                    } else {
                        inString = false;
                        tokens.add(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_TEXT);
                        token = '';
                    }
                } else {
                    token += currentChar();
                }
                offset += 1;
                continue;
            }

            // single-quoted strings (links)
            // embeds are double
            // end does not mark a token

            if (inPath) {
                if (currentChar() == '\'') {
                    if (nextChar() == '\'') {
                        token += '\'';
                        offset += 1;
                    } else {
                        inPath = false;
                    }
                } else {
                    token += currentChar();
                }
                offset += 1;
                continue;
            }

            // bracked strings (range offset or linked workbook name)
            // no embeds (changed to "()" by Excel)
            // end does not mark a token

            if (inRange) {
                if (currentChar() == ']') {
                    inRange = false;
                }
                token += currentChar();
                offset += 1;
                continue;
            }

            // error values
            // end marks a token, determined from absolute list of values

            if (inError) {
                token += currentChar();
                offset += 1;
                if ((',#NULL!,#DIV/0!,#VALUE!,#REF!,#NAME?,#NUM!,#N/A,').indexOf(',' + token + ',') != -1) {
                    inError = false;
                    tokens.add(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_ERROR);
                    token = '';
                }
                continue;
            }

            // scientific notation check

            if (('+-').indexOf(currentChar()) != -1) {
                if (token.length > 1) {
                    if (token.match(regexSN)) {
                        token += currentChar();
                        offset += 1;
                        continue;
                    }
                }
            }

            // independent character evaulation (order not important)

            // establish state-dependent character evaluations

            if (currentChar() == '"') {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = '';
                }
                inString = true;
                offset += 1;
                continue;
            }

            if (currentChar() == '\'') {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = '';
                }
                inPath = true;
                offset += 1;
                continue;
            }

            if (currentChar() == '[') {
                inRange = true;
                token += currentChar();
                offset += 1;
                continue;
            }

            if (currentChar() == '#') {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = '';
                }
                inError = true;
                token += currentChar();
                offset += 1;
                continue;
            }

            // mark start and end of arrays and array rows

            if (currentChar() == '{') {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = '';
                }
                tokenStack.push(tokens.add('ARRAY', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                tokenStack.push(tokens.add('ARRAYROW', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                offset += 1;
                continue;
            }

            if (currentChar() == ';') {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                tokens.addRef(tokenStack.pop());
                tokens.add(',', TOK_TYPE_ARGUMENT);
                tokenStack.push(tokens.add('ARRAYROW', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                offset += 1;
                continue;
            }

            if (currentChar() == '}') {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                tokens.addRef(tokenStack.pop());
                tokens.addRef(tokenStack.pop());
                offset += 1;
                continue;
            }

            // trim white-space

            if (currentChar() == ' ') {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                tokens.add('', TOK_TYPE_WSPACE);
                offset += 1;
                while ((currentChar() == ' ') && (!EOF())) {
                    offset += 1;
                }
                continue;
            }

            // multi-character comparators

            if ((',>=,<=,<>,').indexOf(',' + doubleChar() + ',') != -1) {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                tokens.add(doubleChar(), TOK_TYPE_OP_IN, TOK_SUBTYPE_LOGICAL);
                offset += 2;
                continue;
            }

            // standard infix operators

            if (('+-*/^&=><').indexOf(currentChar()) != -1) {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                tokens.add(currentChar(), TOK_TYPE_OP_IN);
                offset += 1;
                continue;
            }

            // standard postfix operators

            if (('%').indexOf(currentChar()) != -1) {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                tokens.add(currentChar(), TOK_TYPE_OP_POST);
                offset += 1;
                continue;
            }

            // start subexpression or function

            if (currentChar() == '(') {
                if (token.length > 0) {
                    tokenStack.push(tokens.add(token, TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                    token = '';
                } else {
                    tokenStack.push(tokens.add('', TOK_TYPE_SUBEXPR, TOK_SUBTYPE_START));
                }
                offset += 1;
                continue;
            }

            // function, subexpression, array parameters

            if (currentChar() == ',') {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                if (!(tokenStack.type() == TOK_TYPE_FUNCTION)) {
                    tokens.add(currentChar(), TOK_TYPE_OP_IN, TOK_SUBTYPE_UNION);
                } else {
                    tokens.add(currentChar(), TOK_TYPE_ARGUMENT);
                }
                offset += 1;
                continue;
            }

            // stop subexpression

            if (currentChar() == ')') {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = '';
                }
                tokens.addRef(tokenStack.pop());
                offset += 1;
                continue;
            }

            // token accumulation

            token += currentChar();
            offset += 1;

        }

        // dump remaining accumulation

        if (token.length > 0) tokens.add(token, TOK_TYPE_OPERAND);

        // move all tokens to a new collection, excluding all unnecessary white-space tokens

        let tokens2 = new f_tokens();

        while (tokens.moveNext()) {

            token = tokens.current();

            if (token.type == TOK_TYPE_WSPACE) {
                if ((tokens.BOF()) || (tokens.EOF())) { }
                else if (!(
                    ((tokens.previous().type == TOK_TYPE_FUNCTION) && (tokens.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    ((tokens.previous().type == TOK_TYPE_SUBEXPR) && (tokens.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    (tokens.previous().type == TOK_TYPE_OPERAND)
                )
                ) { }
                else if (!(
                    ((tokens.next().type == TOK_TYPE_FUNCTION) && (tokens.next().subtype == TOK_SUBTYPE_START)) ||
                    ((tokens.next().type == TOK_TYPE_SUBEXPR) && (tokens.next().subtype == TOK_SUBTYPE_START)) ||
                    (tokens.next().type == TOK_TYPE_OPERAND)
                )
                ) { }
                else
                    tokens2.add(token.value, TOK_TYPE_OP_IN, TOK_SUBTYPE_INTERSECT);
                continue;
            }

            tokens2.addRef(token);

        }

        // switch infix "-" operator to prefix when appropriate, switch infix "+" operator to noop when appropriate, identify operand 
        // and infix-operator subtypes, pull "@" from in front of function names

        while (tokens2.moveNext()) {

            token = tokens2.current();

            if ((token.type == TOK_TYPE_OP_IN) && (token.value == '-')) {
                if (tokens2.BOF())
                    token.type = TOK_TYPE_OP_PRE;
                else if (
                    ((tokens2.previous().type == TOK_TYPE_FUNCTION) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    ((tokens2.previous().type == TOK_TYPE_SUBEXPR) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    (tokens2.previous().type == TOK_TYPE_OP_POST) ||
                    (tokens2.previous().type == TOK_TYPE_OPERAND)
                )
                    token.subtype = TOK_SUBTYPE_MATH;
                else
                    token.type = TOK_TYPE_OP_PRE;
                continue;
            }

            if ((token.type == TOK_TYPE_OP_IN) && (token.value == '+')) {
                if (tokens2.BOF())
                    token.type = TOK_TYPE_NOOP;
                else if (
                    ((tokens2.previous().type == TOK_TYPE_FUNCTION) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    ((tokens2.previous().type == TOK_TYPE_SUBEXPR) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    (tokens2.previous().type == TOK_TYPE_OP_POST) ||
                    (tokens2.previous().type == TOK_TYPE_OPERAND)
                )
                    token.subtype = TOK_SUBTYPE_MATH;
                else
                    token.type = TOK_TYPE_NOOP;
                continue;
            }

            if ((token.type == TOK_TYPE_OP_IN) && (token.subtype.length == 0)) {
                if (('<>=').indexOf(token.value.substr(0, 1)) != -1)
                    token.subtype = TOK_SUBTYPE_LOGICAL;
                else if (token.value == '&')
                    token.subtype = TOK_SUBTYPE_CONCAT;
                else
                    token.subtype = TOK_SUBTYPE_MATH;
                continue;
            }

            if ((token.type == TOK_TYPE_OPERAND) && (token.subtype.length == 0)) {
                if (isNaN(parseFloat(token.value)))
                    if ((token.value == 'TRUE') || (token.value == 'FALSE'))
                        token.subtype = TOK_SUBTYPE_LOGICAL;
                    else
                        token.subtype = TOK_SUBTYPE_RANGE;
                else
                    token.subtype = TOK_SUBTYPE_NUMBER;
                continue;
            }

            if (token.type == TOK_TYPE_FUNCTION) {
                if (token.value.substr(0, 1) == '@')
                    token.value = token.value.substr(1);
                continue;
            }

        }

        tokens2.reset();

        // move all tokens to a new collection, excluding all noops

        tokens = new f_tokens();

        while (tokens2.moveNext()) {
            if (tokens2.current().type != TOK_TYPE_NOOP)
                tokens.addRef(tokens2.current());
        }

        tokens.reset();

        return tokens;
    }
}